import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = ({ role }) => {
  const [reimbursements, setReimbursements] = useState([]);
  const [search, setSearch] = useState('');
  const typeLabels = {
    business_expenses: 'Business Expenses',
    auto_mileage: 'Auto Mileage',
    travel: 'Travel',
    medical_expenses: 'Medical Expenses',
    employee_stipends: 'Employee Stipends',
  };

  const fetchReimbursements = async (searchQuery = '') => {
    try {
      const { data } = await axios.get('/api/reimbursements', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: searchQuery ? { search: searchQuery } : {},
      });
      setReimbursements(data);
    } catch (error) {
      toast.error('Failed to fetch reimbursements');
    }
  };

  useEffect(() => {
    fetchReimbursements();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchReimbursements(value);
  };

  const handleApproval = async (id, status) => {
    try {
      const { data } = await axios.patch(
        `/api/reimbursements/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setReimbursements((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: data.status } : item))
      );
      toast.success(`Reimbursement ${status}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div>
      <h2>{role === 'admin' ? 'Dashboard - Admin' : 'Dashboard'}</h2>
      <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
  <input
    type="text"
    placeholder="Search reimbursements..."
    value={search}
    onChange={handleSearchChange}
    data-testid="search-input"
    style={{
      padding: '0.5rem',
      width: '300px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    }}
  />
</div>
      <table>
        <thead>
          <tr>
            <th>Reimbursement</th>
            <th>Type</th>
            <th>Amount (in EUR)</th>
            <th>Status</th>
            {role === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {reimbursements.map((reimbursement) => (
            <tr key={reimbursement.id}>
              <td>{reimbursement.description}</td>
              <td>{typeLabels[reimbursement.type] || reimbursement.type}</td>
              <td>{reimbursement.amount.toFixed(2)}</td>
              <td>{reimbursement.status}</td>
              {role === 'admin' && (
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleApproval(reimbursement.id, 'Approved')}
                      data-testid={`approve-${reimbursement.id}`}
                      disabled={reimbursement.status === 'Approved' || reimbursement.status === 'Rejected'}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproval(reimbursement.id, 'Rejected')}
                      data-testid={`reject-${reimbursement.id}`}
                      disabled={reimbursement.status === 'Approved' || reimbursement.status === 'Rejected'}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
