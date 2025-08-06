import React, { useState, useEffect } from 'react';
import ApiClient from '../services/ApiClient';
import styled from 'styled-components';

const PageContainer = styled.div` padding: 32px; font-family: sans-serif; `;
const Title = styled.h1` font-size: 2.25rem; font-weight: bold; color: #1e293b; margin-bottom: 24px; `;
const Card = styled.div` background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); `;
const Form = styled.form` display: grid; grid-template-columns: repeat(3, 1fr) auto; align-items: flex-end; gap: 16px; margin-bottom: 24px; @media (max-width: 768px) { grid-template-columns: 1fr; }`;
const FormControl = styled.div` display: flex; flex-direction: column; gap: 4px;`;
const Input = styled.input` padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; `;
const Select = styled.select` padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; background: white; `;
const Button = styled.button` background-color: #2563eb; color: white; font-weight: 600; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; &:hover { background-color: #1d4ed8; } &:disabled { background-color: #94a3b8; }`;
const Table = styled.table` width: 100%; border-collapse: collapse; `;
const Th = styled.th` text-align: left; padding: 12px; background-color: #f1f5f9; color: #475569; font-weight: 600; `;
const Td = styled.td` padding: 12px; border-bottom: 1px solid #e2e8f0; `;
const DeleteButton = styled.button` color: #ef4444; font-weight: 600; background: none; border: none; cursor: pointer; &:hover { text-decoration: underline; } `;
const ErrorMessage = styled.p` color: #ef4444; margin-top: 16px; `;

const INITIAL_FORM_STATE = { name: '', connectionType: 'IP', path: '' };

function PrintersPage() {
    const [printers, setPrinters] = useState([]);
    const [formState, setFormState] = useState(INITIAL_FORM_STATE);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchPrinters = async () => {
        setIsLoading(true);
        try {
            const response = await ApiClient.get('/printers');
            setPrinters(response.data);
        } catch (err) {
            setError('Failed to fetch printers.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPrinters();
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
            await ApiClient.post('/printers', formState);
            setFormState(INITIAL_FORM_STATE);
            await fetchPrinters();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add printer.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure? This printer might be in use by a terminal.')) {
            setIsLoading(true);
            try {
                await ApiClient.delete(`/printers/${id}`);
                await fetchPrinters();
            } catch (err) {
                setError('Failed to delete printer.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <PageContainer>
            <Title>Manage Printers</Title>
            <Card>
                <Form onSubmit={handleSubmit}>
                    <FormControl>
                        <label>Printer Name</label>
                        <Input name="name" value={formState.name} onChange={handleInputChange} placeholder="e.g., Counter Bill Printer" required />
                    </FormControl>
                    <FormControl>
                        <label>Connection Type</label>
                        <Select name="connectionType" value={formState.connectionType} onChange={handleInputChange}>
                            <option value="IP">Network (IP)</option>
                            <option value="SHARED">Shared on PC</option>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <label>IP Address / Share Path</label>
                        <Input name="path" value={formState.path} onChange={handleInputChange} placeholder="e.g., 192.168.1.50" required />
                    </FormControl>
                    <Button type="submit" disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Printer'}</Button>
                </Form>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <Table>
                    <thead>
                        <tr>
                            <Th>Name</Th>
                            <Th>Connection</Th>
                            <Th>Path</Th>
                            <Th>Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {printers.map(p => (
                            <tr key={p.id}>
                                <Td>{p.name}</Td>
                                <Td>{p.connectionType}</Td>
                                <Td>{p.path}</Td>
                                <Td><DeleteButton onClick={() => handleDelete(p.id)} disabled={isLoading}>Delete</DeleteButton></Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </PageContainer>
    );
}
export default PrintersPage;
