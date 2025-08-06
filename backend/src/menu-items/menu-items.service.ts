import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import * as xlsx from 'xlsx';

interface ExcelRow { Name: string; Price: number; Description?: string; Category: string; Kitchen?: string; Gst?: string; Barcode?: string; "Modifier Groups"?: string; }

@Injectable()
export class MenuItemsService {
  constructor(private readonly prisma: PrismaService) {}
  
  async create(createMenuItemDto: CreateMenuItemDto) { 
    const { modifierGroupIds, ...itemData } = createMenuItemDto;
    if (!itemData.barcode) { itemData.barcode = `ITEM-${Date.now()}-${Math.floor(Math.random() * 1000)}`; }
    await this.prisma.category.findUniqueOrThrow({ where: { id: itemData.categoryId } }); 
    if (itemData.kitchenId) { await this.prisma.kitchen.findUniqueOrThrow({ where: { id: itemData.kitchenId } }); } 
    if (itemData.gstSlabId) { await this.prisma.gstSlab.findUniqueOrThrow({ where: { id: itemData.gstSlabId } }); } 
    return this.prisma.menuItem.create({ 
      data: {
        ...itemData,
        modifierGroups: {
          create: modifierGroupIds?.map(id => ({
            modifierGroup: { connect: { id } }
          }))
        }
      }
    }); 
  }

  findAll() { 
    return this.prisma.menuItem.findMany({ 
      include: { 
        category: true, 
        kitchen: true, 
        gstSlab: true,
        modifierGroups: {
          include: {
            modifierGroup: true
          }
        }
      } 
    }); 
  }
  
  async findOne(id: number) {
    const menuItem = await this.prisma.menuItem.findUnique({
        where: { id },
        include: {
            category: true,
            kitchen: true,
            gstSlab: true,
            modifierGroups: {
                select: {
                    modifierGroupId: true
                }
            }
        }
    });
    if (!menuItem) {
        throw new NotFoundException(`Menu item with ID ${id} not found.`);
    }
    return menuItem;
  }
  
  async update(id: number, updateMenuItemDto: UpdateMenuItemDto) { 
    const { modifierGroupIds, ...itemData } = updateMenuItemDto;
    await this.prisma.menuItem.findUniqueOrThrow({ where: { id } }); 
    return this.prisma.menuItem.update({ 
      where: { id }, 
      data: {
        ...itemData,
        modifierGroups: {
          deleteMany: {}, 
          create: modifierGroupIds?.map(groupId => ({
            modifierGroup: { connect: { id: groupId } }
          }))
        }
      }
    }); 
  }

  async remove(id: number) { 
    await this.prisma.menuItem.findUniqueOrThrow({ where: { id } }); 
    return this.prisma.menuItem.delete({ where: { id } }); 
  }

  async bulkUploadFromExcel(buffer: Buffer) { 
    const workbook = xlsx.read(buffer, { type: 'buffer' }); 
    const sheetName = workbook.SheetNames[0]; 
    const sheet = workbook.Sheets[sheetName]; 
    const data: ExcelRow[] = xlsx.utils.sheet_to_json(sheet); 
    if (data.length === 0) { throw new BadRequestException('Excel file is empty.'); } 
    
    const categories = await this.prisma.category.findMany(); 
    const kitchens = await this.prisma.kitchen.findMany(); 
    const gstSlabs = await this.prisma.gstSlab.findMany(); 
    const modifierGroups = await this.prisma.modifierGroup.findMany();

    const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id])); 
    const kitchenMap = new Map(kitchens.map(k => [k.name.toLowerCase(), k.id])); 
    const gstSlabMap = new Map(gstSlabs.map(g => [g.name.toLowerCase(), g.id])); 
    const modifierGroupMap = new Map(modifierGroups.map(mg => [mg.name.toLowerCase(), mg.id]));

    let successCount = 0;
    const errors: string[] = []; 
    
    for (const row of data) { 
      try {
        const categoryName = row.Category?.toString().toLowerCase(); 
        const categoryId = categoryMap.get(categoryName); 
        if (!row.Name || !row.Price || !categoryId) { 
          errors.push(`Skipping row for "${row.Name || 'Unknown'}": Missing Name, Price, or invalid Category.`); 
          continue; 
        }

        const kitchenName = row.Kitchen?.toString().toLowerCase(); 
        const gstSlabName = row.Gst?.toString().toLowerCase(); 
        const kitchenId = kitchenName ? kitchenMap.get(kitchenName) : undefined; 
        const gstSlabId = gstSlabName ? gstSlabMap.get(gstSlabName) : undefined; 
        
        const modifierGroupNames = row["Modifier Groups"]?.split(',').map(name => name.trim().toLowerCase()) || [];
        const modifierGroupIds = modifierGroupNames
          .map(name => modifierGroupMap.get(name))
          .filter((id): id is number => id !== undefined);

        const createDto: CreateMenuItemDto = {
          name: row.Name, 
          price: parseFloat(row.Price.toString()), 
          description: row.Description || undefined, 
          categoryId: categoryId, 
          kitchenId: kitchenId, 
          gstSlabId: gstSlabId,
          barcode: row.Barcode?.toString() || undefined,
          modifierGroupIds: modifierGroupIds
        };

        // Use the 'create' method for each row to handle relations
        await this.create(createDto);
        successCount++;

      } catch (e) {
        errors.push(`Failed to process row for "${row.Name || 'Unknown'}": ${e.message}`);
      }
    } 
    
    return { success: true, message: `Successfully imported ${successCount} of ${data.length} items.`, errors: errors }; 
  }
}
