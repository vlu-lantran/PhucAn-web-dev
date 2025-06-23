import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/brand.css'; // Thêm style riêng cho BrandComponent

class SliderComponent extends Component {
  state = {
    sliderList: [],
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchSliders();
  }

  fetchSliders = async () => {
    try {

      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/sliders`);
      this.setState({
        sliderList: response.data,
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
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/admin/sliders/${id}`);
        this.fetchSliders();
      } catch (error) {
        alert('Xóa thất bại.');
      }
    }
  };

  render() {
    const { sliderList, loading, error } = this.state;

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
            <span><i className="fas fa-cogs"></i> Slider</span>
          </div>
          <Link to="/admin/sliders/add" className="btn-link-wrapper">
            <button className="btn-add-product">Thêm Slider</button>
          </Link>
        </div>

        <div className="brand-list">
          <h2 className="brand-title">Danh sách Slider</h2>
          <table className="brand-table">
            <thead className="datatable-header">
              <tr>
                <th>Tên Slider</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sliderList.map((slider) => (
                <tr key={slider._id} className="datatable-row">
                  <td>{slider.name}</td>
                  <td>{new Date(slider.created_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex' }}>
                      <Link to={`/admin/sliders/edit/${slider._id}`}>
                        <button className="btn-edit tooltip" data-tooltip="Chỉnh sửa">
                          <i className="fas fa-edit"></i>
                        </button>
                      </Link>
                      <button
                        className="btn-delete tooltip"
                        data-tooltip="Xóa"
                        onClick={() => this.handleDelete(slider._id)}
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

export default SliderComponent;
