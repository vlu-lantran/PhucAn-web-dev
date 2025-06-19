import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/contact.css'; // Thêm style riêng nếu cần

class ContactComponent extends Component {
  state = {
    contactList: [],
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchContacts();
  }

  fetchContacts = async () => {
    try {
      const API = process.env.REACT_APP_API_BASE_URL || '';
      const response = await axios.get(`${API}/api/admin/contacts`);
      this.setState({
        contactList: response.data,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: 'Không thể tải danh sách liên hệ.',
        loading: false,
      });
    }
  };

  handleDelete = async (id) => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa liên hệ này?');
    if (confirmDelete) {
      try {
        await axios.delete(`/api/admin/contacts/${id}`);
        this.fetchContacts();
      } catch (error) {
        alert('Xóa thất bại.');
      }
    }
  };

  render() {
    const { contactList, loading, error } = this.state;

    if (loading) {
      return <div className="loading">Đang tải danh sách liên hệ...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    return (
      <div className="contact-container">
        <div className="contact-header">
          <div className="breadcrumb">
            <span><i className="fas fa-image"></i> Hình ảnh liên hệ</span>
          </div>
          <Link to="/admin/contacts/add" className="btn-link-wrapper">
            <button className="btn-add-contact">Thêm liên hệ</button>
          </Link>
        </div>

        <div className="contact-list">
          <h2 className="contact-title">Danh sách Cộng Tác</h2>
          <table className="contact-table">
            <thead className="datatable-header">
              <tr>
                <th>Tên</th>
                <th>Hình ảnh</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {contactList.map((contact) => (
                <tr key={contact._id} className="datatable-row">
                  <td>{contact.name}</td>
                  <td>
                    {contact.image ? (
                      <img
                        src={contact.image}
                        alt="contact"
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                    ) : (
                      <span>Không có ảnh</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex' }}>
                      <Link to={`/admin/contacts/edit/${contact._id}`}>
                        <button className="btn-edit tooltip" data-tooltip="Chỉnh sửa">
                          <i className="fas fa-edit"></i>
                        </button>
                      </Link>
                      <button
                        className="btn-delete tooltip"
                        data-tooltip="Xóa"
                        onClick={() => this.handleDelete(contact._id)}
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

export default ContactComponent;
