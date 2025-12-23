import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './Customers.css';

const Customers = () => {
  const { 
    customers,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    showAlert
  } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    await fetchCustomers();
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // support nested address fields (name matches street/city/state/zipCode/country)
    if (["street", "city", "state", "zipCode", "country"].includes(name)) {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showAlert('Name and email are required', 'error');
      return;
    }

    if (editingId) {
      await updateCustomer(editingId, formData);
    } else {
      await createCustomer(formData);
    }
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: { street: '', city: '', state: '', zipCode: '', country: 'USA' }
    });
    setShowForm(false);
    setEditingId(null);
    loadCustomers();
  };

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || { street: '', city: '', state: '', zipCode: '', country: 'USA' }
    });
    setEditingId(customer._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(id);
      loadCustomers();
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', address: { street: '', city: '', state: '', zipCode: '', country: 'USA' } });
  };

  const formatAddress = (addr) => {
    if (!addr) return '-';
    if (typeof addr === 'string') return addr || '-';
    const parts = [addr.street, addr.city, addr.state, addr.zipCode, addr.country].filter(Boolean);
    return parts.length ? parts.join(', ') : '-';
  };

  return (
    <div className="customers-container">
      <div className="customers-header">
        <h2>Customers</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ New Customer'}
        </button>
      </div>

      {showForm && (
        <div className="customer-form">
          <h3>{editingId ? 'Edit Customer' : 'Add New Customer'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Street</label>
                <input
                  type="text"
                  name="street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.address.zipCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.address.country}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn btn-success">
                {editingId ? 'Update' : 'Add'} Customer
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="customers-table">
        {loading ? (
          <p>Loading customers...</p>
        ) : customers && customers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || '-'}</td>
                  <td>{formatAddress(customer.address)}</td>
                  <td>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEdit(customer)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(customer._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No customers found.</p>
        )}
      </div>
    </div>
  );
};

export default Customers;
