import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import '../styles/order.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

class Order extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null,
      loading: false,
      currentPage: 1,
      ordersPerPage: 5,
      searchQuery: '',
      sortField: 'cdate',
      sortOrder: 'desc',
      filterStatus: 'ALL',
    };
  }

  componentDidMount() {
    this.apiGetOrders();
  }

  trItemClick(item) {
    this.setState((prevState) => ({
      order: prevState.order && prevState.order._id === item._id ? null : item,
    }));
  }

  lnkApproveClick(id) {
    if (window.confirm('Bạn có chắc chắn muốn duyệt đơn hàng này?')) {
      this.apiPutOrderStatus(id, 'APPROVED');
    }
  }

  lnkCancelClick(id) {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      this.apiPutOrderStatus(id, 'CANCELED');
    }
  }

  handleSearch = (e) => {
    this.setState({ searchQuery: e.target.value, currentPage: 1 });
  };

  handleFilterStatus = (e) => {
    this.setState({ filterStatus: e.target.value, currentPage: 1 });
  };

  handleSort = (field) => {
    const { sortField, sortOrder } = this.state;
    const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    this.setState({ sortField: field, sortOrder: newSortOrder });
  };

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  apiGetOrders() {
    this.setState({ loading: true });
    const config = { headers: { 'x-access-token': this.context.token } };
    const API = process.env.REACT_APP_API_BASE_URL || '';
    axios
      .get(`${API}/api/admin/orders`, config)
      .then((res) => {
        this.setState({ orders: res.data, loading: false });
        toast.success('Lấy danh sách đơn hàng thành công!');
      })
      .catch((error) => {
        toast.error('Lỗi lấy đơn hàng: ' + error.message);
        this.setState({ loading: false });
      });
  }

  apiPutOrderStatus(id, status) {
    this.setState({ loading: true });
    const body = { status };
    const config = { headers: { 'x-access-token': this.context.token } };
    const API = process.env.REACT_APP_API_BASE_URL || '';
    axios
      .put(`${API}/api/admin/orders/status/${id}`, body, config)
      .then((res) => {
        if (res.data) {
          toast.success(`Đã ${status === 'APPROVED' ? 'duyệt' : 'hủy'} đơn hàng!`);
          this.setState((prevState) => {
            const updatedOrders = prevState.orders.map((order) =>
              order._id === id ? { ...order, status } : order
            );
            return {
              orders: updatedOrders,
              order: prevState.order && prevState.order._id === id
                ? { ...prevState.order, status }
                : prevState.order,
              loading: false,
            };
          });
        } else {
          toast.error('Cập nhật thất bại, thử lại sau!');
        }
      })
      .catch((error) => {
        toast.error('Lỗi cập nhật trạng thái: ' + error.message);
        this.setState({ loading: false });
      });
  }

  render() {
    const {
      orders,
      order,
      loading,
      currentPage,
      ordersPerPage,
      searchQuery,
      sortField,
      sortOrder,
      filterStatus,
    } = this.state;

    let filteredOrders = orders.filter((item) => {
      const matchesSearch =
        item.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customer.phone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    filteredOrders.sort((a, b) => {
      if (sortField === 'cdate') {
        return sortOrder === 'asc'
          ? new Date(a.cdate) - new Date(b.cdate)
          : new Date(b.cdate) - new Date(a.cdate);
      } else if (sortField === 'total') {
        return sortOrder === 'asc' ? a.total - b.total : b.total - a.total;
      }
      return 0;
    });

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    return (
      <div className="order-container">
        {/* Breadcrumb */}
        <div className="product-header">
          <div className="breadcrumb-container">
            <div className="breadcrumb">
              <Link to="/admin/home"><span>Trang chủ</span></Link> /{' '}
              <Link to="/admin/order"><span>Đơn hàng</span></Link>{' '}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="order-controls">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc số điện thoại..."
            value={searchQuery}
            onChange={this.handleSearch}
            className="search-input"
          />
          <select value={filterStatus} onChange={this.handleFilterStatus} className="filter-select">
            <option value="ALL">Tất cả</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="CANCELED">CANCELED</option>
          </select>
        </div>

        {/* Order List */}
        <div className="order-list">
          <h2 className="order-title">DANH SÁCH ĐƠN HÀNG</h2>
          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="no-data">Không có đơn hàng nào.</div>
          ) : (
            <>
              <table className="order-table">
                <thead>
                  <tr className="datatable-header">
                    <th>ID</th>
                    <th onClick={() => this.handleSort('cdate')}>
                      Ngày tạo {sortField === 'cdate' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Khách hàng</th>
                    <th>Điện thoại</th>
                    <th onClick={() => this.handleSort('total')}>
                      Tổng tiền {sortField === 'total' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((item) => (
                    <tr
                      key={item._id}
                      className={`datatable-row ${order?._id === item._id ? 'selected' : ''}`}
                      onClick={() => this.trItemClick(item)}
                    >
                      <td>{item._id}</td>
                      <td>{new Date(item.cdate).toLocaleString()}</td>
                      <td>{item.customer.name}</td>
                      <td>{item.customer.phone}</td>
                      <td>{item.total.toLocaleString()}</td>
                      <td>{item.status}</td>
                      <td>
                        {item.status === 'PENDING' && (
                          <div className="action-links">
                            <span className="link approve" onClick={() => this.lnkApproveClick(item._id)}>APPROVE</span>
                            <span className="link cancel" onClick={() => this.lnkCancelClick(item._id)}>CANCEL</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => this.handlePageChange(index + 1)}
                    className={currentPage === index + 1 ? 'active' : ''}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Order Detail */}
        {order && (
          <div className="order-detail">
            <h2 className="order-detail-title">CHI TIẾT ĐƠN HÀNG</h2>
            <table className="order-table">
              <thead>
                <tr className="datatable-header">
                  <th>STT</th>
                  <th>ID sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Hình ảnh</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={item.product._id} className="datatable-row">
                    <td>{index + 1}</td>
                    <td>{item.product._id}</td>
                    <td>{item.product.name}</td>
                    <td>
                      <img
                        src={`data:image/jpg;base64,${item.product.image}`}
                        width="70"
                        height="70"
                        alt={item.product.name}
                        className="product-image"
                      />
                    </td>
                    <td>{item.product.price.toLocaleString()}</td>
                    <td>{item.quantity}</td>
                    <td>{(item.product.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </div>
    );
  }
}

export default Order;
