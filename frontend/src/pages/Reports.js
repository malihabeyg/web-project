import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLocation } from 'react-router-dom';
import './Reports.css';

const Reports = () => {
  const { 
    formatCurrency,
    exportData,
    showAlert,
    fetchSales,
    fetchTopProducts,
    fetchInventoryHealth,
    fetchCustomerInsights
  } = useApp();

  const location = useLocation();
  const [reportData, setReportData] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    topProducts: [],
    monthlySales: []
  });
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('summary');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get('type');
    if (t) setReportType(t);
    loadReports(t || 'summary');
  }, [location.search]);

  const loadReports = async (type = reportType) => {
    setLoading(true);
    try {
      if (type === 'inventory') {
        const inventory = await fetchInventoryHealth();
        setReportData({
          totalSales: 0,
          totalRevenue: 0,
          totalProducts: inventory.totalProducts || 0,
          totalCustomers: 0,
          topProducts: [],
          monthlySales: []
        });
      } else if (type === 'customers') {
        const customers = await fetchCustomerInsights();
        setReportData({
          totalSales: 0,
          totalRevenue: 0,
          totalProducts: 0,
          totalCustomers: customers.totalCustomers || 0,
          topProducts: [],
          monthlySales: []
        });
      } else if (type === 'sales') {
        const s = await fetchSales();
        const totalSales = s.length;
        const totalRevenue = s.reduce((sum, x) => sum + (x.total || 0), 0);
        const monthlyMap = {};
        for (const sale of s) {
          const d = new Date(sale.saleDate || sale.createdAt || Date.now());
          const key = d.toLocaleString('default', { month: 'short' });
          monthlyMap[key] = monthlyMap[key] || { month: key, sales: 0, revenue: 0 };
          monthlyMap[key].sales += 1;
          monthlyMap[key].revenue += (sale.total || 0);
        }
        const monthlySales = Object.values(monthlyMap);
        const topProducts = (await fetchTopProducts(5)) || [];
        setReportData({
          totalSales,
          totalRevenue,
          totalProducts: 0,
          totalCustomers: 0,
          topProducts: topProducts.map(tp => ({
            name: tp.name,
            sales: tp.totalQuantity || 0,
            revenue: tp.totalRevenue || 0
          })),
          monthlySales
        });
      } else if (type === 'summary') {
        const [inventory, customers, s, top] = await Promise.all([
          fetchInventoryHealth(),
          fetchCustomerInsights(),
          fetchSales(),
          fetchTopProducts(5)
        ]);
        setReportData({
          totalSales: s.length,
          totalRevenue: s.reduce((sum, x) => sum + (x.total || 0), 0),
          totalProducts: inventory.totalProducts || 0,
          totalCustomers: customers.totalCustomers || 0,
          topProducts: top.map(tp => ({
            name: tp.name,
            sales: tp.totalQuantity || 0,
            revenue: tp.totalRevenue || 0
          })),
          monthlySales: []
        });
      }

      showAlert('Reports loaded successfully', 'success');
    } catch (error) {
      showAlert('Error loading reports', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    let data = [];

    if (reportType === 'inventory') {
      data = reportData.totalProducts ? [{ totalProducts: reportData.totalProducts }] : [];
    } else if (reportType === 'customers') {
      data = reportData.totalCustomers ? [{ totalCustomers: reportData.totalCustomers }] : [];
    } else if (reportType === 'sales') {
      data = reportData.topProducts.length ? reportData.topProducts : [];
    } else if (reportType === 'summary') {
      data = (reportData.totalSales || reportData.totalRevenue || reportData.totalProducts || reportData.totalCustomers)
        ? [{
            totalSales: reportData.totalSales,
            totalRevenue: reportData.totalRevenue,
            totalProducts: reportData.totalProducts,
            totalCustomers: reportData.totalCustomers
          }]
        : [];
    }

    if (!data.length) {
      showAlert('No data available to export', 'warning');
      return;
    }

    exportData(data, `${reportType}-report.csv`);
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Reports & Analytics</h2>
        <div className="report-controls">
          <select value={reportType} onChange={e => { setReportType(e.target.value); loadReports(e.target.value); }}>
          
            <option value="sales">Sales</option>
            <option value="inventory">Inventory</option>
            <option value="customers">Customers</option>
          </select>
          <button className="btn btn-primary" onClick={() => loadReports(reportType)}>Refresh</button>
        </div>
      </div>

      {loading ? (
        <p>Loading reports...</p>
      ) : (
        <>
          <div className="report-summary">
            <div className="summary-card">
              <h3>Total Sales</h3>
              <p className="summary-value">{reportData.totalSales}</p>
            </div>
            <div className="summary-card">
              <h3>Total Revenue</h3>
              <p className="summary-value">{formatCurrency(reportData.totalRevenue)}</p>
            </div>
            <div className="summary-card">
              <h3>Total Products</h3>
              <p className="summary-value">{reportData.totalProducts}</p>
            </div>
            <div className="summary-card">
              <h3>Total Customers</h3>
              <p className="summary-value">{reportData.totalCustomers}</p>
            </div>
          </div>

          <div className="report-actions">
            <button className="btn btn-success" onClick={handleExport}>Export CSV</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
