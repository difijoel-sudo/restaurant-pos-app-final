import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div` display: flex; flex-direction: column; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); overflow: hidden; height: 100%; `;
const Header = styled.div` padding: 16px; border-bottom: 1px solid #e2e8f0; `;
const SearchInput = styled.input` width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; `;
const CategoryTabs = styled.div` display: flex; gap: 8px; padding: 16px; border-bottom: 1px solid #e2e8f0; overflow-x: auto; `;
const TabButton = styled.button` padding: 8px 16px; border-radius: 20px; border: 1px solid ${props => props.$active ? '#2563eb' : '#cbd5e1'}; background-color: ${props => props.$active ? '#2563eb' : 'white'}; color: ${props => props.$active ? 'white' : '#334155'}; font-weight: 600; cursor: pointer; white-space: nowrap; `;
const ItemGrid = styled.div` flex-grow: 1; padding: 16px; display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 16px; overflow-y: auto; `;
const ItemCard = styled.div` background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center; cursor: pointer; &:hover { border-color: #2563eb; background-color: #eff6ff; } `;
const ItemName = styled.div` font-weight: 600; font-size: 14px;`;
const ItemPrice = styled.div` font-size: 12px; color: #64748b;`;

function MenuPanel({ categories, menuItems, onAddItem }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredItems = useMemo(() => {
        return menuItems
            .filter(item => activeCategory === 'all' || item.categoryId === activeCategory)
            .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [menuItems, activeCategory, searchTerm]);

    return (
        <PanelContainer>
            <Header>
                <SearchInput 
                    type="text" 
                    placeholder="Search for items..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </Header>
            <CategoryTabs>
                <TabButton $active={activeCategory === 'all'} onClick={() => setActiveCategory('all')}>All</TabButton>
                {categories.map(cat => (
                    <TabButton 
                        key={cat.id} 
                        $active={activeCategory === cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        {cat.name}
                    </TabButton>
                ))}
            </CategoryTabs>
            <ItemGrid>
                {filteredItems.map(item => (
                    <ItemCard key={item.id} onClick={() => onAddItem(item)}>
                        <ItemName>{item.name}</ItemName>
                        <ItemPrice>₹{item.price.toFixed(2)}</ItemPrice>
                    </ItemCard>
                ))}
            </ItemGrid>
        </PanelContainer>
    );
}

export default MenuPanel;
