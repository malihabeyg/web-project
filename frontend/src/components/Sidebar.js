import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' }, // <-- changed from '/' to '/dashboard'
    { path: '/products', label: 'Products', icon: 'fas fa-boxes' },
    { path: '/sales', label: 'Sales', icon: 'fas fa-shopping-cart' },
    { path: '/customers', label: 'Customers', icon: 'fas fa-users' },
    { path: '/reports', label: 'Reports', icon: 'fas fa-chart-bar' },
    { path: '/settings', label: 'Settings', icon: 'fas fa-cog' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2><i className="fas fa-box"></i> SmartStock</h2>
        <p>Inventory Management System</p>
      </div>
      <ul className="sidebar-menu">
        {navItems.map(item => (
          <li key={item.path}>
            <Link 
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <i className={item.icon}></i> {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
