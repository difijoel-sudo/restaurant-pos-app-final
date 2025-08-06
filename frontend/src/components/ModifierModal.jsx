import React, { useState } from 'react';
import styled from 'styled-components';

const ModalBackdrop = styled.div` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;`;
const ModalContent = styled.div` background: white; padding: 30px; border-radius: 12px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto;`;
const Button = styled.button` background-color: #2563eb; color: white; font-weight: 600; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; &:hover { background-color: #1d4ed8; }`;
const CheckboxLabel = styled.label` display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer;`;

function ModifierModal({ item, modifierGroups, onClose, onAddToOrder }) {
    const [selectedModifiers, setSelectedModifiers] = useState([]);

    const handleModifierChange = (modifierId) => {
        setSelectedModifiers(prev => 
            prev.includes(modifierId) 
            ? prev.filter(id => id !== modifierId) 
            : [...prev, modifierId]
        );
    };

    const handleSubmit = () => {
        onAddToOrder(item.id, 1, selectedModifiers);
        onClose();
    };

    const linkedGroupIds = item.modifierGroups.map(mg => mg.modifierGroupId);
    const relevantGroups = modifierGroups.filter(mg => linkedGroupIds.includes(mg.id));

    return (
        <ModalBackdrop onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <h2>Add Modifiers for {item.name}</h2>
                {relevantGroups.map(group => (
                    <div key={group.id} style={{marginBottom: '16px'}}>
                        <h3>{group.name} {group.type === 'REQUIRED' && <span style={{color: 'red'}}>*</span>}</h3>
                        {group.modifiers.map(mod => (
                            <CheckboxLabel key={mod.id}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedModifiers.includes(mod.id)}
                                    onChange={() => handleModifierChange(mod.id)}
                                />
                                {mod.name} (+₹{mod.price.toFixed(2)})
                            </CheckboxLabel>
                        ))}
                    </div>
                ))}
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px'}}>
                    <Button onClick={onClose} style={{backgroundColor: '#64748b'}}>Cancel</Button>
                    <Button onClick={handleSubmit}>Add to Order</Button>
                </div>
            </ModalContent>
        </ModalBackdrop>
    );
}

export default ModifierModal;