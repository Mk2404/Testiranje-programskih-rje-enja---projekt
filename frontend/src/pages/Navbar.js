// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onLogout, isAuthenticated }) => {
  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="navbar-left">
      <ul className="navbar-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/add-reimbursement">Add Reimbursement</Link></li>
        </ul>
        </div>
        <div className="navbar-right">
        <button onClick={onLogout} className="logout-button">Logout</button>
        </div>
    </nav>
  );
};

export default Navbar;
