import React, { Component, createRef } from 'react';
import axios from 'axios';
import withRouter from '../utils/withRouter';
import '../styles/contact-detail.css';

class ContactDetailComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      image: '',
      error: null,
      success: false,
    };
    this.fileInputRef = createRef();
  }

  componentDidMount() {
    if (this.props.mode === 'edit') {
      this.loadContact();
    }
  }

  loadContact = async () => {
    const { id } = this.props.params;
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/contacts/${id}`);
      const contact = response.data;
      this.setState({
        name: contact.name,
        image: contact.image,
      });
    } catch (error) {
      this.setState({ error: 'Không thể tải thông tin liên hệ.' });
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState({ image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, image } = this.state;

    if (!name || !image) {
      this.setState({ error: 'Vui lòng điền tên và chọn hình ảnh.' });
      return;
    }

    const contactData = { name, image };

    try {
      if (this.props.mode === 'edit') {
        const { id } = this.props.params;
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/admin/contacts/${id}`, contactData);
      } else {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/admin/contacts`, contactData);
      }

      this.setState({ success: true, error: null });
      this.props.navigate('/admin/contacts');
    } catch (error) {
        console.error('Lỗi chi tiết:', error.response?.data || error.message);
        this.setState({
          error: error.response?.data?.error || 'Đã xảy ra lỗi khi lưu liên hệ.',
        });
    }
  };

  render() {
    const { name, image, error, success } = this.state;

    return (
      <div className="contact-detail-container">
        <h2 className="contact-detail-title">
          {this.props.mode === 'edit' ? 'Chỉnh sửa Liên Hệ' : 'Thêm Liên Hệ'}
        </h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Lưu liên hệ thành công!</div>}

        <form onSubmit={this.handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Tên liên hệ</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={this.handleChange}
              placeholder="Nhập tên liên hệ"
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label>Hình ảnh</label>
            <button
              type="button"
              onClick={() => this.fileInputRef.current.click()}
              className="select-image-btn"
            >
              Chọn ảnh
            </button>
            <input
              type="file"
              accept="image/*"
              ref={this.fileInputRef}
              style={{ display: 'none' }}
              onChange={this.handleImageUpload}
            />
            {image && (
              <div style={{ marginTop: '10px' }}>
                <strong>Xem trước:</strong><br />
                <img
                  src={image}
                  alt="Xem trước ảnh liên hệ"
                  style={{ maxWidth: '100%', borderRadius: '6px', marginTop: '5px' }}
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {this.props.mode === 'edit' ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(ContactDetailComponent);
