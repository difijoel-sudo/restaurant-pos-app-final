-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'MENU_MANAGER', 'STAFF', 'WAITER', 'KITCHEN');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."DiscountType" AS ENUM ('PERCENTAGE', 'FLAT');

-- CreateEnum
CREATE TYPE "public"."PromoCodeStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."PrinterConnectionType" AS ENUM ('IP', 'SHARED');

-- CreateEnum
CREATE TYPE "public"."OrderType" AS ENUM ('DINE_IN', 'TAKEAWAY', 'DELIVERY');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('OPEN', 'BILLED', 'SETTLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."KOTStatus" AS ENUM ('NEW', 'PREPARING', 'READY');

-- CreateEnum
CREATE TYPE "public"."CashLedgerEntryType" AS ENUM ('OPENING_BALANCE', 'CASH_SALE', 'CASH_IN', 'CASH_OUT');

-- CreateEnum
CREATE TYPE "public"."ModifierGroupType" AS ENUM ('REQUIRED', 'OPTIONAL');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'WAITER',
    "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MenuItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "barcode" TEXT,
    "categoryId" INTEGER NOT NULL,
    "kitchenId" INTEGER,
    "gstSlabId" INTEGER,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ModifierGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."ModifierGroupType" NOT NULL DEFAULT 'OPTIONAL',

    CONSTRAINT "ModifierGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Modifier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "modifierGroupId" INTEGER NOT NULL,

    CONSTRAINT "Modifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MenuItemModifierGroup" (
    "menuItemId" INTEGER NOT NULL,
    "modifierGroupId" INTEGER NOT NULL,

    CONSTRAINT "MenuItemModifierGroup_pkey" PRIMARY KEY ("menuItemId","modifierGroupId")
);

-- CreateTable
CREATE TABLE "public"."TableArea" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TableArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Table" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tableAreaId" INTEGER NOT NULL,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Kitchen" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Kitchen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GstSlab" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cgstRate" DOUBLE PRECISION NOT NULL,
    "sgstRate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GstSlab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Printer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "connectionType" "public"."PrinterConnectionType" NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "Printer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Terminal" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "defaultBillPrinterId" INTEGER NOT NULL,

    CONSTRAINT "Terminal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TerminalKitchenPrinterMap" (
    "id" SERIAL NOT NULL,
    "terminalId" INTEGER NOT NULL,
    "kitchenId" INTEGER NOT NULL,
    "printerId" INTEGER NOT NULL,

    CONSTRAINT "TerminalKitchenPrinterMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PromoCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "discountType" "public"."DiscountType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "status" "public"."PromoCodeStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InvoiceTemplate" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "logoUrl" TEXT,
    "restaurantName" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "gstin" TEXT,
    "footerText" TEXT,

    CONSTRAINT "InvoiceTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderType" "public"."OrderType" NOT NULL,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'OPEN',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "grandTotal" DOUBLE PRECISION NOT NULL,
    "tableId" INTEGER,
    "customerId" INTEGER,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderItem" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priceAtOrder" DOUBLE PRECISION NOT NULL,
    "orderId" INTEGER NOT NULL,
    "menuItemId" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderItemModifier" (
    "id" SERIAL NOT NULL,
    "priceAtOrder" DOUBLE PRECISION NOT NULL,
    "orderItemId" INTEGER NOT NULL,
    "modifierId" INTEGER NOT NULL,

    CONSTRAINT "OrderItemModifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KOT" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."KOTStatus" NOT NULL DEFAULT 'NEW',
    "orderId" INTEGER NOT NULL,
    "kitchenId" INTEGER NOT NULL,

    CONSTRAINT "KOT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KOTItem" (
    "id" SERIAL NOT NULL,
    "kotId" INTEGER NOT NULL,
    "orderItemId" INTEGER NOT NULL,

    CONSTRAINT "KOTItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CashLedgerEntry" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "public"."CashLedgerEntryType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT,
    "terminalId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CashLedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_barcode_key" ON "public"."MenuItem"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "ModifierGroup_name_key" ON "public"."ModifierGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TableArea_name_key" ON "public"."TableArea"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Table_name_tableAreaId_key" ON "public"."Table"("name", "tableAreaId");

-- CreateIndex
CREATE UNIQUE INDEX "Kitchen_name_key" ON "public"."Kitchen"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GstSlab_name_key" ON "public"."GstSlab"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Printer_name_key" ON "public"."Printer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Terminal_name_key" ON "public"."Terminal"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Terminal_ipAddress_key" ON "public"."Terminal"("ipAddress");

-- CreateIndex
CREATE UNIQUE INDEX "TerminalKitchenPrinterMap_terminalId_kitchenId_key" ON "public"."TerminalKitchenPrinterMap"("terminalId", "kitchenId");

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_code_key" ON "public"."PromoCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "public"."Customer"("phone");

-- AddForeignKey
ALTER TABLE "public"."MenuItem" ADD CONSTRAINT "MenuItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MenuItem" ADD CONSTRAINT "MenuItem_kitchenId_fkey" FOREIGN KEY ("kitchenId") REFERENCES "public"."Kitchen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MenuItem" ADD CONSTRAINT "MenuItem_gstSlabId_fkey" FOREIGN KEY ("gstSlabId") REFERENCES "public"."GstSlab"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Modifier" ADD CONSTRAINT "Modifier_modifierGroupId_fkey" FOREIGN KEY ("modifierGroupId") REFERENCES "public"."ModifierGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MenuItemModifierGroup" ADD CONSTRAINT "MenuItemModifierGroup_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "public"."MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MenuItemModifierGroup" ADD CONSTRAINT "MenuItemModifierGroup_modifierGroupId_fkey" FOREIGN KEY ("modifierGroupId") REFERENCES "public"."ModifierGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Table" ADD CONSTRAINT "Table_tableAreaId_fkey" FOREIGN KEY ("tableAreaId") REFERENCES "public"."TableArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Terminal" ADD CONSTRAINT "Terminal_defaultBillPrinterId_fkey" FOREIGN KEY ("defaultBillPrinterId") REFERENCES "public"."Printer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TerminalKitchenPrinterMap" ADD CONSTRAINT "TerminalKitchenPrinterMap_terminalId_fkey" FOREIGN KEY ("terminalId") REFERENCES "public"."Terminal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TerminalKitchenPrinterMap" ADD CONSTRAINT "TerminalKitchenPrinterMap_kitchenId_fkey" FOREIGN KEY ("kitchenId") REFERENCES "public"."Kitchen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TerminalKitchenPrinterMap" ADD CONSTRAINT "TerminalKitchenPrinterMap_printerId_fkey" FOREIGN KEY ("printerId") REFERENCES "public"."Printer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "public"."Table"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "public"."MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItemModifier" ADD CONSTRAINT "OrderItemModifier_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "public"."OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItemModifier" ADD CONSTRAINT "OrderItemModifier_modifierId_fkey" FOREIGN KEY ("modifierId") REFERENCES "public"."Modifier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KOT" ADD CONSTRAINT "KOT_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KOT" ADD CONSTRAINT "KOT_kitchenId_fkey" FOREIGN KEY ("kitchenId") REFERENCES "public"."Kitchen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KOTItem" ADD CONSTRAINT "KOTItem_kotId_fkey" FOREIGN KEY ("kotId") REFERENCES "public"."KOT"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KOTItem" ADD CONSTRAINT "KOTItem_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "public"."OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CashLedgerEntry" ADD CONSTRAINT "CashLedgerEntry_terminalId_fkey" FOREIGN KEY ("terminalId") REFERENCES "public"."Terminal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CashLedgerEntry" ADD CONSTRAINT "CashLedgerEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
