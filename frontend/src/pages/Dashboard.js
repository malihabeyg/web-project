import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
 const { 
  products, 
  customers, 
  sales, 
  formatCurrency,
  fetchSalesTrend,
  fetchSalesByCategory,
  fetchTopProducts,
  exportData
} = useApp();


  const [salesTrendData, setSalesTrendData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [LineComponent, setLineComponent] = useState(null);
  const [DoughnutComponent, setDoughnutComponent] = useState(null);
  const [chartsLoaded, setChartsLoaded] = useState(false);

  useEffect(() => {
    loadDashboardCharts();
    let mounted = true;

    const loadCharts = async () => {
      try {
        await import('chart.js/auto'); // Register charts
        const { Line, Doughnut } = await import('react-chartjs-2');

        if (!mounted) return;
        setLineComponent(() => Line);
        setDoughnutComponent(() => Doughnut);
        setChartsLoaded(true);
      } catch (err) {
        console.error('Failed to load chart libraries:', err);
        setChartsLoaded(false);
      }
    };

    loadCharts();
    return () => { mounted = false; };
  }, []);

  const loadDashboardCharts = async () => {
    setLoading(true);
    try {
      const [trend, category, top] = await Promise.all([
        fetchSalesTrend(),
        fetchSalesByCategory(),
        fetchTopProducts(5)
      ]);
      setSalesTrendData(trend);
      setCategoryData(category);
      setTopProducts(top);
    } catch (error) {
      console.error('Failed to load charts:', error);
    } finally {
      setLoading(false);
    }
  };

  const lowStockProducts = products.filter(p => p.stock <= p.minStock && p.stock > 0);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  const salesTrendChartData = {
    labels: salesTrendData?.labels || [],
    datasets: [
      {
        label: 'Daily Sales',
        data: salesTrendData?.data || [],
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const categoryChartData = {
    labels: categoryData?.labels || [],
    datasets: [
      {
        data: categoryData?.data || [],
        backgroundColor: [
          '#3498db', '#e74c3c', '#f39c12', '#27ae60', 
          '#9b59b6', '#1abc9c', '#34495e', '#e67e22',
          '#95a5a6', '#d35400'
        ]
      }
    ]
  };

  return (
    <div id="dashboard-page">
      <header className="main-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="header-title">Dashboard</h1>
            <p className="header-subtitle">Welcome to SmartStock Inventory Management</p>
          </div>
          <div className="d-flex gap-10">
            <Link to="/sales" className="btn btn-primary">
              <i className="fas fa-plus"></i> New Sale
            </Link>
            <Link to="/products" className="btn btn-success">
              <i className="fas fa-plus"></i> Add Product
            </Link>
          </div>
        </div>
      </header>

      {/* Dashboard Stats */}
      <div className="row">
        <div className="col-md-3">
          <div className="stat-card primary">
            <div className="stat-value">{products.length}</div>
            <div className="stat-label">Total Products</div>
            <div className="stat-change positive">
              <i className="fas fa-arrow-up"></i> Active Items
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card warning">
            <div className="stat-value">{lowStockProducts.length}</div>
            <div className="stat-label">Low Stock Items</div>
            <div className="stat-change negative">
              <i className="fas fa-exclamation-triangle"></i> Needs Attention
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card success">
            <div className="stat-value">{customers.length}</div>
            <div className="stat-label">Total Customers</div>
            <div className="stat-change positive">
              <i className="fas fa-arrow-up"></i> Active Clients
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card danger">
            <div className="stat-value">
              {formatCurrency(
  sales
    .filter(s => new Date(s.saleDate).toDateString() === new Date().toDateString())
    .reduce((sum, s) => sum + (s.total || 0), 0)
)}

            </div>
            <div className="stat-label">Today's Sales</div>
            <div className="stat-change positive">
              <i className="fas fa-arrow-up"></i> +0%
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-20">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div className="form-row">
          <Link to="/products" className="btn btn-primary">
            <i className="fas fa-boxes"></i> Manage Products
          </Link>
          <Link to="/customers" className="btn btn-success">
            <i className="fas fa-users"></i> Manage Customers
          </Link>
          <Link to="/reports" className="btn btn-warning">
            <i className="fas fa-chart-bar"></i> View Reports
          </Link>
          <button
  className="btn btn-info"
  onClick={() => exportData(sales, 'sales-report.csv')}
>
  <i className="fas fa-download"></i> Export Sales
</button>

        </div>
      </div>

      {/* Charts */}
      <div className="row mt-20">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Sales Trend (Last 7 Days)</h3>
              <button 
                className="btn btn-sm btn-primary" 
                onClick={loadDashboardCharts}
                disabled={loading}
              >
                <i className="fas fa-sync"></i> Refresh
              </button>
            </div>
            <div className="chart-container">
              {salesTrendData && LineComponent && chartsLoaded ? (
                <LineComponent data={salesTrendChartData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return '$' + value.toLocaleString();
                        }
                      }
                    }
                  }
                }} />
              ) : (
                <div className="chart-placeholder">Chart unavailable</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Sales by Category</h3>
              <button 
                className="btn btn-sm btn-primary" 
                onClick={loadDashboardCharts}
                disabled={loading}
              >
                <i className="fas fa-sync"></i> Refresh
              </button>
            </div>
            <div className="chart-container">
              {categoryData && DoughnutComponent && chartsLoaded ? (
                <DoughnutComponent data={categoryChartData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }} />
              ) : (
                <div className="chart-placeholder">Chart unavailable</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sales and Low Stock */}
      <div className="row mt-20">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Sales</h3>
              <div>
                <Link to="/sales" className="btn btn-sm btn-primary">View All</Link>
                <Link to="/sales/new" className="btn btn-sm btn-success">New Sale</Link>
              </div>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Sale #</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.slice(0, 5).map(sale => (
                    <tr key={sale._id}>
                      <td>{sale.saleNumber}</td>
                      <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                      <td>{sale.customer ? sale.customer.name : 'Walk-in'}</td>
                      <td>{formatCurrency(sale.total)}</td>
                      <td><span className="badge badge-success">{sale.paymentStatus}</span></td>
                      <td>
                        <button className="btn btn-sm btn-primary">
                          <i className="fas fa-eye"></i> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Low Stock Alerts</h3>
              <Link to="/products" className="btn btn-sm btn-warning">Manage</Link>
            </div>
            <div id="lowStockAlerts">
              {lowStockProducts.slice(0, 5).map(product => (
                <div className="alert alert-warning" key={product._id}>
                  <strong>{product.name}</strong><br/>
                  <small>SKU: {product.sku} | Stock: {product.stock}/{product.minStock} | {formatCurrency(product.price)}</small>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <div className="alert alert-success">
                  <i className="fas fa-check-circle"></i> All products are well stocked!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="row mt-20">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Top Products This Month</h3>
              <button 
                className="btn btn-sm btn-primary" 
                onClick={loadDashboardCharts}
                disabled={loading}
              >
                <i className="fas fa-sync"></i> Refresh
              </button>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Sold</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.totalQuantity}</td>
                      <td>{formatCurrency(item.totalRevenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
