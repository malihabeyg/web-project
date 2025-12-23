import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // ======== STATE ========
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);

  // ======== ALERT ========
  const showAlert = (message, type = 'success', timeout = 3000) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setAlerts(prev => prev.filter(a => a.id !== id)), timeout);
  };

  // ======== PRODUCTS ========
  const fetchProducts = useCallback(async (filters = {}) => {
    try {
      const res = await axios.get(`${API_URL}/products`, { params: filters });
      setProducts(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Failed to fetch products', 'danger');
      return [];
    }
  }, []);

  const createProduct = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/products`, data);
      setProducts(prev => [res.data, ...prev]);
      showAlert('Product created successfully', 'success');
      return res.data;
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Failed to create product', 'danger');
      return null;
    }
  };

  const updateProduct = async (id, data) => {
    try {
      const res = await axios.put(`${API_URL}/products/${id}`, data);
      setProducts(prev => prev.map(p => (p._id === id ? res.data : p)));
      showAlert('Product updated successfully', 'success');
      return res.data;
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Failed to update product', 'danger');
      return null;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      showAlert('Product deleted successfully', 'success');
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Failed to delete product', 'danger');
    }
  };

  // ======== CUSTOMERS ========
  const fetchCustomers = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/customers`);
      setCustomers(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Failed to fetch customers', 'danger');
      return [];
    }
  }, []);

  const createCustomer = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/customers`, data);
      setCustomers(prev => [res.data, ...prev]);
      showAlert('Customer created successfully', 'success');
      return res.data;
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Failed to create customer', 'danger');
      return null;
    }
  };

  const updateCustomer = async (id, data) => {
    try {
      const res = await axios.put(`${API_URL}/customers/${id}`, data);
      setCustomers(prev => prev.map(c => (c._id === id ? res.data : c)));
      showAlert('Customer updated successfully', 'success');
      return res.data;
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Failed to update customer', 'danger');
      return null;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await axios.delete(`${API_URL}/customers/${id}`);
      setCustomers(prev => prev.filter(c => c._id !== id));
      showAlert('Customer deleted successfully', 'success');
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Failed to delete customer', 'danger');
    }
  };

  // ======== SALES ========
  // ======== SALES ========

// Fetch all sales
const fetchSales = useCallback(async () => {
  try {
    const res = await axios.get(`${API_URL}/sales`);
    setSales(res.data);
    return res.data;
  } catch (err) {
    console.error(err);
    showAlert(
      err.response?.data?.message || 'Failed to fetch sales',
      'danger'
    );
    return [];
  }
}, [showAlert]);


// Create new sale
const createSale = async (data) => {
  try {
    const payload = {
      customer: data.customer || null,
      items: data.items.map(i => ({
        product: i.productId,   // backend expects "product"
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice)
      })),
      tax: Number(data.tax) || 0,
      discount: Number(data.discount) || 0,
      notes: data.notes || '',
      paymentMethod: data.paymentMethod || 'Cash',
      staffMember: data.staffMember || ''
    };

    const res = await axios.post(`${API_URL}/sales`, payload);

    // Update state once (single source of truth)
    setSales(prev => [res.data, ...prev]);

    showAlert('Sale created successfully', 'success');
    return res.data;
  } catch (err) {
    console.error(err);
    showAlert(
      err.response?.data?.message || 'Failed to create sale',
      'danger'
    );
    return null;
  }
};


// Update existing sale
const updateSale = async (id, data) => {
  try {
    const payload = {
      customer: data.customer || null,
      items: data.items.map(i => ({
        product: i.productId,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice)
      })),
      tax: Number(data.tax) || 0,
      discount: Number(data.discount) || 0,
      notes: data.notes || '',
      paymentMethod: data.paymentMethod || 'Cash',
      staffMember: data.staffMember || ''
    };

    const res = await axios.put(`${API_URL}/sales/${id}`, payload);

    setSales(prev =>
      prev.map(sale => (sale._id === id ? res.data : sale))
    );

    showAlert('Sale updated successfully', 'success');
    return res.data;
  } catch (err) {
    console.error(err);
    showAlert(
      err.response?.data?.message || 'Failed to update sale',
      'danger'
    );
    return null;
  }
};


// Delete sale
const deleteSale = async (id) => {
  try {
    await axios.delete(`${API_URL}/sales/${id}`);

    setSales(prev => prev.filter(sale => sale._id !== id));

    showAlert('Sale deleted successfully', 'success');
  } catch (err) {
    console.error(err);
    showAlert(
      err.response?.data?.message || 'Failed to delete sale',
      'danger'
    );
  }
};

  // ======== DASHBOARD & REPORTS ========
  const loadDashboardData = async () => {
    try {
      const res = await axios.get(`${API_URL}/reports/dashboard-stats`);
      setDashboardStats(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      showAlert('Failed to load dashboard stats', 'danger');
      return null;
    }
  };

 const fetchSalesTrend = async () => {
  try {
    const res = await axios.get(`${API_URL}/reports/sales-trend`);

    // Ensure correct structure for Chart.js
    return {
      labels: res.data?.labels || [],
      data: res.data?.data || []
    };
  } catch (err) {
    console.error(err);
    showAlert('Failed to load sales trend', 'danger');
    return { labels: [], data: [] };
  }
};
const fetchSalesByCategory = async () => {
  try {
    const res = await axios.get(`${API_URL}/reports/sales-by-category`);

    return {
      labels: res.data?.labels || [],
      data: res.data?.data || []
    };
  } catch (err) {
    console.error(err);
    showAlert('Failed to load category sales', 'danger');
    return { labels: [], data: [] };
  }
};


  const fetchTopProducts = async (limit = 5) => {
    try {
      const res = await axios.get(`${API_URL}/reports/top-products`, { params: { limit } });
      return res.data;
    } catch (err) {
      console.error(err);
      showAlert('Failed to load top products', 'danger');
      return [];
    }
  };

  // ======== UTILS ========
  const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount);

  const exportData = (data, filename = 'data.csv') => {
    if (!Array.isArray(data) || data.length === 0) {
      showAlert('No data available to export', 'warning');
      return;
    }
    const headers = Object.keys(data[0]);
    const rows = data.map(item =>
      headers.map(h => `"${JSON.stringify(item[h] ?? '')}"`).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // ======== INITIAL LOAD ========
  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    fetchSales();
    loadDashboardData();
  }, [fetchProducts, fetchCustomers, fetchSales]);

  return (
    <AppContext.Provider
      value={{
        products,
        customers,
        sales,
        dashboardStats,
        alerts,
        showAlert,
        fetchProducts,
        fetchCustomers,
        fetchSales,
        createProduct,
        updateProduct,
        deleteProduct,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        createSale,
        updateSale,
        deleteSale,
        fetchSalesTrend,
        fetchSalesByCategory,
        fetchTopProducts,
        loadDashboardData,
        formatCurrency,
        exportData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
