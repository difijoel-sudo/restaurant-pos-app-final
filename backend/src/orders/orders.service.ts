import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddItemDto } from './dto/add-item.dto';
import { SettleOrderDto } from './dto/settle-order.dto';
import { PromoCodesService } from '../promo-codes/promo-codes.service';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly promoCodeService: PromoCodesService,
    private readonly eventsGateway: EventsGateway,
  ) {}
  
  async create(createDto: CreateOrderDto, userId: number) {
    const order = await this.prisma.order.create({ data: { ...createDto, createdById: userId, totalAmount: 0, taxAmount: 0, grandTotal: 0 } });
    this.eventsGateway.server.emit('newOrder', order);
    return order;
  }

  findAllOpen() { return this.prisma.order.findMany({ where: { status: 'OPEN' }, include: { table: true, items: { include: { menuItem: true } } } }); }
  findOne(id: number) { return this.prisma.order.findUniqueOrThrow({ where: { id }, include: { items: { include: { menuItem: true, orderItemModifiers: { include: { modifier: true } } } }, table: true, customer: true } }); }
  
  async addItem(orderId: number, addItemDto: AddItemDto) {
    const { menuItemId, quantity, modifierIds } = addItemDto;
    
    // --- THIS IS THE FIX ---
    // If an item has no modifiers, check if it already exists in the order.
    if (!modifierIds || modifierIds.length === 0) {
        const existingItem = await this.prisma.orderItem.findFirst({
            where: {
                orderId: orderId,
                menuItemId: menuItemId,
                orderItemModifiers: { none: {} } // Ensure it has no modifiers
            }
        });

        // If it exists, just update the quantity
        if (existingItem) {
            await this.prisma.orderItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
            await this.recalculateTotals(orderId);
            this.eventsGateway.server.emit('orderUpdate', await this.findOne(orderId));
            return existingItem;
        }
    }
    // --- END OF FIX ---

    // If it's a new item or has modifiers, create a new entry.
    const menuItem = await this.prisma.menuItem.findUniqueOrThrow({ where: { id: menuItemId } });
    const modifiers = await this.prisma.modifier.findMany({ where: { id: { in: modifierIds || [] } } });
    
    const orderItem = await this.prisma.orderItem.create({
      data: {
        orderId,
        menuItemId,
        quantity,
        priceAtOrder: menuItem.price,
        orderItemModifiers: {
          create: modifiers.map(mod => ({ modifierId: mod.id, priceAtOrder: mod.price }))
        }
      }
    });

    await this.recalculateTotals(orderId);
    this.eventsGateway.server.emit('orderUpdate', await this.findOne(orderId));
    return orderItem;
  }

  async applyPromoCode(orderId: number, code: string) {
    const promo = await this.promoCodeService.validatePromoCode(code);
    const order = await this.findOne(orderId);
    let discountAmount = 0;
    if (promo.discountType === 'PERCENTAGE') {
      discountAmount = (order.totalAmount * promo.value) / 100;
    } else {
      discountAmount = promo.value;
    }
    await this.prisma.order.update({ where: { id: orderId }, data: { discountAmount } });
    await this.recalculateTotals(orderId);
    return this.findOne(orderId);
  }

  async settleOrder(orderId: number, settleDto: SettleOrderDto, userId: number) {
    const order = await this.findOne(orderId);
    await this.prisma.order.update({ where: { id: orderId }, data: { status: 'SETTLED' } });
    if (settleDto.paymentMode === 'CASH') {
      await this.prisma.cashLedgerEntry.create({
        data: {
          type: 'CASH_SALE',
          amount: order.grandTotal,
          remarks: `Sale for Order #${order.id}`,
          terminalId: 1, // TODO: Get terminal ID from request
          userId: userId,
        }
      });
    }
    this.eventsGateway.server.emit('orderSettled', { orderId });
    return { success: true, message: 'Order settled successfully' };
  }

  private async recalculateTotals(orderId: number) {
    const order = await this.prisma.order.findUniqueOrThrow({ where: { id: orderId }, include: { items: { include: { menuItem: { include: { gstSlab: true } }, orderItemModifiers: true } } } });
    
    const totalAmount = order.items.reduce((acc, item) => {
        const modifiersTotal = item.orderItemModifiers.reduce((modAcc, mod) => modAcc + mod.priceAtOrder, 0);
        return acc + ((item.priceAtOrder + modifiersTotal) * item.quantity);
    }, 0);
    
    const taxAmount = order.items.reduce((acc, item) => {
        const gst = item.menuItem.gstSlab;
        if (!gst) return acc;
        const modifiersTotal = item.orderItemModifiers.reduce((modAcc, mod) => modAcc + mod.priceAtOrder, 0);
        const itemTotal = (item.priceAtOrder + modifiersTotal) * item.quantity;
        const tax = (itemTotal * (gst.cgstRate + gst.sgstRate)) / 100;
        return acc + tax;
    }, 0);
        
    const grandTotal = totalAmount + taxAmount - (order.discountAmount || 0);

    await this.prisma.order.update({ where: { id: orderId }, data: { totalAmount, taxAmount, grandTotal } });
  }
}
