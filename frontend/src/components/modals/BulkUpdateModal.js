import React, { useState } from 'react';
import './BulkUpdateModal.css';

const BulkUpdateModal = ({ isOpen, onClose, onSubmit, selectedCount }) => {
  const [updateData, setUpdateData] = useState({
    field: 'price',
    value: '',
    operation: 'set'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!updateData.value) {
      alert('Please enter a value');
      return;
    }
    onSubmit(updateData);
    setUpdateData({ field: 'price', value: '', operation: 'set' });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Bulk Update Products</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <p>Update {selectedCount} selected product(s)</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Field to Update</label>
              <select name="field" value={updateData.field} onChange={handleChange}>
                <option value="price">Price</option>
                <option value="stock">Stock</option>
                <option value="category">Category</option>
              </select>
            </div>

            <div className="form-group">
              <label>Operation</label>
              <select name="operation" value={updateData.operation} onChange={handleChange}>
                <option value="set">Set to</option>
                <option value="increase">Increase by</option>
                <option value="decrease">Decrease by</option>
              </select>
            </div>

            <div className="form-group">
              <label>Value</label>
              <input
                type="text"
                name="value"
                value={updateData.value}
                onChange={handleChange}
                placeholder="Enter value"
                required
              />
            </div>

            <div className="modal-actions">
              <button type="submit" className="btn btn-success">Update</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkUpdateModal;
