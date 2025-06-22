import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MyContext from '../contexts/MyContext';
import '../styles/category.css';

class CategoryComponent extends Component {
  static contextType = MyContext;

  state = {
    categories: [],
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchCategories();
  }

  fetchCategories = async () => {
    try {
      const config = { headers: { 'x-access-token': this.context.token } };
      const response = await axios.get(`/api/admin/categories`, config);
      this.setState({ categories: response.data, loading: false });
    } catch (error) {
      this.setState({ error: 'Không thể tải danh mục.', loading: false });
    }
  };

  handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        const config = { headers: { 'x-access-token': this.context.token } };
        await axios.delete(`/api/admin/categories/${id}`, config);
        this.fetchCategories();
      } catch (error) {
        alert('Xóa thất bại.');
      }
    }
  };

  render() {
    const { categories, loading, error } = this.state;

    if (loading) return <div className="loading">Đang tải danh mục...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
      <div className="category-container">
        <div className="category-header">
          <div className="breadcrumb">
            <span><i className="fas fa-tags"></i> Danh mục</span>
          </div>
          <Link to="/admin/category/add">
            <button className="btn-add-category">Thêm danh mục</button>
          </Link>
        </div>

        <div className="category-list">
          <h2>Danh sách danh mục</h2>
          <table className="category-table">
            <thead>
              <tr  className="datatable-header">
                <th>Tên</th>
                <th>Hình ảnh</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cate) => (
                <tr key={cate._id} className='datatable-row'>
                  <td>{cate.name}</td>
                  <td>
                    {cate.image && <img src={cate.image} alt={cate.name} width="80" />}
                  </td>
                  <td>
                    <Link to={`/admin/category/edit/${cate._id}`}>
                      <button className="btn-edit">
                        <i className="fas fa-edit"></i>
                      </button>
                    </Link>
                    <button className="btn-delete" onClick={() => this.handleDelete(cate._id)}>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default CategoryComponent;
