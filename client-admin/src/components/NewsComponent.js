import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/news.css';

class News extends Component {
  state = {
    newsList: [],
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchNews();
  }

  fetchNews = async () => {
    try {
      const response = await axios.get('/api/admin/news');
      this.setState({
        newsList: response.data,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: 'Không thể tải tin tức.',
        loading: false,
      });
    }
  };

  handleDelete = async (id) => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa tin tức này?');
    if (confirmDelete) {
      try {
        const API = process.env.REACT_APP_API_BASE_URL || '';
        await axios.delete(`${API}/api/admin/news/${id}`);
        this.fetchNews();
      } catch (error) {
        alert('Xóa thất bại.');
      }
    }
  };

  render() {
    const { newsList, loading, error } = this.state;

    if (loading) {
      return <div className="loading">Đang tải tin tức...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    return (
      <div className="news-container">
        <div className="news-header">
          <div className="breadcrumb">
            <span><i className="fas fa-newspaper"></i> Tin tức</span>
          </div>
        </div>

        <div className="news-list">
          <h2 className="news-title">Danh sách Tin Tức</h2>
          <table className="news-table">
            <thead className="datatable-header">
              <tr>
                <th>Tiêu đề</th>
                <th>Tác giả</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {newsList.map((news) => (
                <tr key={news._id} className="datatable-row">
                  <td>{news.title}</td>
                  <td>{news.author}</td>
                  <td>{new Date(news.created_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex' }}>
                      <Link to={`/admin/news/edit/${news._id}`}>
                        <button className="btn-edit tooltip" data-tooltip="Chỉnh sửa">
                          <i className="fas fa-edit"></i>
                        </button>
                      </Link>
                      <button
                        className="btn-delete tooltip"
                        data-tooltip="Xóa"
                        onClick={() => this.handleDelete(news._id)}
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

export default News;
