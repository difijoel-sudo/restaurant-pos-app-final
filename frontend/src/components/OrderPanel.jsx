import React from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div` display: flex; flex-direction: column; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); padding: 16px; height: 100%; overflow-y: auto;`;
const OrderTabs = styled.div` display: flex; gap: 8px; margin-bottom: 16px;`;
const TabButton = styled.button` flex-grow: 1; padding: 12px; border: 1px solid #cbd5e1; background-color: white; color: #334155; font-weight: 600; border-radius: 8px; cursor: pointer;`;
const TableGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 8px;`;
const TableButton = styled.button` padding: 16px 8px; border: 2px solid ${props => props.$active ? '#2563eb' : '#e2e8f0'}; background-color: ${props => props.$occupied ? '#fefce8' : 'white'}; color: #334155; font-weight: 600; border-radius: 8px; cursor: pointer;`;

function OrderPanel({ tableAreas, activeOrders, activeOrder, onSelectOrder, onNewOrder }) {
    return (
        <PanelContainer>
            <OrderTabs>
                <TabButton onClick={() => onNewOrder('TAKEAWAY')}>New Takeaway</TabButton>
                <TabButton onClick={() => onNewOrder('DELIVERY')}>New Delivery</TabButton>
            </OrderTabs>
            {tableAreas.map(area => (
                <div key={area.id}>
                    <h3 style={{marginTop: 0, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px'}}>{area.name}</h3>
                    <TableGrid>
                        {area.tables.map(table => {
                            const orderForTable = activeOrders.find(o => o.tableId === table.id);
                            const isActive = activeOrder?.id === orderForTable?.id;
                            return (
                                <TableButton 
                                    key={table.id}
                                    $active={isActive}
                                    $occupied={!!orderForTable}
                                    onClick={() => orderForTable ? onSelectOrder(orderForTable) : onNewOrder('DINE_IN', table.id)}
                                >
                                    {table.name}
                                </TableButton>
                            )
                        })}
                    </TableGrid>
                </div>
            ))}
        </PanelContainer>
    );
}

export default OrderPanel;