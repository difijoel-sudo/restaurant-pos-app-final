import React, { useState, useEffect } from 'react';
import ApiClient from '../services/ApiClient';
import styled from 'styled-components';

const PageContainer = styled.div` padding: 32px; font-family: sans-serif; `;
const Title = styled.h1` font-size: 2.25rem; font-weight: bold; color: #1e293b; margin-bottom: 24px; `;
const Card = styled.div` background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); margin-bottom: 24px;`;
const NewGroupForm = styled.form` display: flex; align-items: flex-end; gap: 16px; flex-wrap: wrap;`;
const ModifierForm = styled.form` display: grid; grid-template-columns: 1fr 1fr auto; gap: 16px; align-items: flex-end; `;
const Input = styled.input` padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; width: 100%; box-sizing: border-box;`;
const Select = styled.select` padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; background: white; `;
const Button = styled.button` background-color: #2563eb; color: white; font-weight: 600; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; &:hover { background-color: #1d4ed8; } &:disabled { background-color: #94a3b8; }`;
const ErrorMessage = styled.p` color: #ef4444; margin-top: 16px; `;
const ModifierGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; `;
const ModifierGroupCard = styled(Card)` margin-bottom: 0; `;
const GroupTitle = styled.h2` font-size: 1.5rem; font-weight: bold; color: #334155; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;`;
const ModifierList = styled.ul` list-style: none; padding: 0; margin: 0; margin-top: 16px;`;
const ModifierItem = styled.li` display: flex; justify-content: space-between; align-items: center; padding: 12px; background-color: #f1f5f9; border-radius: 8px; margin-top: 8px; `;
const DeleteButton = styled.button` color: #ef4444; font-weight: 600; background: none; border: none; cursor: pointer; &:hover { text-decoration: underline; } `;
const FormControl = styled.div` display: flex; flex-direction: column; gap: 4px;`;

function ModifiersPage() {
    const [modifierGroups, setModifierGroups] = useState([]);
    const [newGroup, setNewGroup] = useState({ name: '', type: 'OPTIONAL' });
    const [newModifiers, setNewModifiers] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchModifierGroups = async () => {
        setIsLoading(true);
        try {
            const response = await ApiClient.get('/modifier-groups');
            setModifierGroups(response.data);
        } catch (err) {
            setError('Failed to fetch modifier groups.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchModifierGroups();
    }, []);

    const handleAddGroup = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await ApiClient.post('/modifier-groups', newGroup);
            setNewGroup({ name: '', type: 'OPTIONAL' });
            await fetchModifierGroups();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add group.');
        }
    };

    const handleDeleteGroup = async (groupId) => {
        if (window.confirm('Are you sure? Deleting a group will also delete all modifiers inside it.')) {
            try {
                await ApiClient.delete(`/modifier-groups/${groupId}`);
                await fetchModifierGroups();
            } catch (err) {
                setError('Failed to delete group.');
            }
        }
    };

    const handleModifierInputChange = (groupId, field, value) => {
        setNewModifiers(prev => ({
            ...prev,
            [groupId]: { ...prev[groupId], [field]: value }
        }));
    };

    const handleAddModifier = async (e, groupId) => {
        e.preventDefault();
        const modifierData = newModifiers[groupId];
        if (!modifierData || !modifierData.name || modifierData.price === undefined) return;
        
        setError('');
        try {
            const payload = {
                name: modifierData.name,
                price: parseFloat(modifierData.price),
                modifierGroupId: groupId,
            };
            await ApiClient.post('/modifiers', payload);
            setNewModifiers(prev => ({ ...prev, [groupId]: { name: '', price: '' } }));
            await fetchModifierGroups();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add modifier.');
        }
    };

    const handleDeleteModifier = async (modifierId) => {
        if (window.confirm('Are you sure?')) {
            try {
                await ApiClient.delete(`/modifiers/${modifierId}`);
                await fetchModifierGroups();
            } catch (err) {
                setError('Failed to delete modifier.');
            }
        }
    };

    return (
        <PageContainer>
            <Title>Manage Modifiers</Title>
            <Card>
                <NewGroupForm onSubmit={handleAddGroup}>
                    <FormControl style={{flexGrow: 2}}>
                        <label>Group Name</label>
                        <Input value={newGroup.name} onChange={e => setNewGroup({...newGroup, name: e.target.value})} placeholder="e.g., Pizza Toppings" required />
                    </FormControl>
                    <FormControl>
                        <label>Selection Type</label>
                        <Select value={newGroup.type} onChange={e => setNewGroup({...newGroup, type: e.target.value})}>
                            <option value="OPTIONAL">Optional (Add-ons)</option>
                            <option value="REQUIRED">Required (Choice)</option>
                        </Select>
                    </FormControl>
                    <Button type="submit">Add Group</Button>
                </NewGroupForm>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </Card>

            <ModifierGrid>
                {modifierGroups.map(group => (
                    <ModifierGroupCard key={group.id}>
                        <GroupTitle>
                            <span>{group.name} <small>({group.type})</small></span>
                            <DeleteButton onClick={() => handleDeleteGroup(group.id)}>Delete Group</DeleteButton>
                        </GroupTitle>
                        <ModifierForm onSubmit={(e) => handleAddModifier(e, group.id)}>
                            <Input value={newModifiers[group.id]?.name || ''} onChange={e => handleModifierInputChange(group.id, 'name', e.target.value)} placeholder="Modifier name" required />
                            <Input value={newModifiers[group.id]?.price || ''} onChange={e => handleModifierInputChange(group.id, 'price', e.target.value)} type="number" step="0.01" placeholder="Price" required />
                            <Button type="submit">Add</Button>
                        </ModifierForm>
                        <ModifierList>
                            {group.modifiers.map(mod => (
                                <ModifierItem key={mod.id}>
                                    <span>{mod.name} - ₹{mod.price.toFixed(2)}</span>
                                    <DeleteButton onClick={() => handleDeleteModifier(mod.id)}>Delete</DeleteButton>
                                </ModifierItem>
                            ))}
                        </ModifierList>
                    </ModifierGroupCard>
                ))}
            </ModifierGrid>
        </PageContainer>
    );
}
export default ModifiersPage;