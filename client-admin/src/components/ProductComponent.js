import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MyContext from '../contexts/MyContext';
import '../styles/product.css';

class Product extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      itemSelected: null,
      showEditForm: false,
      editProduct: {
        _id: '',
        name: '',
        price: 0,
        category: '',
        image: '',
      },
      successMessage: '',
      confirmDeleteId: null,
      showConfirmDeleteModal: false,
      noPages: 0,
      curPage: 1,
      categoriesLoaded: false,
      categoriesError: '',
    };
  }

  componentDidMount() {
    if (!this.context.token) {
      console.warn("Token chưa có sẵn, không thể gọi API.");
      return;
    }
    this.apiGetProducts(this.state.curPage);
    if (Array.isArray(this.context.categories) && this.context.categories.length > 0) {
      this.setState({ categoriesLoaded: true });
    } else {
      this.apiGetCategories();
    }
  }

  trItemClick = (item) => {
    this.setState({ itemSelected: item });
  };

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/categories`, config)
      .then((res) => {
        if (Array.isArray(res.data)) {
          this.context.setCategories(res.data);
          this.setState({ categoriesLoaded: true, categoriesError: '' });
        } else {
          this.setState({ categoriesLoaded: true, categoriesError: 'No categories found.' });
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        this.setState({
          categoriesLoaded: true,
          categoriesError: 'Failed to load categories. Please try again later.',
        });
      });
  }

  handleDelete = (id) => {
    if (!id) {
      alert("Product ID không hợp lệ.");
      return;
    }

    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
    if (!confirmDelete) return;

    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/api/admin/products/${id}`, config)
      .then((res) => {
        if (res.status === 200) {
          this.apiGetProducts(this.state.curPage);
          alert("Xóa sản phẩm thành công!");
        } else {
          alert("Xóa sản phẩm thất bại.");
        }
      })
      .catch((error) => {
        console.error("Xóa thất bại:", error);
        alert("Có thể sản phẩm đã bị xóa trước đó. Vui lòng refresh lại.");
      });
  };

  confirmDelete = () => {
    const { confirmDeleteId } = this.state;
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/api/admin/products/${confirmDeleteId}`, config)
      .then((res) => {
        this.apiGetProducts(this.state.curPage);
        this.setState({
          successMessage: 'Product deleted successfully!',
          showConfirmDeleteModal: false,
          confirmDeleteId: null,
        });
        setTimeout(() => {
          this.setState({ successMessage: '' });
        }, 2000);
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
      });
  };

  cancelDelete = () => {
    this.setState({ showConfirmDeleteModal: false, confirmDeleteId: null });
  };

  lnkPageClick = (page) => {
    if (page !== this.state.curPage) {
      this.apiGetProducts(page);
    }
  };

  apiGetProducts(page) {
    if (!this.context.token) {
      console.warn("Không có token để gọi API.");
      return;
    }
    if (!page || page <= 0) {
      console.error("Giá trị page không hợp lệ:", page);
      return;
    }

    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/products?page=${page}`, config)
      .then((res) => {
        const result = res.data;
        const pageSize = result.pageSize || 10;
        const totalItems = result.totalItems || 0;
        const noPages = Math.ceil(totalItems / pageSize);
        this.setState({
          products: result.products || [],
          curPage: result.page || 1,
          noPages: noPages,
        });
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }

  render() {
    const prods = this.state.products.map((item) => (
      <tr
        key={item._id}
        className={`datatable-row ${this.state.itemSelected?._id === item._id ? 'selected' : ''}`}
        onClick={() => this.trItemClick(item)}
      >
        <td>{item._id}</td>
        <td>{item.name}</td>
        <td>{item.price.toLocaleString()}</td>
        <td>{new Date(item.cdate).toLocaleString()}</td>
        <td>{item.category?.name}</td>
        <td>
          {item.image && (
            <img
              src={`data:image/jpg;base64,${item.image}`}
              width="100px"
              height="100px"
              alt={item.name}
              className="product-image"
            />
          )}
        </td>
        <td>
          <Link to={`/admin/product/edit/${item._id}`}>
            <button className="btn-edit">
              <i className="fas fa-edit"></i>
            </button>
          </Link>
          <button className="btn-delete" onClick={() => this.handleDelete(item._id)}>
            <i className="fas fa-trash-alt"></i>
          </button>
        </td>
      </tr>
    ));

    const pagination = Array.from({ length: this.state.noPages }, (_, index) => {
      const page = index + 1;
      return (
        <span
          key={index}
          className={`pagination-item ${page === this.state.curPage ? 'active' : 'link'}`}
          onClick={() => this.lnkPageClick(page)}
        >
          {page}
        </span>
      );
    });

    return (
      <div className="product-container">
        <div className="product-header">
          {this.state.successMessage && (
            <div className="alert-success global-msg">{this.state.successMessage}</div>
          )}
          <div className="breadcrumb">
            <span>Sản phẩm</span>
          </div>
          <Link to="/admin/product/add" className="btn-link-wrapper">
            <button className="btn-add-product">Thêm sản phẩm</button>
          </Link>
        </div>

        <div className="product-list float-left">
          <h2 className="product-title">Danh sách sản phẩm</h2>
          {this.state.products.length === 0 ? (
            <div className="loading">Đang tải sản phẩm...</div>
          ) : (
            <table className="product-table">
              <thead>
                <tr className="datatable-header">
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Creation Date</th>
                  <th>Category</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{prods}</tbody>
            </table>
          )}
        </div>
        <div className="pagination">{pagination}</div>
        <div className="float-clear" />
      </div>
    );
  }
}

export default Product;
