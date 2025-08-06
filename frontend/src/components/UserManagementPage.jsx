import React, { useState, useEffect } from 'react';
import ApiClient from '../services/ApiClient';
import styled from 'styled-components';

// --- Styled Components ---
const PageContainer = styled.div`
  padding: 32px;
  font-family: sans-serif;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 24px;
`;

const Card = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
`;

const Button = styled.button`
  background-color: #2563eb;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 24px;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background-color: #f1f5f9;
  color: #475569;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
`;

const ActionButton = styled.button`
  color: ${props => (props.$delete ? '#ef4444' : '#2563eb')};
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 16px;
  &:hover {
    text-decoration: underline;
  }
`;

// --- Modal Components ---
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
`;

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'WAITER',
    status: 'ACTIVE',
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await ApiClient.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (user = null) => {
    setError('');
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        password: '', // Don't pre-fill password for security
        role: user.role,
        status: user.status,
      });
    } else {
      setEditingUser(null);
      setFormData({ username: '', password: '', role: 'WAITER', status: 'ACTIVE' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Password is only required when creating a new user
    if (!editingUser && !formData.password) {
        setError('Password is required for new users.');
        return;
    }

    const payload = { ...formData };
    // If password is not changed during edit, don't send it
    if (editingUser && !payload.password) {
        delete payload.password;
    }

    try {
      if (editingUser) {
        await ApiClient.patch(`/users/${editingUser.id}`, payload);
      } else {
        await ApiClient.post('/users', payload);
      }
      await fetchUsers();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await ApiClient.delete(`/users/${userId}`);
        await fetchUsers();
      } catch (err) {
        setError('Failed to delete user.');
      }
    }
  };

  return (
    <PageContainer>
      <Title>User Management</Title>
      <Button onClick={() => handleOpenModal()}>Add New User</Button>

      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Username</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <Td>{user.username}</Td>
                <Td>{user.role}</Td>
                <Td>{user.status}</Td>
                <Td>
                  <ActionButton onClick={() => handleOpenModal(user)}>Edit</ActionButton>
                  <ActionButton $delete onClick={() => handleDelete(user.id)}>Delete</ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
        {isLoading && <p>Loading users...</p>}
      </Card>

      {isModalOpen && (
        <ModalBackdrop>
          <ModalContent>
            <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
            <ModalForm onSubmit={handleSubmit}>
              <Input name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} required />
              <Input name="password" type="password" placeholder={editingUser ? 'New Password (optional)' : 'Password'} value={formData.password} onChange={handleInputChange} />
              <Select name="role" value={formData.role} onChange={handleInputChange}>
                <option value="ADMIN">Admin</option>
                <option value="MENU_MANAGER">Menu Manager</option>
                <option value="STAFF">Staff</option>
                <option value="WAITER">Waiter</option>
                <option value="KITCHEN">Kitchen</option>
              </Select>
              <Select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </Select>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button type="button" onClick={handleCloseModal} style={{ backgroundColor: '#64748b' }}>Cancel</Button>
                <Button type="submit">{editingUser ? 'Update User' : 'Create User'}</Button>
              </div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </ModalForm>
          </ModalContent>
        </ModalBackdrop>
      )}
    </PageContainer>
  );
}

export default UserManagementPage;