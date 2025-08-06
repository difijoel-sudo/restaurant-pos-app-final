import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import UserManagementPage from './components/UserManagementPage';
import CategoriesPage from './components/CategoriesPage';
import KitchensPage from './components/KitchensPage';
import GstsPage from './components/GstsPage';
import ModifiersPage from './components/ModifiersPage';
import MenuItemsPage from './components/MenuItemsPage';
import TableManagementPage from './components/TableManagementPage';
import PrintersPage from './components/PrintersPage';
import TerminalsPage from './components/TerminalsPage';
import PromoCodesPage from './components/PromoCodesPage';
import InvoiceTemplatePage from './components/InvoiceTemplatePage';
import POSPage from './pages/POSPage';
import Nav from './components/Nav';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f1f5f9;
`;

function AdminRouter({ currentPage }) {
    if (currentPage === 'users') return <UserManagementPage />;
    if (currentPage === 'categories') return <CategoriesPage />;
    if (currentPage === 'kitchens') return <KitchensPage />;
    if (currentPage === 'gsts') return <GstsPage />;
    if (currentPage === 'modifiers') return <ModifiersPage />;
    if (currentPage === 'menu-items') return <MenuItemsPage />;
    if (currentPage === 'tables') return <TableManagementPage />;
    if (currentPage === 'printers') return <PrintersPage />;
    if (currentPage === 'terminals') return <TerminalsPage />;
    if (currentPage === 'promo-codes') return <PromoCodesPage />;
    if (currentPage === 'invoice-template') return <InvoiceTemplatePage />;
    return <POSPage />;
}

function App() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('pos');

  if (!user) {
    return <LoginPage />;
  }

  return (
    <AppContainer>
      <Nav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main style={{flexGrow: 1}}>
        {user.role === 'ADMIN' && <AdminRouter currentPage={currentPage} />}
        {user.role === 'STAFF' && <POSPage />}
        {user.role === 'WAITER' && <div style={{padding: '32px'}}>Waiter POS (Coming Soon)</div>}
        {user.role === 'KITCHEN' && <div style={{padding: '32px'}}>Kitchen Display (Coming Soon)</div>}
      </main>
    </AppContainer>
  );
}

export default App;