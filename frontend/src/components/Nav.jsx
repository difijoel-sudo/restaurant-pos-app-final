import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

// --- STYLED COMPONENTS (Updated) ---
const NavContainer = styled.nav`
  background-color: #1e293b;
  color: white;
  padding: 16px 32px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const NavLinks = styled.div`
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
`;

const NavLink = styled.button`
  color: white;
  font-weight: 600;
  font-size: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding-bottom: 4px;
  border-bottom: 2px solid ${props => (props.$active ? '#3b82f6' : 'transparent')};
  &:hover {
    color: #94a3b8;
  }
`;

// This new container will hold the user info and logout button
const UserActions = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    margin-left: auto; /* This is the magic line that pushes it to the right */
`;

const UserInfo = styled.div`
    font-weight: 500;
`;

const LogoutButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #b91c1c;
  }
`;

// --- REACT COMPONENT ---
function Nav({ currentPage, setCurrentPage }) {
    const { user, logout } = useAuth();
    const isAdmin = user.role === 'ADMIN';
    const isMenuManager = user.role === 'MENU_MANAGER';

    return (
        <NavContainer>
            <NavLinks>
                {(isAdmin || isMenuManager) && <NavLink $active={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')}>Dashboard</NavLink>}
                {isAdmin && <NavLink $active={currentPage === 'users'} onClick={() => setCurrentPage('users')}>Users</NavLink>}
                {(isAdmin || isMenuManager) && (
                    <>
                        <NavLink $active={currentPage === 'categories'} onClick={() => setCurrentPage('categories')}>Categories</NavLink>
                        <NavLink $active={currentPage === 'kitchens'} onClick={() => setCurrentPage('kitchens')}>Kitchens</NavLink>
                        <NavLink $active={currentPage === 'gsts'} onClick={() => setCurrentPage('gsts')}>GST Slabs</NavLink>
                        <NavLink $active={currentPage === 'modifiers'} onClick={() => setCurrentPage('modifiers')}>Modifiers</NavLink>
                        <NavLink $active={currentPage === 'menu-items'} onClick={() => setCurrentPage('menu-items')}>Menu Items</NavLink>
                    </>
                )}
                {isAdmin && (
                    <>
                        <NavLink $active={currentPage === 'tables'} onClick={() => setCurrentPage('tables')}>Tables</NavLink>
                        <NavLink $active={currentPage === 'printers'} onClick={() => setCurrentPage('printers')}>Printers</NavLink>
                        <NavLink $active={currentPage === 'terminals'} onClick={() => setCurrentPage('terminals')}>Terminals</NavLink>
                        <NavLink $active={currentPage === 'promo-codes'} onClick={() => setCurrentPage('promo-codes')}>Promo Codes</NavLink>
                        <NavLink $active={currentPage === 'invoice-template'} onClick={() => setCurrentPage('invoice-template')}>Invoice Template</NavLink>
                    </>
                )}
                 {user.role !== 'ADMIN' && user.role !== 'MENU_MANAGER' && <NavLink $active>Dashboard</NavLink>}
            </NavLinks>
            <UserActions>
                <UserInfo>Welcome, {user.username} ({user.role})</UserInfo>
                <LogoutButton onClick={logout}>Logout</LogoutButton>
            </UserActions>
        </NavContainer>
    )
}

export default Nav;
