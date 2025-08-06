import React, { useState, useEffect } from 'react';
import ApiClient from '../services/ApiClient';
import styled from 'styled-components';

// Reusing styles for consistency
const PageContainer = styled.div` padding: 32px; font-family: sans-serif; `;
const Title = styled.h1` font-size: 2.25rem; font-weight: bold; color: #1e293b; margin-bottom: 24px; `;
const Card = styled.div` background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); `;
const Form = styled.form` display: flex; align-items: center; gap: 16px; margin-bottom: 24px;`;
const Input = styled.input` flex-grow: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; `;
const Button = styled.button` background-color: #2563eb; color: white; font-weight: 600; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; &:hover { background-color: #1d4ed8; } &:disabled { background-color: #94a3b8; }`;
const Table = styled.table` width: 100%; border-collapse: collapse; `;
const Th = styled.th` text-align: left; padding: 12px; background-color: #f1f5f9; color: #475569; font-weight: 600; `;
const Td = styled.td` padding: 12px; border-bottom: 1px solid #e2e8f0; `;
const DeleteButton = styled.button` color: #ef4444; font-weight: 600; background: none; border: none; cursor: pointer; &:hover { text-decoration: underline; } `;
const ErrorMessage = styled.p` color: #ef4444; margin-top: 16px; `;

function KitchensPage() {
    const [kitchens, setKitchens] = useState([]);
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchKitchens = async () => {
        setIsLoading(true);
        try {
            const response = await ApiClient.get('/kitchens');
            setKitchens(response.data);
        } catch (err) {
            setError('Failed to fetch kitchens.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchKitchens();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await ApiClient.post('/kitchens', { name });
            setName('');
            await fetchKitchens();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add kitchen.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure?')) {
            setIsLoading(true);
            try {
                await ApiClient.delete(`/kitchens/${id}`);
                await fetchKitchens();
            } catch (err) {
                setError('Failed to delete kitchen.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <PageContainer>
            <Title>Manage Kitchens</Title>
            <Card>
                <Form onSubmit={handleSubmit}>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="New kitchen name (e.g., Main Kitchen)" required />
                    <Button type="submit" disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Kitchen'}</Button>
                </Form>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <Table>
                    <thead><tr><Th>Name</Th><Th>Actions</Th></tr></thead>
                    <tbody>
                        {kitchens.map(k => (
                            <tr key={k.id}>
                                <Td>{k.name}</Td>
                                <Td><DeleteButton onClick={() => handleDelete(k.id)} disabled={isLoading}>Delete</DeleteButton></Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </PageContainer>
    );
}
export default KitchensPage;