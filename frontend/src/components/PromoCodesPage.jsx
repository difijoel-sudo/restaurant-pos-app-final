import React, { useState, useEffect } from 'react';
import ApiClient from '../services/ApiClient';
import styled from 'styled-components';

const PageContainer = styled.div` padding: 32px; font-family: sans-serif; `;
const Title = styled.h1` font-size: 2.25rem; font-weight: bold; color: #1e293b; margin-bottom: 24px; `;
const Card = styled.div` background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); `;
const Form = styled.form` display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); align-items: flex-end; gap: 16px; margin-bottom: 24px;`;
const FormControl = styled.div` display: flex; flex-direction: column; gap: 4px;`;
const Input = styled.input` padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; `;
const Select = styled.select` padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; background: white; `;
const Button = styled.button` background-color: #2563eb; color: white; font-weight: 600; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; &:hover { background-color: #1d4ed8; } &:disabled { background-color: #94a3b8; }`;
const Table = styled.table` width: 100%; border-collapse: collapse; `;
const Th = styled.th` text-align: left; padding: 12px; background-color: #f1f5f9; color: #475569; font-weight: 600; `;
const Td = styled.td` padding: 12px; border-bottom: 1px solid #e2e8f0; `;
const ActionButton = styled.button` color: ${props => (props.$delete ? '#ef4444' : '#fbbf24')}; font-weight: 600; background: none; border: none; cursor: pointer; margin-right: 16px; &:hover { text-decoration: underline; } `;
const ErrorMessage = styled.p` color: #ef4444; margin-top: 16px; `;

const INITIAL_FORM_STATE = { code: '', discountType: 'PERCENTAGE', value: '', expiryDate: '', status: 'ACTIVE' };

function PromoCodesPage() {
    const [promoCodes, setPromoCodes] = useState([]);
    const [formState, setFormState] = useState(INITIAL_FORM_STATE);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchPromoCodes = async () => {
        setIsLoading(true);
        try {
            const response = await ApiClient.get('/promo-codes');
            setPromoCodes(response.data);
        } catch (err) {
            setError('Failed to fetch promo codes.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPromoCodes();
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
                ...formState,
                value: parseFloat(formState.value),
            };
            await ApiClient.post('/promo-codes', payload);
            setFormState(INITIAL_FORM_STATE);
            await fetchPromoCodes();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add promo code.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleToggleStatus = async (promo) => {
        const newStatus = promo.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        try {
            await ApiClient.patch(`/promo-codes/${promo.id}`, { status: newStatus });
            await fetchPromoCodes();
        } catch (err) {
            setError('Failed to update status.');
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure?')) {
            try {
                await ApiClient.delete(`/promo-codes/${id}`);
                await fetchPromoCodes();
            } catch (err) {
                setError('Failed to delete promo code.');
            }
        }
    };

    return (
        <PageContainer>
            <Title>Manage Promo Codes</Title>
            <Card>
                <Form onSubmit={handleSubmit}>
                    <FormControl><label>Promo Code</label><Input name="code" value={formState.code} onChange={handleInputChange} required /></FormControl>
                    <FormControl><label>Discount Type</label>
                        <Select name="discountType" value={formState.discountType} onChange={handleInputChange}>
                            <option value="PERCENTAGE">Percentage (%)</option>
                            <option value="FLAT">Flat Amount (₹)</option>
                        </Select>
                    </FormControl>
                    <FormControl><label>Value</label><Input name="value" type="number" step="0.01" value={formState.value} onChange={handleInputChange} required /></FormControl>
                    <FormControl><label>Expiry Date (Optional)</label><Input name="expiryDate" type="date" value={formState.expiryDate} onChange={handleInputChange} /></FormControl>
                    <Button type="submit" disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Code'}</Button>
                </Form>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <Table>
                    <thead>
                        <tr>
                            <Th>Code</Th>
                            <Th>Type</Th>
                            <Th>Value</Th>
                            <Th>Expiry</Th>
                            <Th>Status</Th>
                            <Th>Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {promoCodes.map(p => (
                            <tr key={p.id}>
                                <Td>{p.code}</Td>
                                <Td>{p.discountType}</Td>
                                <Td>{p.discountType === 'PERCENTAGE' ? `${p.value}%` : `₹${p.value.toFixed(2)}`}</Td>
                                <Td>{p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : 'No Expiry'}</Td>
                                <Td>{p.status}</Td>
                                <Td>
                                    <ActionButton onClick={() => handleToggleStatus(p)}>Toggle Status</ActionButton>
                                    <ActionButton $delete onClick={() => handleDelete(p.id)}>Delete</ActionButton>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </PageContainer>
    );
}
export default PromoCodesPage;