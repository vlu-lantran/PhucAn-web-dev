import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import '../styles/customer.css';

class Customer extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      filteredCustomers: [],
      orders: [],
      order: null,
      searchQuery: '',
      filterStatus: 'all',
      showOrders: true,
      showOrderDetails: true,
      loadingCustomers: false,
      loadingOrders: false,
      error: null,
    };
  }

  componentDidMount() {
    this.apiGetCustomers();
  }

  // HANDLERS
  handleSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    this.setState({ searchQuery }, this.filterCustomers);
  };

  handleFilter = (e) => {
    const filterStatus = e.target.value;
    this.setState({ filterStatus }, this.filterCustomers);
  };

  trCustomerClick = (item) => {
    this.setState({ orders: [], order: null, loadingOrders: true });
    this.apiGetOrdersByCustID(item._id);
  };

  trOrderClick = (item) => {
    this.setState({ order: item });
  };

  lnkDeactiveClick = (item) => {
    if (window.confirm('Are you sure you want to deactivate this customer?')) {
      this.apiPutCustomerDeactive(item._id, item.token);
    }
  };

  lnkEmailClick = (item) => {
    this.apiGetCustomerSendmail(item._id);
  };

  // FILTER
  filterCustomers = () => {
    const { customers, searchQuery, filterStatus } = this.state;
    let filtered = customers;

    if (searchQuery) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery) ||
          customer.email.toLowerCase().includes(searchQuery) ||
          customer.phone.toLowerCase().includes(searchQuery)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(
        (customer) => customer.active === parseInt(filterStatus)
      );
    }

    this.setState({ filteredCustomers: filtered });
  };

  // API CALLS
  apiGetCustomers = () => {
    this.setState({ loadingCustomers: true });
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/customers`, config)
      .then((res) => {
        this.setState({
          customers: res.data,
          filteredCustomers: res.data,
          loadingCustomers: false,
        }, this.filterCustomers);
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
        this.setState({ loadingCustomers: false, error: 'Failed to load customers. Please try again.' });
      });
  };

  apiGetOrdersByCustID = (cid) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/orders/customer/` + cid, config)
      .then((res) => {
        this.setState({ orders: res.data, loadingOrders: false });
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        this.setState({ loadingOrders: false, error: 'Failed to load orders. Please try again.' });
      });
  };

  apiPutCustomerDeactive = (id, token) => {
    const body = { token: token };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/api/admin/customers/deactive/` + id, body, config)
      .then((res) => {
        if (res.data) {
          this.apiGetCustomers();
          this.setState({ orders: [], order: null });
        } else {
          alert('Error! Please try again later.');
        }
      })
      .catch((error) => {
        console.error('Error deactivating customer:', error);
        alert('Error occurred while deactivating customer');
      });
  };

  apiGetCustomerSendmail = (id) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/customers/sendmail/` + id, config)
      .then((res) => {
        alert(res.data.message);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        alert('Error occurred while sending email');
      });
  };

  // RENDER
  render() {
    const {
      filteredCustomers, orders, order,
      showOrders, showOrderDetails,
      loadingCustomers, loadingOrders
    } = this.state;

    const customerRows = filteredCustomers.map((item) => (
      <tr
        key={item._id}
        className={`datatable-row ${orders.length > 0 && orders[0].customer._id === item._id ? 'selected' : ''}`}
        onClick={() => this.trCustomerClick(item)}
      >
        <td>{item._id}</td>
        <td>{item.username}</td>
        <td>{item.name}</td>
        <td>{item.phone}</td>
        <td>{item.email}</td>
        <td>
          <span className={`status-badge ${item.active ? 'active' : 'inactive'}`}>
            {item.active ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>
          {item.active === 0 ? (
            <span className="link email tooltip" data-tooltip="Send Activation Email" onClick={(e) => { e.stopPropagation(); this.lnkEmailClick(item); }}>
              EMAIL
            </span>
          ) : (
            <span className="link deactive tooltip" data-tooltip="Deactivate Customer" onClick={(e) => { e.stopPropagation(); this.lnkDeactiveClick(item); }}>
              DEACTIVE
            </span>
          )}
        </td>
      </tr>
    ));

    const orderRows = orders.map((item) => (
      <tr
        key={item._id}
        className={`datatable-row ${order?._id === item._id ? 'selected' : ''}`}
        onClick={() => this.trOrderClick(item)}
      >
        <td>{item._id}</td>
        <td>{new Date(item.cdate).toLocaleString()}</td>
        <td>{item.customer.name}</td>
        <td>{item.customer.phone}</td>
        <td>{item.total.toLocaleString()}</td>
        <td>{item.status}</td>
      </tr>
    ));

    const orderDetails = order?.items.map((item, index) => (
      <tr key={item.product._id} className="datatable-row">
        <td>{index + 1}</td>
        <td>{item.product._id}</td>
        <td>{item.product.name}</td>
        <td>
          <img
            src={"data:image/jpg;base64," + item.product.image}
            width="70px"
            height="70px"
            alt={item.product.name}
            className="product-image"
          />
        </td>
        <td>{item.product.price.toLocaleString()}</td>
        <td>{item.quantity}</td>
        <td>{(item.product.price * item.quantity).toLocaleString()}</td>
      </tr>
    ));

    return (
      <div className="customer-container">
        {/* Breadcrumb */}
        <div className="product-header">
          <div className="breadcrumb-container">
            <div className="breadcrumb">
              <Link to="/admin/home"><span>Trang chủ</span></Link> /{' '}
              <Link to="/admin/customer"><span>Khách hàng</span></Link>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="customer-header">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={this.state.searchQuery}
              onChange={this.handleSearch}
              className="search-input"
            />
            <select value={this.state.filterStatus} onChange={this.handleFilter} className="filter-select">
              <option value="all">All Status</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
        </div>

        {/* Customer List */}
        <div className="customer-list">
          <h2 className="customer-title">CUSTOMER LIST</h2>
          {loadingCustomers ? (
            <div className="loading">Loading customers...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="no-data">No customers found.</div>
          ) : (
            <table className="customer-table">
              <thead>
                <tr className="datatable-header">
                  <th>ID</th>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{customerRows}</tbody>
            </table>
          )}
        </div>

        {/* Order List */}
        {orders.length > 0 && (
          <div className="order-list">
            <h2 className="order-title">
              ORDER LIST
              <button className="toggle-btn" onClick={() => this.setState({ showOrders: !showOrders })}>
                <i className={`fas fa-chevron-${showOrders ? 'up' : 'down'}`}></i>
              </button>
            </h2>
            {showOrders && (
              loadingOrders ? (
                <div className="loading">Loading orders...</div>
              ) : (
                <table className="customer-table">
                  <thead>
                    <tr className="datatable-header">
                      <th>ID</th>
                      <th>Creation Date</th>
                      <th>Cust. Name</th>
                      <th>Cust. Phone</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>{orderRows}</tbody>
                </table>
              )
            )}
          </div>
        )}

        {/* Order Detail */}
        {order && (
          <div className="order-detail">
            <h2 className="order-detail-title">
              ORDER DETAIL
              <button className="toggle-btn" onClick={() => this.setState({ showOrderDetails: !showOrderDetails })}>
                <i className={`fas fa-chevron-${showOrderDetails ? 'up' : 'down'}`}></i>
              </button>
            </h2>
            {showOrderDetails && (
              <table className="customer-table">
                <thead>
                  <tr className="datatable-header">
                    <th>No.</th>
                    <th>Prod. ID</th>
                    <th>Prod. Name</th>
                    <th>Image</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>{orderDetails}</tbody>
              </table>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Customer;
