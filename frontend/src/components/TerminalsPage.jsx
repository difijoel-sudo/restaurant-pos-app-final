import React, { useState, useEffect } from 'react';
import ApiClient from '../services/ApiClient';
import styled from 'styled-components';

const PageContainer = styled.div` padding: 32px; font-family: sans-serif; `;
const Title = styled.h1` font-size: 2.25rem; font-weight: bold; color: #1e293b; margin-bottom: 24px; `;
const Card = styled.div` background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); margin-bottom: 24px;`;
const Button = styled.button` background-color: #2563eb; color: white; font-weight: 600; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; &:hover { background-color: #1d4ed8; } &:disabled { background-color: #94a3b8; }`;
const ErrorMessage = styled.p` color: #ef4444; margin-top: 16px; `;
const Grid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 24px; `;
const TerminalCard = styled(Card)` margin-bottom: 0; `;
const TerminalTitle = styled.h2` font-size: 1.5rem; font-weight: bold; color: #334155; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;`;
const ActionButton = styled.button` color: ${props => (props.$delete ? '#ef4444' : '#2563eb')}; font-weight: 600; background: none; border: none; cursor: pointer; margin-left: 16px; &:hover { text-decoration: underline; } `;
const InfoList = styled.ul` list-style: none; padding: 0; margin: 0; `;
const InfoItem = styled.li` display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; `;

// Modal Components
const ModalBackdrop = styled.div` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;`;
const ModalContent = styled.div` background: white; padding: 30px; border-radius: 12px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto;`;
const ModalForm = styled.form` display: flex; flex-direction: column; gap: 16px; `;
const Input = styled.input` padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; `;
const Select = styled.select` padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; background: white; `;
const FormControl = styled.div` display: flex; flex-direction: column; gap: 4px;`;

const INITIAL_FORM_STATE = { name: '', ipAddress: '', defaultBillPrinterId: '', kitchenPrinterMap: [] };

function TerminalsPage() {
    const [terminals, setTerminals] = useState([]);
    const [printers, setPrinters] = useState([]);
    const [kitchens, setKitchens] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTerminal, setEditingTerminal] = useState(null);
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [terminalsRes, printersRes, kitchensRes] = await Promise.all([
                ApiClient.get('/terminals'),
                ApiClient.get('/printers'),
                ApiClient.get('/kitchens'),
            ]);
            setTerminals(terminalsRes.data);
            setPrinters(printersRes.data);
            setKitchens(kitchensRes.data);
        } catch (err) {
            setError('Failed to fetch data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMappingChange = (kitchenId, printerId) => {
        setFormData(prev => {
            const newMap = [...prev.kitchenPrinterMap];
            const existingIndex = newMap.findIndex(m => m.kitchenId === kitchenId);
            if (existingIndex > -1) {
                newMap[existingIndex].printerId = parseInt(printerId);
            } else {
                newMap.push({ kitchenId, printerId: parseInt(printerId) });
            }
            return { ...prev, kitchenPrinterMap: newMap };
        });
    };

    const handleOpenModal = (terminal = null) => {
        setError('');
        if (terminal) {
            setEditingTerminal(terminal);
            setFormData({
                name: terminal.name,
                ipAddress: terminal.ipAddress,
                defaultBillPrinterId: terminal.defaultBillPrinterId,
                kitchenPrinterMap: terminal.kitchenPrinterMap.map(m => ({ kitchenId: m.kitchenId, printerId: m.printerId })),
            });
        } else {
            setEditingTerminal(null);
            setFormData(INITIAL_FORM_STATE);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTerminal(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const payload = {
            ...formData,
            defaultBillPrinterId: parseInt(formData.defaultBillPrinterId),
            kitchenPrinterMap: formData.kitchenPrinterMap.filter(m => m.printerId) // Only send mappings with a selected printer
        };

        try {
            if (editingTerminal) {
                await ApiClient.patch(`/terminals/${editingTerminal.id}`, payload);
            } else {
                await ApiClient.post('/terminals', payload);
            }
            await fetchData();
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await ApiClient.delete(`/terminals/${id}`);
                await fetchData();
            } catch (err) {
                setError('Failed to delete terminal.');
            }
        }
    };

    return (
        <PageContainer>
            <Title>Manage Terminals</Title>
            <Button onClick={() => handleOpenModal()} style={{marginBottom: '24px'}}>Add New Terminal</Button>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Grid>
                {terminals.map(terminal => (
                    <TerminalCard key={terminal.id}>
                        <TerminalTitle>
                            {terminal.name}
                            <div>
                                <ActionButton onClick={() => handleOpenModal(terminal)}>Edit</ActionButton>
                                <ActionButton $delete onClick={() => handleDelete(terminal.id)}>Delete</ActionButton>
                            </div>
                        </TerminalTitle>
                        <InfoList>
                            <InfoItem><span>IP Address:</span> <strong>{terminal.ipAddress}</strong></InfoItem>
                            <InfoItem><span>Default Bill Printer:</span> <strong>{terminal.defaultBillPrinter.name}</strong></InfoItem>
                        </InfoList>
                        <h3 style={{marginTop: '20px'}}>Kitchen Printer Map</h3>
                        <InfoList>
                            {terminal.kitchenPrinterMap.map(m => (
                                <InfoItem key={m.id}><span>{m.kitchen.name}:</span> <strong>{m.printer.name}</strong></InfoItem>
                            ))}
                        </InfoList>
                    </TerminalCard>
                ))}
            </Grid>

            {isModalOpen && (
                <ModalBackdrop>
                    <ModalContent>
                        <h2>{editingTerminal ? 'Edit Terminal' : 'Add New Terminal'}</h2>
                        <ModalForm onSubmit={handleSubmit}>
                            <FormControl><label>Terminal Name</label><Input name="name" value={formData.name} onChange={handleInputChange} required /></FormControl>
                            <FormControl><label>IP Address</label><Input name="ipAddress" value={formData.ipAddress} onChange={handleInputChange} required /></FormControl>
                            <FormControl>
                                <label>Default Bill Printer</label>
                                <Select name="defaultBillPrinterId" value={formData.defaultBillPrinterId} onChange={handleInputChange} required>
                                    <option value="" disabled>Select a printer</option>
                                    {printers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </Select>
                            </FormControl>
                            <hr />
                            <h3>Kitchen Printer Mapping</h3>
                            {kitchens.map(k => (
                                <FormControl key={k.id}>
                                    <label>{k.name}</label>
                                    <Select 
                                        value={formData.kitchenPrinterMap.find(m => m.kitchenId === k.id)?.printerId || ''}
                                        onChange={(e) => handleMappingChange(k.id, e.target.value)}
                                    >
                                        <option value="">Select a printer</option>
                                        {printers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </Select>
                                </FormControl>
                            ))}
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <Button type="button" onClick={handleCloseModal} style={{ backgroundColor: '#64748b' }}>Cancel</Button>
                                <Button type="submit" $primary>{editingTerminal ? 'Update Terminal' : 'Create Terminal'}</Button>
                            </div>
                            {error && <ErrorMessage>{error}</ErrorMessage>}
                        </ModalForm>
                    </ModalContent>
                </ModalBackdrop>
            )}
        </PageContainer>
    );
}
export default TerminalsPage;
