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
        <td>{item.category.name}</td>
        <td>
          <img
            src={"data:image/jpg;base64," + item.image}
            width="100px"
            height="100px"
            alt={item.name}
            className="product-image"
          />
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
          onClick={() => page !== this.state.curPage && this.lnkPageClick(page)}
        >
          {page}
        </span>
      );
    });

    return (
      <div className="product-container">
        <div className="product-header">
          {this.state.successMessage && (
            <div className="alert-success global-msg">
              {this.state.successMessage}
            </div>
          )}
          <div className="breadcrumb">
            <Link to="/admin/home"><span>Trang chủ</span></Link> /{' '}
            <Link to="/admin/product"><span>Sản phẩm</span></Link>
          </div>
          <Link to="/admin/product/add" className="btn-link-wrapper">
            <button className="btn-add-product">Thêm sản phẩm</button>
          </Link>
        </div>

        <div className="product-list float-left">
          <h2 className="product-title">Danh sách sản phẩm</h2>
          {this.state.products.length === 0 ? (
            <div className="loading">Loading products...</div>
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


        {this.state.successMessage && (
        <div className="alert-success global-msg">
          {this.state.successMessage}
        </div>
        )}
        <div className="pagination">{pagination}</div>
        <div className="float-clear" />
      </div>
    );
  }

  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
    // Kiểm tra xem categories đã được tải chưa
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
    axios
      .get('/api/admin/categories')
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          this.context.setCategories(res.data);
          this.setState({ categoriesLoaded: true, categoriesError: '' });
        } else {
          this.setState({
            categoriesLoaded: true,
            categoriesError: 'No categories found.',
          });
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
    console.error("Invalid product ID:", id);
    alert("Product ID is invalid.");
    return;
  }

  // Hỏi xác nhận trước khi xóa
  const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
  if (!confirmDelete) {
    return; // Hủy xóa nếu người dùng chọn Cancel
  }

  axios
    .delete(`/api/admin/products/${id}`)
    .then((res) => {
      if (res.status === 200) {
        // Cập nhật lại danh sách sản phẩm
        this.apiGetProducts(this.state.curPage);
        alert("Xóa sản phẩm thành công!");
      } else {
        alert("Xóa sản phẩm thất bại.");
      }
    })
    .catch((error) => {
      console.error("Delete failed:", error);
      alert("Đã xóa thành công rồi. Hãy reset lại trang để xem lại danh sách sản phẩm.");
    });
};


  confirmDelete = () => {
    const { confirmDeleteId } = this.state;
    axios
      .delete(`/api/admin/products/${confirmDeleteId}`)
      .then((res) => {
        if (res.data) {
          this.apiGetProducts(this.state.curPage);
          this.setState({
            successMessage: 'Product deleted successfully!',
            showConfirmDeleteModal: false,
            confirmDeleteId: null,
          });
          setTimeout(() => {
            this.setState({ successMessage: '' });
          }, 2000);
        }
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
      });
  };

  cancelDelete = () => {
    this.setState({
      showConfirmDeleteModal: false,
      confirmDeleteId: null,
    });
  };

  lnkPageClick(page) {
    this.apiGetProducts(page);
  }

  apiGetProducts(page) {
  // Kiểm tra giá trị page trước khi thực hiện yêu cầu
  if (page === undefined || page <= 0) {
    console.error("Invalid page value:", page);
    return; // Dừng lại nếu page không hợp lệ
  }
  axios
    .get(`/api/admin/products?page=${page}`)
    .then((res) => {
      const result = res.data;
      console.log("API result:", res.data);
      const pageSize = result.pageSize || 10;
      const totalItems = result.totalItems || 0;
      const noPages = Math.ceil(totalItems / pageSize);

      this.setState({
        products: result.products,
        curPage: result.page || 1,
        noPages: noPages,
      });
    })
    .catch((error) => {
      console.error('Error fetching products:', error);
    });
}

}

export default Product;
