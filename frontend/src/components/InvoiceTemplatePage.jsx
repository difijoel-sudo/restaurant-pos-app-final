import React, { useState, useEffect } from 'react';
import ApiClient from '../services/ApiClient';
import styled from 'styled-components';

// --- Styled Components ---
const PageContainer = styled.div` padding: 32px; font-family: sans-serif; `;
const Title = styled.h1` font-size: 2.25rem; font-weight: bold; color: #1e293b; margin-bottom: 24px; `;
const Layout = styled.div` display: grid; grid-template-columns: 2fr 1fr; gap: 32px; @media (max-width: 900px) { grid-template-columns: 1fr; }`;
const Card = styled.div` background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); `;
const Form = styled.form` display: flex; flex-direction: column; gap: 20px; `;
const FormControl = styled.div` display: flex; flex-direction: column; gap: 4px;`;
const Input = styled.input` padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; `;
const Textarea = styled.textarea` padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; min-height: 80px;`;
const Button = styled.button` background-color: #2563eb; color: white; font-weight: 600; padding: 12px 24px; border-radius: 8px; border: none; cursor: pointer; &:hover { background-color: #1d4ed8; } &:disabled { background-color: #94a3b8; }`;
const ErrorMessage = styled.p` color: #ef4444; margin-top: 16px; `;
const SuccessMessage = styled.p` color: #16a34a; margin-top: 16px;`;
const SubHeading = styled.h2` font-size: 1.5rem; font-weight: bold; color: #334155; margin-bottom: 16px; `;
const PreviewContainer = styled.div` border: 1px solid #e2e8f0; padding: 20px; font-family: 'Courier New', Courier, monospace; color: #333; background: #fff;`;
const PreviewHeader = styled.div` text-align: center; border-bottom: 1px dashed #999; padding-bottom: 10px;`;
const PreviewLogo = styled.img` max-width: 150px; max-height: 80px; margin-bottom: 10px;`;
const PreviewTable = styled.table` width: 100%; margin: 15px 0; font-size: 14px; border-collapse: collapse; th, td { text-align: left; padding: 4px 0; }`;
const PreviewFooter = styled.div` text-align: center; border-top: 1px dashed #999; padding-top: 10px; font-size: 12px;`;

const API_BASE_URL = 'http://localhost:3000';
const INITIAL_FORM_STATE = { restaurantName: '', address: '', phone: '', gstin: '', footerText: '', logoUrl: '' };

function InvoiceTemplatePage() {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [logoFile, setLogoFile] = useState(null);

    useEffect(() => {
        const fetchTemplate = async () => {
            setIsLoading(true);
            try {
                const response = await ApiClient.get('/invoice-templates');
                setFormData({
                    restaurantName: response.data.restaurantName || '',
                    address: response.data.address || '',
                    phone: response.data.phone || '',
                    gstin: response.data.gstin || '',
                    footerText: response.data.footerText || '',
                    logoUrl: response.data.logoUrl || '',
                });
            } catch (err) {
                setError('Failed to fetch invoice template.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTemplate();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setLogoFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);
        
        let finalLogoUrl = formData.logoUrl;

        if (logoFile) {
            try {
                const uploadFormData = new FormData();
                uploadFormData.append('logo', logoFile);
                const response = await ApiClient.post('/invoice-templates/upload-logo', uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                finalLogoUrl = response.data.filePath;
            } catch (err) {
                setError('Failed to upload logo.');
                setIsLoading(false);
                return;
            }
        }
        
        try {
            const payload = { ...formData, logoUrl: finalLogoUrl };
            await ApiClient.patch('/invoice-templates', payload);
            setFormData(payload);
            setSuccess('Invoice template updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update template.');
        } finally {
            setIsLoading(false);
            setLogoFile(null);
        }
    };

    return (
        <PageContainer>
            <Title>Customize Invoice Template</Title>
            <Layout>
                <Card>
                    <Form onSubmit={handleSubmit}>
                        <FormControl style={{gridColumn: '1 / -1'}}>
                            <label>Restaurant Name</label>
                            <Input name="restaurantName" value={formData.restaurantName} onChange={handleInputChange} required />
                        </FormControl>
                         <FormControl>
                            <label>Address</label>
                            <Textarea name="address" value={formData.address} onChange={handleInputChange} />
                        </FormControl>
                         <FormControl>
                            <label>Footer Text</label>
                            <Textarea name="footerText" value={formData.footerText} onChange={handleInputChange} placeholder="e.g., Thank you for visiting!" />
                        </FormControl>
                        <FormControl><label>Phone Number</label><Input name="phone" value={formData.phone} onChange={handleInputChange} /></FormControl>
                        <FormControl><label>GSTIN</label><Input name="gstin" value={formData.gstin} onChange={handleInputChange} /></FormControl>
                        <FormControl style={{gridColumn: '1 / -1'}}>
                            <label>Upload New Logo</label>
                            <Input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
                            {formData.logoUrl && <p style={{fontSize: '12px', color: '#64748b'}}>Current logo: {formData.logoUrl}</p>}
                        </FormControl>
                        
                        <div style={{gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end'}}>
                            <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Template'}</Button>
                        </div>
                    </Form>
                    {success && <SuccessMessage>{success}</SuccessMessage>}
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                </Card>
                
                <PreviewContainer>
                    <SubHeading style={{textAlign: 'center'}}>Live Preview</SubHeading>
                    <PreviewHeader>
                        {/* --- THIS IS THE FIX --- */}
                        {formData.logoUrl && <PreviewLogo src={`${API_BASE_URL}${formData.logoUrl}`} alt="logo" />}
                        <h3 style={{margin: 0}}>{formData.restaurantName || "My Restaurant"}</h3>
                        <p style={{margin: '4px 0', fontSize: '12px'}}>{formData.address || "123 Main Street, Anytown"}</p>
                        <p style={{margin: '4px 0', fontSize: '12px'}}>{formData.phone || "987-654-3210"}</p>
                        <p style={{margin: '4px 0', fontSize: '12px'}}>GSTIN: {formData.gstin || "N/A"}</p>
                    </PreviewHeader>
                    <PreviewTable>
                        <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
                        <tbody>
                            <tr><td>Sample Item 1</td><td>1</td><td>₹100.00</td></tr>
                            <tr><td>Sample Item 2</td><td>2</td><td>₹200.00</td></tr>
                        </tbody>
                    </PreviewTable>
                    <PreviewFooter>
                        <p>{formData.footerText || "Thank you for visiting!"}</p>
                    </PreviewFooter>
                </PreviewContainer>
            </Layout>
        </PageContainer>
    );
}
export default InvoiceTemplatePage;
