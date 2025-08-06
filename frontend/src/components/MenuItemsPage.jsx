import React, { useState, useEffect, useMemo } from 'react';
import ApiClient from '../services/ApiClient';
import styled from 'styled-components';
import * as xlsx from 'xlsx';
// We don't need to import react-barcode anymore, as we'll use a different method.

// --- Styled Components ---
const PageContainer = styled.div` padding: 32px; font-family: sans-serif; `;
const MainHeading = styled.h1` font-size: 2.25rem; font-weight: bold; color: #1e293b; margin-bottom: 24px; `;
const Card = styled.div` background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); margin-bottom: 32px; `;
const SubHeading = styled.h2` font-size: 1.5rem; font-weight: bold; color: #334155; margin-bottom: 16px; `;
const Form = styled.form` display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; @media (max-width: 768px) { grid-template-columns: 1fr; }`;
const FormControl = styled.div` display: flex; flex-direction: column; gap: 4px; `;
const FormActions = styled.div` grid-column: 1 / -1; display: flex; gap: 16px; margin-top: 16px; `;
const Input = styled.input` padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; `;
const Select = styled.select` padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; background-color: white; `;
const Button = styled.button` background-color: ${props => (props.$primary ? '#2563eb' : '#475569')}; color: white; font-weight: 600; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; &:hover { background-color: ${props => (props.$primary ? '#1d4ed8' : '#334155')}; } &:disabled { background-color: #94a3b8; } `;
const ErrorMessage = styled.p` color: #ef4444; margin-top: 16px; white-space: pre-wrap;`;
const SuccessMessage = styled.p` color: #16a34a; margin-top: 16px;`;
const Table = styled.table` width: 100%; border-collapse: collapse; margin-top: 16px; `;
const Th = styled.th` text-align: left; padding: 12px; background-color: #f1f5f9; color: #475569; font-weight: 600; white-space: nowrap; `;
const Td = styled.td` padding: 12px; border-bottom: 1px solid #e2e8f0; `;
const FileInput = styled.input` border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px; font-size: 0.9rem; flex-grow: 1; `;
const ActionButton = styled.button` color: ${props => (props.$delete ? '#ef4444' : (props.$print ? '#16a34a' : '#2563eb'))}; font-weight: 600; background: none; border: none; cursor: pointer; margin-right: 16px; &:hover { text-decoration: underline; } `;
const ModifierGroupContainer = styled.div` grid-column: 1 / -1; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; `;
const CheckboxLabel = styled.label` display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer;`;
const FilterContainer = styled.div` display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;`;

const INITIAL_FORM_STATE = { name: '', description: '', price: '', categoryId: '', kitchenId: '', gstSlabId: '', barcode: '', modifierGroupIds: [] };

function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [kitchens, setKitchens] = useState([]);
  const [gstSlabs, setGstSlabs] = useState([]);
  const [modifierGroups, setModifierGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [editingItem, setEditingItem] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const fetchData = async () => { setIsLoading(true); setError(null); try { const [itemsRes, catRes, kitchenRes, gstRes, modGroupRes] = await Promise.all([ ApiClient.get('/menu-items'), ApiClient.get('/categories'), ApiClient.get('/kitchens'), ApiClient.get('/gsts'), ApiClient.get('/modifier-groups'), ]); setMenuItems(itemsRes.data); setCategories(catRes.data); setKitchens(kitchenRes.data); setGstSlabs(gstRes.data); setModifierGroups(modGroupRes.data); if (catRes.data.length > 0 && !formState.categoryId) { setFormState(prev => ({ ...prev, categoryId: catRes.data[0].id })); } } catch (err) { console.error("Data fetching error:", err); setError('Failed to fetch data.'); } finally { setIsLoading(false); } };
  useEffect(() => { fetchData(); }, []);
  const handleInputChange = (e) => { const { name, value } = e.target; setFormState(prev => ({ ...prev, [name]: value })); };
  const handleModifierGroupChange = (groupId) => { setFormState(prev => { const newIds = prev.modifierGroupIds.includes(groupId) ? prev.modifierGroupIds.filter(id => id !== groupId) : [...prev.modifierGroupIds, groupId]; return { ...prev, modifierGroupIds: newIds }; }); };
  const handleEditClick = (item) => { setEditingItem(item); setFormState({ name: item.name, description: item.description || '', price: item.price, categoryId: item.categoryId, kitchenId: item.kitchenId || '', gstSlabId: item.gstSlabId || '', barcode: item.barcode || '', modifierGroupIds: item.modifierGroups.map(mg => mg.modifierGroup.id) }); };
  const handleCancelEdit = () => { setEditingItem(null); setFormState(INITIAL_FORM_STATE); };
  const handleSubmit = async (e) => { e.preventDefault(); if (!formState.name || !formState.price || !formState.categoryId) { setError('Name, price, and category are required.'); return; } setIsLoading(true); setError(null); setSuccess(null); const payload = { ...formState, price: parseFloat(formState.price), categoryId: parseInt(formState.categoryId), kitchenId: formState.kitchenId ? parseInt(formState.kitchenId) : null, gstSlabId: formState.gstSlabId ? parseInt(formState.gstSlabId) : null }; try { if (editingItem) { await ApiClient.patch(`/menu-items/${editingItem.id}`, payload); setSuccess('Item updated successfully!'); } else { await ApiClient.post(`/menu-items`, payload); setSuccess('Item added successfully!'); } handleCancelEdit(); await fetchData(); } catch (err) { setError(err.response?.data?.message || 'An error occurred.'); } finally { setIsLoading(false); } };
  const handleDeleteItem = async (id) => { if (!window.confirm('Are you sure?')) return; setIsLoading(true); try { await ApiClient.delete(`/menu-items/${id}`); await fetchData(); } catch (err) { setError('Failed to delete menu item.'); } finally { setIsLoading(false); } };
  const handleFileChange = (e) => { setUploadFile(e.target.files[0]); };
  
  // --- THIS IS THE FIX for Excel Upload ---
  const handleFileUpload = async () => { 
    if (!uploadFile) return; 
    const formData = new FormData(); 
    formData.append('file', uploadFile); 
    setIsLoading(true); 
    setError(null); 
    setSuccess(null); 
    try { 
      const response = await ApiClient.post('/menu-items/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // This header is crucial
        },
      });
      setSuccess(response.data.message); 
      if (response.data.errors?.length > 0) { 
        setError(`Upload completed with some errors:\n- ${response.data.errors.join('\n- ')}`); 
      } 
      await fetchData(); 
    } catch (err) { 
      setError(err.response?.data?.message || 'File upload failed.'); 
    } finally { 
      setIsLoading(false); 
      setUploadFile(null); 
      document.getElementById('file-input').value = null; 
    } 
  };
  
  const handleDownloadTemplate = () => { const data = [{ Name: 'Sample Pizza', Price: 300, Description: 'A sample pizza', Category: 'Main Course', Kitchen: 'Main Kitchen', Gst: 'GST 5%', Barcode: '123456789', "Modifier Groups": "Pizza Toppings, Spice Level" }]; const worksheet = xlsx.utils.json_to_sheet(data); const workbook = xlsx.utils.book_new(); xlsx.utils.book_append_sheet(workbook, worksheet, 'MenuItems'); xlsx.writeFile(workbook, 'MenuItemsTemplate.xlsx'); };
  
  // --- THIS IS THE FIX for Barcode Printing ---
 const handlePrintBarcode = (item) => {
    const printWindow = window.open('', '_blank', 'height=150,width=300');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"></script>
          <style>
            /* This CSS removes the browser's default print headers and footers */
            @media print {
              @page {
                size: auto;
                margin: 5mm;
              }
              body {
                margin: 0;
              }
            }
          </style>
        </head>
        <body style="text-align: center; margin: 0;">
          <svg id="barcode"></svg>
          <script>
            JsBarcode("#barcode", "${item.barcode}", {
              width: 2,
              height: 50,
              displayValue: false, // Hides the text number below the barcode
              margin: 0
            });
            setTimeout(() => {
              window.print();
              window.close();
            }, 250);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredMenuItems = useMemo(() => {
    return menuItems
      .filter(item => {
        if (filterCategory === 'all') return true;
        return item.categoryId === parseInt(filterCategory);
      })
      .filter(item => {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [menuItems, searchTerm, filterCategory]);

  return (
    <PageContainer>
      <MainHeading>Manage Menu Items</MainHeading>
      <Card>
        <SubHeading>{editingItem ? 'Edit Menu Item' : 'Add New Item Manually'}</SubHeading>
        <Form onSubmit={handleSubmit}>
          <FormControl><label>Name</label><Input name="name" value={formState.name} onChange={handleInputChange} required /></FormControl>
          <FormControl><label>Price</label><Input name="price" type="number" step="0.01" value={formState.price} onChange={handleInputChange} required /></FormControl>
          <FormControl style={{ gridColumn: '1 / -1' }}><label>Description</label><Input name="description" value={formState.description} onChange={handleInputChange} /></FormControl>
          <FormControl><label>Category</label><Select name="categoryId" value={formState.categoryId} onChange={handleInputChange} required><option value="" disabled>Select...</option>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</Select></FormControl>
          <FormControl><label>Kitchen</label><Select name="kitchenId" value={formState.kitchenId} onChange={handleInputChange}><option value="">None</option>{kitchens.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}</Select></FormControl>
          <FormControl><label>GST Slab</label><Select name="gstSlabId" value={formState.gstSlabId} onChange={handleInputChange}><option value="">None</option>{gstSlabs.map(g => <option key={g.id} value={g.id}>{g.name} ({g.cgstRate + g.sgstRate}%)</option>)}</Select></FormControl>
          <FormControl style={{ gridColumn: '1 / -1' }}><label>Barcode (optional)</label><Input name="barcode" value={formState.barcode} onChange={handleInputChange} placeholder="Scan or leave empty to auto-generate" /></FormControl>
          <ModifierGroupContainer>
            <h4 style={{marginTop: 0, marginBottom: '12px'}}>Link Modifier Groups</h4>
            {modifierGroups.map(group => (
                <CheckboxLabel key={group.id}>
                    <input type="checkbox" checked={formState.modifierGroupIds.includes(group.id)} onChange={() => handleModifierGroupChange(group.id)} />
                    {group.name} ({group.type})
                </CheckboxLabel>
            ))}
          </ModifierGroupContainer>
          <FormActions><Button type="submit" $primary disabled={isLoading}>{editingItem ? 'Update Item' : 'Add Item'}</Button>{editingItem && <Button type="button" onClick={handleCancelEdit} disabled={isLoading}>Cancel</Button>}</FormActions>
        </Form>
      </Card>
      
      <Card>
        <SubHeading>Bulk Upload from Excel</SubHeading>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <FileInput id="file-input" type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <Button onClick={handleFileUpload} disabled={isLoading || !uploadFile}>Upload File</Button>
            <Button type="button" onClick={handleDownloadTemplate}>Download Template</Button>
        </div>
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Card>

      <Card>
        <SubHeading>Existing Menu Items</SubHeading>
        <FilterContainer>
            <Input 
                style={{flexGrow: 2, minWidth: '200px'}}
                type="text"
                placeholder="Search by item name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <Select 
                style={{flexGrow: 1, minWidth: '150px'}}
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
            >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </Select>
        </FilterContainer>

        <div style={{ overflowX: 'auto' }}>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th>Kitchen</Th>
                <Th>GST</Th>
                <Th>Price</Th>
                <Th>Modifiers</Th>
                <Th>Barcode</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredMenuItems.map((item) => (
                <tr key={item.id}>
                  <Td>{item.name}</Td>
                  <Td>{item.category?.name || 'N/A'}</Td>
                  <Td>{item.kitchen?.name || 'None'}</Td>
                  <Td>{item.gstSlab?.name || 'None'}</Td>
                  <Td>₹{item.price.toFixed(2)}</Td>
                  <Td>
                    {item.modifierGroups && item.modifierGroups.length > 0
                      ? item.modifierGroups.map(mg => mg.modifierGroup.name).join(', ')
                      : 'None'}
                  </Td>
                  <Td>{item.barcode}</Td>
                  <Td>
                    <ActionButton onClick={() => handleEditClick(item)}>Edit</ActionButton>
                    <ActionButton $delete onClick={() => handleDeleteItem(item.id)}>Delete</ActionButton>
                    <ActionButton $print onClick={() => handlePrintBarcode(item)}>Print</ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </PageContainer>
  );
}
export default MenuItemsPage;
