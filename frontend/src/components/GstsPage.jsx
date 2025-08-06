import React, { useState, useEffect } from 'react';
import ApiClient from '../services/ApiClient';
import styled from 'styled-components';

// Reusing styles for consistency
const PageContainer = styled.div` padding: 32px; font-family: sans-serif; `;
const Title = styled.h1` font-size: 2.25rem; font-weight: bold; color: #1e293b; margin-bottom: 24px; `;
const Card = styled.div` background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); `;
const Form = styled.form` display: flex; align-items: flex-end; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;`;
const FormControl = styled.div` display: flex; flex-direction: column; gap: 4px; flex-grow: 1; min-width: 150px;`;
const Input = styled.input` padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; `;
const Button = styled.button` background-color: #2563eb; color: white; font-weight: 600; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; &:hover { background-color: #1d4ed8; } &:disabled { background-color: #94a3b8; }`;
const Table = styled.table` width: 100%; border-collapse: collapse; `;
const Th = styled.th` text-align: left; padding: 12px; background-color: #f1f5f9; color: #475569; font-weight: 600; `;
const Td = styled.td` padding: 12px; border-bottom: 1px solid #e2e8f0; `;
const DeleteButton = styled.button` color: #ef4444; font-weight: 600; background: none; border: none; cursor: pointer; &:hover { text-decoration: underline; } `;
const ErrorMessage = styled.p` color: #ef4444; margin-top: 16px; width: 100%;`;

function GstsPage() {
    const [gstSlabs, setGstSlabs] = useState([]);
    const [formState, setFormState] = useState({ name: '', cgstRate: '', sgstRate: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchGsts = async () => {
        setIsLoading(true);
        try {
            const response = await ApiClient.get('/gsts');
            setGstSlabs(response.data);
        } catch (err) {
            setError('Failed to fetch GST slabs.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGsts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const payload = {
                name: formState.name,
                cgstRate: parseFloat(formState.cgstRate),
                sgstRate: parseFloat(formState.sgstRate),
            };
            await ApiClient.post('/gsts', payload);
            setFormState({ name: '', cgstRate: '', sgstRate: '' });
            await fetchGsts();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add GST slab.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure?')) {
            setIsLoading(true);
            try {
                await ApiClient.delete(`/gsts/${id}`);
                await fetchGsts();
            } catch (err) {
                setError('Failed to delete GST slab.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <PageContainer>
            <Title>Manage GST Slabs</Title>
            <Card>
                <Form onSubmit={handleSubmit}>
                    <FormControl><label>Slab Name</label><Input name="name" value={formState.name} onChange={handleInputChange} placeholder="e.g., GST 5%" required /></FormControl>
                    <FormControl><label>CGST Rate (%)</label><Input name="cgstRate" type="number" step="0.01" value={formState.cgstRate} onChange={handleInputChange} placeholder="e.g., 2.5" required /></FormControl>
                    <FormControl><label>SGST Rate (%)</label><Input name="sgstRate" type="number" step="0.01" value={formState.sgstRate} onChange={handleInputChange} placeholder="e.g., 2.5" required /></FormControl>
                    <Button type="submit" disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Slab'}</Button>
                </Form>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <Table>
                    <thead><tr><Th>Name</Th><Th>CGST</Th><Th>SGST</Th><Th>Total Tax</Th><Th>Actions</Th></tr></thead>
                    <tbody>
                        {gstSlabs.map(slab => (
                            <tr key={slab.id}>
                                <Td>{slab.name}</Td>
                                <Td>{slab.cgstRate}%</Td>
                                <Td>{slab.sgstRate}%</Td>
                                <Td>{slab.cgstRate + slab.sgstRate}%</Td>
                                <Td><DeleteButton onClick={() => handleDelete(slab.id)} disabled={isLoading}>Delete</DeleteButton></Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </PageContainer>
    );
}
export default GstsPage;
