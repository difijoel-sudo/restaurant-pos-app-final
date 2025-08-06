import React, { useState, useEffect, useCallback } from 'react';
import ApiClient from '../services/ApiClient';
import styled from 'styled-components';
import MenuPanel from '../components/MenuPanel';
import BillPanel from '../components/BillPanel';
import OrderPanel from '../components/OrderPanel';
import ModifierModal from '../components/ModifierModal';
import CustomerModal from '../components/CustomerModal';
import SettleModal from '../components/SettleModal';
import { useSocket } from '../hooks/useSocket';

const POSLayout = styled.div`
    display: grid;
    grid-template-columns: 3fr 4fr 3fr;
    gap: 16px;
    padding: 16px;
    height: calc(100vh - 70px);
    background-color: #f1f5f9;
`;

function POSPage() {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [modifierGroups, setModifierGroups] = useState([]);
    const [tableAreas, setTableAreas] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);
    const [error, setError] = useState('');
    const socket = useSocket();

    const [isModifierModalOpen, setModifierModalOpen] = useState(false);
    const [itemForModifiers, setItemForModifiers] = useState(null);
    const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
    const [isSettleModalOpen, setSettleModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [menuRes, catRes, tableAreaRes, ordersRes, modGroupRes] = await Promise.all([
                ApiClient.get('/menu-items'),
                ApiClient.get('/categories'),
                ApiClient.get('/table-areas'),
                ApiClient.get('/orders'),
                ApiClient.get('/modifier-groups'),
            ]);
            setMenuItems(menuRes.data);
            setCategories(catRes.data);
            setTableAreas(tableAreaRes.data);
            setActiveOrders(ordersRes.data);
            setModifierGroups(modGroupRes.data);
        } catch (err) {
            setError('Failed to fetch initial data. Please check the backend connection.');
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    useEffect(() => {
        if (socket) {
            const handleOrderUpdate = (updatedOrder) => {
                setActiveOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
                if (activeOrder?.id === updatedOrder.id) {
                    setActiveOrder(updatedOrder);
                }
            };
            const handleNewOrder = (newOrder) => {
                setActiveOrders(prev => [...prev, newOrder]);
            };
            const handleOrderSettled = ({ orderId }) => {
                setActiveOrders(prev => prev.filter(o => o.id !== orderId));
                if (activeOrder?.id === orderId) {
                    setActiveOrder(null);
                }
            };

            socket.on('orderUpdate', handleOrderUpdate);
            socket.on('newOrder', handleNewOrder);
            socket.on('orderSettled', handleOrderSettled);
            
            return () => {
                socket.off('orderUpdate', handleOrderUpdate);
                socket.off('newOrder', handleNewOrder);
                socket.off('orderSettled', handleOrderSettled);
            };
        }
    }, [socket, activeOrder]);
    
    const handleNewOrder = async (orderType, tableId = null) => {
        try {
            const response = await ApiClient.post('/orders', { orderType, tableId });
            const newOrder = await ApiClient.get(`/orders/${response.data.id}`);
            setActiveOrder(newOrder.data);
        } catch (err) {
            setError('Failed to create new order.');
        }
    };

    const handleAddItem = (item) => {
        if (!activeOrder) {
            setError('Please select or create an order first.');
            return;
        }
        
        const linkedGroupIds = item.modifierGroups.map(mg => mg.modifierGroupId);
        const requiredGroups = modifierGroups.filter(mg => linkedGroupIds.includes(mg.id) && mg.type === 'REQUIRED');

        if (requiredGroups.length > 0 || (linkedGroupIds.length > 0 && modifierGroups.some(mg => linkedGroupIds.includes(mg.id) && mg.type === 'OPTIONAL'))) {
            setItemForModifiers(item);
            setModifierModalOpen(true);
        } else {
            addItemToOrder(item.id, 1, []);
        }
    };

    const addItemToOrder = async (menuItemId, quantity, modifierIds) => {
        try {
            await ApiClient.post(`/orders/${activeOrder.id}/add-item`, {
                menuItemId,
                quantity,
                modifierIds
            });
        } catch (err) {
            setError('Failed to add item to order.');
        }
    };

    return (
        <>
            <POSLayout>
                <OrderPanel 
                    tableAreas={tableAreas} 
                    activeOrders={activeOrders}
                    activeOrder={activeOrder}
                    onSelectOrder={setActiveOrder}
                    onNewOrder={handleNewOrder}
                />
                <MenuPanel 
                    categories={categories} 
                    menuItems={menuItems}
                    onAddItem={handleAddItem}
                />
                <BillPanel 
                    currentOrder={activeOrder} 
                    onOpenSettle={() => setSettleModalOpen(true)}
                    onOpenCustomer={() => setCustomerModalOpen(true)}
                />
            </POSLayout>
            
            {isModifierModalOpen && (
                <ModifierModal 
                    item={itemForModifiers}
                    modifierGroups={modifierGroups}
                    onClose={() => setModifierModalOpen(false)}
                    onAddToOrder={addItemToOrder}
                />
            )}
            {isCustomerModalOpen && (
                <CustomerModal 
                    orderId={activeOrder?.id}
                    onClose={() => setCustomerModalOpen(false)}
                />
            )}
            {isSettleModalOpen && (
                <SettleModal 
                    order={activeOrder}
                    onClose={() => setSettleModalOpen(false)}
                />
            )}
        </>
    );
}

export default POSPage;