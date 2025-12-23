import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext'; // import auth context
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const { showAlert } = useApp();
  const { logout } = useAuth();  // access logout function
  const navigate = useNavigate(); // for redirect

  const [settings, setSettings] = useState({
    companyName: 'SmartStock',
    timezone: 'Asia/Karachi',
    currency: 'PKR',
    dateFormat: 'DD/MM/YYYY',
    lowStockThreshold: 10,
    lastUpdated: ''
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Simulate API call
      setTimeout(() => {
        showAlert('Settings saved successfully', 'success');
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      showAlert('Error saving settings', 'error');
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({
      companyName: 'SmartStock',
      timezone: 'Asia/Karachi',
      currency: 'PKR',
      dateFormat: 'DD/MM/YYYY',
      lowStockThreshold: 10,
      lastUpdated: ''
    });
    showAlert('Settings reset to defaults', 'info');
  };

  const handleLogout = () => {
    logout();          // clear user session
    navigate('/signin'); // redirect to auth layout
    showAlert('Logged out successfully', 'success');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Settings</h2>
      </div>

      <form onSubmit={handleSave} className="settings-form">
        <div className="settings-section">
          <h3>General Settings</h3>

          <div className="form-group">
            <label>Company / Store Name</label>
            <input
              type="text"
              name="companyName"
              value={settings.companyName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Timezone</label>
            <select name="timezone" value={settings.timezone} onChange={handleChange}>
              <option value="Asia/Karachi">Asia/Karachi</option>
            </select>
          </div>

          <div className="form-group">
            <label>Currency</label>
            <select name="currency" value={settings.currency} onChange={handleChange}>
              <option value="PKR">PKR (₨)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date Format</label>
            <select name="dateFormat" value={settings.dateFormat} onChange={handleChange}>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div className="form-group">
            <label>Last Updated</label>
            <input
              type="date"
              name="lastUpdated"
              value={settings.lastUpdated}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Inventory Settings</h3>

          <div className="form-group">
            <label>Low Stock Threshold</label>
            <input
              type="number"
              name="lowStockThreshold"
              value={settings.lowStockThreshold}
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>

        <div className="settings-actions">
          <button type="submit" className="btn btn-success" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Reset to Defaults
          </button>
          <button type="button" className="btn btn-danger" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
