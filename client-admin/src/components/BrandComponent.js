import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/brand.css'; // Thêm style riêng cho BrandComponent

class BrandComponent extends Component {
  state = {
    brandList: [],
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchBrands();
  }

  fetchBrands = async () => {
    try {
      const response = await axios.get(`/api/admin/brands`);
      this.setState({
        brandList: response.data,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: 'Không thể tải danh sách thương hiệu.',
        loading: false,
      });
    }
  };

  handleDelete = async (id) => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa thương hiệu này?');
    if (confirmDelete) {
      try {
        const API = process.env.REACT_APP_API_BASE_URL || '';
        await axios.delete(`${API}/api/admin/brands/${id}`);
        this.fetchBrands();
      } catch (error) {
        alert('Xóa thất bại.');
      }
    }
  };

  render() {
    const { brandList, loading, error } = this.state;

    if (loading) {
      return <div className="loading">Đang tải danh sách thương hiệu...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    return (
      <div className="brand-container">
        <div className="brand-header">
          <div className="breadcrumb">
            <span><i className="fas fa-cogs"></i> Thương hiệu</span>
          </div>
          <Link to="/admin/brands/add" className="btn-link-wrapper">
            <button className="btn-add-product">Thêm sản phẩm</button>
          </Link>
        </div>

        <div className="brand-list">
          <h2 className="brand-title">Danh sách Thương Hiệu</h2>
          <table className="brand-table">
            <thead className="datatable-header">
              <tr>
                <th>Tên thương hiệu</th>
                <th>Mô tả</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {brandList.map((brand) => (
                <tr key={brand._id} className="datatable-row">
                  <td>{brand.name}</td>
                  <td>{brand.content}</td>
                  <td>{new Date(brand.created_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex' }}>
                      <Link to={`/admin/brands/edit/${brand._id}`}>
                        <button className="btn-edit tooltip" data-tooltip="Chỉnh sửa">
                          <i className="fas fa-edit"></i>
                        </button>
                      </Link>
                      <button
                        className="btn-delete tooltip"
                        data-tooltip="Xóa"
                        onClick={() => this.handleDelete(brand._id)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
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

export default BrandComponent;
