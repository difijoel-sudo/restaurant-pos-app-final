import React from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div` display: flex; flex-direction: column; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); height: 100%; `;
const Header = styled.div` padding: 16px; border-bottom: 1px solid #e2e8f0; font-weight: bold; font-size: 1.25rem;`;
const ItemList = styled.div` flex-grow: 1; padding: 16px; overflow-y: auto;`;
const BillItem = styled.div` display: flex; align-items: center; gap: 12px; margin-bottom: 12px;`;
const ItemDetails = styled.div` flex-grow: 1;`;
const ItemName = styled.div` font-weight: 600;`;
const ItemPrice = styled.div` font-size: 12px; color: #64748b;`;
const QuantityControl = styled.div` display: flex; align-items: center; gap: 8px; background-color: #f1f5f9; border-radius: 8px; padding: 4px;`;
const QuantityButton = styled.button` border: none; background: none; font-weight: bold; cursor: pointer; width: 24px; height: 24px;`;
const Footer = styled.div` padding: 16px; border-top: 1px solid #e2e8f0; background-color: #f8fafc;`;
const SummaryLine = styled.div` display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;`;
const TotalLine = styled(SummaryLine)` font-weight: bold; font-size: 1.25rem; margin-top: 16px;`;
const SettleButton = styled.button` width: 100%; padding: 16px; background-color: #16a34a; color: white; border: none; border-radius: 8px; font-size: 1.25rem; font-weight: bold; cursor: pointer; margin-top: 16px; &:hover { background-color: #15803d; }`;
const ActionButtons = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 16px;`;
const ActionButton = styled.button` padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; background-color: white; font-weight: 600; cursor: pointer;`;

function BillPanel({ currentOrder, onOpenSettle, onOpenCustomer }) {
    if (!currentOrder) {
        return (
            <PanelContainer>
                <Header>Bill</Header>
                <div style={{padding: '16px', textAlign: 'center', color: '#64748b'}}>No active order selected.</div>
            </PanelContainer>
        )
    }

    return (
        <PanelContainer>
            <Header>Bill - {currentOrder.table ? currentOrder.table.name : currentOrder.orderType}</Header>
            <ItemList>
                {currentOrder.items.map(item => (
                    <BillItem key={item.id}>
                        <ItemDetails>
                            <ItemName>{item.menuItem.name}</ItemName>
                            <ItemPrice>₹{item.priceAtOrder.toFixed(2)}</ItemPrice>
                        </ItemDetails>
                        <QuantityControl>
                            <QuantityButton>-</QuantityButton>
                            <span>{item.quantity}</span>
                            <QuantityButton>+</QuantityButton>
                        </QuantityControl>
                        <div>₹{(item.priceAtOrder * item.quantity).toFixed(2)}</div>
                    </BillItem>
                ))}
            </ItemList>
            <Footer>
                <SummaryLine><span>Subtotal</span> <span>₹{currentOrder.totalAmount.toFixed(2)}</span></SummaryLine>
                <SummaryLine><span>Discount</span> <span>- ₹{currentOrder.discountAmount.toFixed(2)}</span></SummaryLine>
                <SummaryLine><span>Tax (GST)</span> <span>+ ₹{currentOrder.taxAmount.toFixed(2)}</span></SummaryLine>
                <hr style={{border: 'none', borderTop: '1px dashed #cbd5e1', margin: '16px 0'}} />
                <TotalLine><span>Grand Total</span> <span>₹{currentOrder.grandTotal.toFixed(2)}</span></TotalLine>
                <ActionButtons>
                    <ActionButton onClick={onOpenCustomer}>Add Customer</ActionButton>
                    <ActionButton>Apply Promo</ActionButton>
                    <ActionButton>Send KOT</ActionButton>
                    <ActionButton>Print Bill</ActionButton>
                </ActionButtons>
                <SettleButton onClick={onOpenSettle}>Settle Bill</SettleButton>
            </Footer>
        </PanelContainer>
    );
}

export default BillPanel;