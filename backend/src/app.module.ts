import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { KitchensModule } from './kitchens/kitchens.module';
import { GstsModule } from './gsts/gsts.module';
import { ModifierGroupsModule } from './modifier-groups/modifier-groups.module';
import { ModifiersModule } from './modifiers/modifiers.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { TableAreasModule } from './table-areas/table-areas.module';
import { TablesModule } from './tables/tables.module';
import { PrintersModule } from './printers/printers.module';
import { TerminalsModule } from './terminals/terminals.module';
import { PromoCodesModule } from './promo-codes/promo-codes.module';
import { InvoiceTemplatesModule } from './invoice-templates/invoice-templates.module';
import { CustomersModule } from './customers/customers.module'; 
import { OrdersModule } from './orders/orders.module';        
import { EventsModule } from './events/events.module';     

@Module({
  imports: [
    PrismaModule, AuthModule, UsersModule, CategoriesModule, KitchensModule,
    GstsModule, ModifierGroupsModule, ModifiersModule, MenuItemsModule,
    TableAreasModule, TablesModule, PrintersModule, TerminalsModule,
    PromoCodesModule, InvoiceTemplatesModule, CustomersModule, OrdersModule,
    EventsModule,
  ],
})
export class AppModule {}