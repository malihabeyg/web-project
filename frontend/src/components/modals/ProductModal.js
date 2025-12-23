import React, { useState, useEffect } from 'react';

const ProductModal = ({ product, onSave, onClose, readOnly = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: '',
    minStock: '10',
    supplier: '',
    description: '',
    barcode: ''
  });

  const categories = [
    'Electronics', 'Clothing', 'Food', 'Books',
    'Home & Garden', 'Sports', 'Toys', 'Other'
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || '',
        price: product.price || '',
        stock: product.stock || '',
        minStock: product.minStock || '10',
        supplier: product.supplier || '',
        description: product.description || '',
        barcode: product.barcode || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (readOnly) return;

    if (!formData.name || !formData.sku || !formData.category || !formData.price || !formData.stock) {
      alert('Please fill in all required fields');
      return;
    }

    onSave({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      minStock: parseInt(formData.minStock),
      sku: formData.sku.toUpperCase()
    });
  };

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{readOnly ? 'View Product' : product ? 'Edit Product' : 'Add Product'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={readOnly}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>SKU *</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  disabled={readOnly}
                  pattern="[A-Z0-9]{3,12}"
                  required
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={readOnly}
                  required
                  className="form-control form-select"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  disabled={readOnly}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  disabled={readOnly}
                  step="0.01"
                  min="0"
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Current Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  disabled={readOnly}
                  min="0"
                  required
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Minimum Stock *</label>
                <input
                  type="number"
                  name="minStock"
                  value={formData.minStock}
                  onChange={handleChange}
                  disabled={readOnly}
                  min="0"
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Barcode</label>
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  disabled={readOnly}
                  pattern="[0-9]{8,13}"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={readOnly}
                className="form-control"
              />
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          {!readOnly && <button onClick={handleSubmit} className="btn btn-success">Save Product</button>}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
