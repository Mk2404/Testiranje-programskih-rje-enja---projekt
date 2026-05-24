// AddReimbursementPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:3001'; 

const AddReimbursementPage = () => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('business_expenses');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/reimbursements',
        { amount: Number(amount), type, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Reimbursement added successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding reimbursement');
    }
  };

  return (
    <div className="card compact-card">
    <h2 className="card-header">Add Reimbursement</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          data-testid="description-input"
        />
      </div>
      <div>
        <label>Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          data-testid="type-input"
        >
          <option value="business_expenses">Business Expenses</option>
          <option value="auto_mileage">Auto Mileage</option>
          <option value="travel">Travel</option>
          <option value="medical_expenses">Medical Expenses</option>
          <option value="employee_stipends">Employee Stipend</option>
        </select>
      </div>
      <div>
        <label>Amount (in EUR)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          data-testid="amount-input"
        />
      </div>
      <button type="submit" data-testid="submit-button">Submit</button>
    </form>
  </div>  
  );
};

export default AddReimbursementPage;
