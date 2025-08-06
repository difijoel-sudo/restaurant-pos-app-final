import React, { useState, useEffect } from 'react';
import ApiClient from '../services/ApiClient';
import styled from 'styled-components';

const PageContainer = styled.div` padding: 32px; font-family: sans-serif; `;
const Title = styled.h1` font-size: 2.25rem; font-weight: bold; color: #1e293b; margin-bottom: 24px; `;
const Card = styled.div` background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); margin-bottom: 24px;`;
const Form = styled.form` display: flex; align-items: flex-end; gap: 16px; margin-bottom: 24px;`;
const Input = styled.input` flex-grow: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; `;
const Button = styled.button` background-color: #2563eb; color: white; font-weight: 600; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; &:hover { background-color: #1d4ed8; } &:disabled { background-color: #94a3b8; }`;
const ErrorMessage = styled.p` color: #ef4444; margin-top: 16px; `;
const Grid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; `;
const AreaCard = styled(Card)` margin-bottom: 0; `;
const AreaTitle = styled.h2` font-size: 1.5rem; font-weight: bold; color: #334155; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;`;
const TableList = styled.ul` list-style: none; padding: 0; margin: 0; margin-top: 16px;`;
const TableItem = styled.li` display: flex; justify-content: space-between; align-items: center; padding: 12px; background-color: #f1f5f9; border-radius: 8px; margin-top: 8px; `;
const DeleteButton = styled.button` color: #ef4444; font-weight: 600; background: none; border: none; cursor: pointer; &:hover { text-decoration: underline; } `;

function TableManagementPage() {
    const [tableAreas, setTableAreas] = useState([]);
    const [newAreaName, setNewAreaName] = useState('');
    const [newTables, setNewTables] = useState({}); // { [areaId]: 'TableName' }
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchTableAreas = async () => {
        setIsLoading(true);
        try {
            const response = await ApiClient.get('/table-areas');
            setTableAreas(response.data);
        } catch (err) {
            setError('Failed to fetch table areas.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTableAreas();
    }, []);

    const handleAddArea = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await ApiClient.post('/table-areas', { name: newAreaName });
            setNewAreaName('');
            await fetchTableAreas();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add area.');
        }
    };

    const handleDeleteArea = async (areaId) => {
        if (window.confirm('Are you sure? Deleting an area will also delete all tables inside it.')) {
            try {
                await ApiClient.delete(`/table-areas/${areaId}`);
                await fetchTableAreas();
            } catch (err) {
                setError('Failed to delete area.');
            }
        }
    };

    const handleTableInputChange = (areaId, value) => {
        setNewTables(prev => ({ ...prev, [areaId]: value }));
    };

    const handleAddTable = async (e, areaId) => {
        e.preventDefault();
        const tableName = newTables[areaId];
        if (!tableName || !tableName.trim()) return;
        
        setError('');
        try {
            await ApiClient.post('/tables', { name: tableName, tableAreaId: areaId });
            setNewTables(prev => ({ ...prev, [areaId]: '' }));
            await fetchTableAreas();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add table.');
        }
    };

    const handleDeleteTable = async (tableId) => {
        if (window.confirm('Are you sure?')) {
            try {
                await ApiClient.delete(`/tables/${tableId}`);
                await fetchTableAreas();
            } catch (err) {
                setError('Failed to delete table.');
            }
        }
    };

    return (
        <PageContainer>
            <Title>Manage Tables</Title>
            <Card>
                <Form onSubmit={handleAddArea}>
                    <Input value={newAreaName} onChange={e => setNewAreaName(e.target.value)} placeholder="New area name (e.g., Rooftop)" required />
                    <Button type="submit">Add Area</Button>
                </Form>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </Card>

            <Grid>
                {tableAreas.map(area => (
                    <AreaCard key={area.id}>
                        <AreaTitle>
                            {area.name}
                            <DeleteButton onClick={() => handleDeleteArea(area.id)}>Delete Area</DeleteButton>
                        </AreaTitle>
                        <Form onSubmit={(e) => handleAddTable(e, area.id)}>
                            <Input value={newTables[area.id] || ''} onChange={e => handleTableInputChange(area.id, e.target.value)} placeholder="New table name (e.g., T-01)" required />
                            <Button type="submit">Add Table</Button>
                        </Form>
                        <TableList>
                            {area.tables.map(table => (
                                <TableItem key={table.id}>
                                    <span>{table.name}</span>
                                    <DeleteButton onClick={() => handleDeleteTable(table.id)}>Delete</DeleteButton>
                                </TableItem>
                            ))}
                        </TableList>
                    </AreaCard>
                ))}
            </Grid>
        </PageContainer>
    );
}
export default TableManagementPage;