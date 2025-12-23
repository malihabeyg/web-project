import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './Sales.css';

const Sales = () => {
  const { 
    sales, 
    fetchSales, 
    createSale, 
    products, 
    customers, 
    formatCurrency, 
    showAlert 
  } = useApp();

  const [formData, setFormData] = useState({
    customer: '',
    staffMember: '',
    paymentMethod: 'Cash',
    tax: 0,
    discount: 0,
    notes: '',
    items: [{ productId: '', quantity: 1, unitPrice: 0, subtotal: 0 }],
    total: 0
  });

  const [showForm, setShowForm] = useState(false);

  // Solves the exhaustive-deps warning
  useEffect(() => {
    if (sales.length === 0) {
      fetchSales();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updatedData = { ...prev };

      if (index !== null) {
        // Handle changes within the Items array
        const newItems = [...prev.items];
        const item = { ...newItems[index] };

        if (name === 'productId') {
          item.productId = value;
          const selectedProduct = products.find(p => p._id === value);
          item.unitPrice = selectedProduct ? selectedProduct.price : 0;
        } else {
          item[name] = (name === 'quantity' || name === 'unitPrice') ? Number(value) : value;
        }

        item.subtotal = item.quantity * item.unitPrice;
        newItems[index] = item;
        updatedData.items = newItems;
      } else {
        // Handle changes to top-level fields (tax, discount, etc)
        updatedData[name] = (name === 'tax' || name === 'discount') ? Number(value) : value;
      }

      // Recalculate Total every time any relevant field changes
      const subtotalSum = updatedData.items.reduce((acc, i) => acc + i.subtotal, 0);
      updatedData.total = subtotalSum + Number(updatedData.tax) - Number(updatedData.discount);

      return updatedData;
    });
  };

  const addItemRow = () => setFormData(prev => ({
    ...prev,
    items: [...prev.items, { productId: '', quantity: 1, unitPrice: 0, subtotal: 0 }]
  }));

  const removeItemRow = (index) => {
    setFormData(prev => {
      const newItems = prev.items.filter((_, i) => i !== index);
      const subtotalSum = newItems.reduce((acc, i) => acc + i.subtotal, 0);
      return {
        ...prev,
        items: newItems,
        total: subtotalSum + prev.tax - prev.discount
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.staffMember || !formData.paymentMethod) {
        return showAlert('Please fill required fields', 'error');
    }
    if (formData.items.some(i => !i.productId || !i.quantity)) {
        return showAlert('All items must have product and quantity', 'error');
    }

    const payload = {
      ...formData,
      items: formData.items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice
      }))
    };

    const createdSale = await createSale(payload);

    if (createdSale) {
      setFormData({
        customer: '',
        staffMember: '',
        paymentMethod: 'Cash',
        tax: 0,
        discount: 0,
        notes: '',
        items: [{ productId: '', quantity: 1, unitPrice: 0, subtotal: 0 }],
        total: 0
      });
      setShowForm(false);
    }
  };

  return (
    <div className="sales-container">
      <div className="sales-header">
        <h2>Sales</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Sale'}
        </button>
      </div>

      {showForm && (
        <form className="sales-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Customer</label>
              <select name="customer" value={formData.customer} onChange={handleInputChange}>
                <option value="">Select Customer</option>
                {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Staff Member *</label>
              <input name="staffMember" value={formData.staffMember} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>Payment Method *</label>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tax</label>
              <input type="number" name="tax" value={formData.tax} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Discount</label>
              <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange} />
            </div>
          </div>

          <h4>Items</h4>
          {formData.items.map((item, idx) => (
            <div className="form-row" key={idx}>
              <div className="form-group">
                <label>Product *</label>
                <select name="productId" value={item.productId} onChange={e => handleInputChange(e, idx)}>
                  <option value="">Select Product</option>
                  {products.map(p => (
                    <option key={p._id} value={p._id}>
                        {p.name} ({formatCurrency(p.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quantity *</label>
                <input type="number" name="quantity" min="1" value={item.quantity} onChange={e => handleInputChange(e, idx)} />
              </div>

              <div className="form-group">
                <label>Unit Price</label>
                <input type="number" value={item.unitPrice} readOnly />
              </div>

              <div className="form-group">
                <label>Subtotal</label>
                <input type="number" value={item.subtotal} readOnly />
              </div>

              <div className="form-group">
                {formData.items.length > 1 && (
                    <button type="button" className="btn btn-danger" onClick={() => removeItemRow(idx)}>Remove</button>
                )}
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-success" onClick={addItemRow}>Add Item</button>
          <div className="total-display">
            <h4>Total: {formatCurrency(formData.total)}</h4>
          </div>
          <button type="submit" className="btn btn-primary">Record Sale</button>
        </form>
      )}

      <div className="sales-table">
        <table>
          <thead>
            <tr>
              <th>Sale #</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(s => (
              <tr key={s._id}>
                <td>{s.saleNumber}</td>
                <td>{s.customer?.name || '—'}</td>
                <td>{s.items.map(i => `${i.product?.name || 'Product'} x${i.quantity}`).join(', ')}</td>
                <td>{formatCurrency(s.total)}</td>
                <td>{new Date(s.saleDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;