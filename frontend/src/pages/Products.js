import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductModal from '../components/modals/ProductModal';
import BulkUpdateModal from '../components/modals/BulkUpdateModal';

const Products = () => {
  const {
    products,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    formatCurrency,
    exportData,
    showAlert
  } = useApp();

  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    lowStock: false,
    outOfStock: false
  });

  const [showProductModal, setShowProductModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load products with filters
  const loadProducts = async () => {
    setLoading(true);
    await fetchProducts(filters);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [filters]);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', lowStock: false, outOfStock: false });
  };

  // Save or update product
  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) await updateProduct(editingProduct._id, productData);
      else await createProduct(productData);

      showAlert(`Product ${editingProduct ? 'updated' : 'created'} successfully`, 'success');
      setShowProductModal(false);
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      showAlert(err.message || 'Failed to save product', 'danger');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      showAlert('Product deleted successfully', 'success');
      loadProducts();
    } catch (err) {
      showAlert(err.message || 'Failed to delete product', 'danger');
    }
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    if (filters.lowStock && p.stock > p.minStock) return false;
    if (filters.outOfStock && p.stock > 0) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  // Determine stock status
  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return { label: 'Out of Stock', class: 'badge-danger' };
    if (stock <= minStock) return { label: 'Low Stock', class: 'badge-warning' };
    return { label: 'In Stock', class: 'badge-success' };
  };

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div id="products-page">
      <header className="main-header">
        <h1>Products Management</h1>
        <button
          className="btn btn-success"
          onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
        >
          + Add Product
        </button>
      </header>

      <div className="card mb-3 p-3">
        <div className="form-row d-flex gap-2 align-items-center">
          <input
            type="text"
            name="search"
            placeholder="Search..."
            value={filters.search}
            onChange={handleFilterChange}
            className="form-control"
          />
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="form-control"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <label className="form-check-label">
            <input
              type="checkbox"
              name="lowStock"
              checked={filters.lowStock}
              onChange={handleFilterChange}
              className="form-check-input"
            />
            Low Stock
          </label>
          <label className="form-check-label">
            <input
              type="checkbox"
              name="outOfStock"
              checked={filters.outOfStock}
              onChange={handleFilterChange}
              className="form-check-input"
            />
            Out of Stock
          </label>
          <button className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>
        </div>
      </div>

      <div className="card p-3">
        {loading ? <p>Loading...</p> :
          <table className="table table-striped">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
<tbody>
  {filteredProducts.map(product => {
    const status = getStockStatus(product.stock, product.minStock);
    return (
      <tr key={product._id}>
        <td>{product.sku}</td>
        <td>{product.name}</td>
        <td>{product.category}</td>
        <td>{formatCurrency(product.price)}</td>
        <td>{product.stock}</td>
        <td>
          <span className={`badge ${status.class}`} style={{ color: 'black' }}>
            {status.label}
          </span>
        </td>
        <td className="d-flex gap-1">
          <button className="btn btn-info" onClick={() => setViewProduct(product)}>
            <i className="fas fa-eye"></i>
          </button>
          <button className="btn btn-primary" onClick={() => { setEditingProduct(product); setShowProductModal(true); }}>
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn btn-danger" onClick={() => handleDeleteProduct(product._id)}>
            <i className="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    );
  })}
</tbody>

          </table>
        }
      </div>

      {showProductModal &&
        <ProductModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => { setShowProductModal(false); setEditingProduct(null); }}
        />
      }

      {viewProduct &&
        <ProductModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
          readOnly={true}
        />
      }

      {showBulkModal &&
        <BulkUpdateModal
          onClose={() => setShowBulkModal(false)}
          onUpdate={loadProducts}
        />
      }
    </div>
  );
};

export default Products;
