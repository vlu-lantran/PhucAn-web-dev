import React, { Component, createRef } from 'react';
import axios from 'axios';
import '../styles/category-detail.css'; // Thêm style riêng cho CategoryDetailComponent
import withRouter from '../utils/withRouter';

class CategoryDetailComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      image: '',
      created_at: '',
      updated_at: '',
      error: null,
      success: false,
    };
    this.editorRef = createRef();
    this.fileInputRef = createRef();
  }

  handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      this.setState({ image: base64Image });
    };
    reader.readAsDataURL(file);
  };

  componentDidMount() {
    if (this.props.mode === 'edit') {
      this.loadCategory();
    }
  }

  loadCategory = async () => {
    const { id } = this.props.params;
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/categories/${id}`);
      const category = response.data;
      this.setState({
        name: category.name,
        image: category.image,
        created_at: category.created_at,
        updated_at: category.updated_at,
      }, () => {
        if (this.editorRef.current) {
          this.editorRef.current.innerHTML = category.content;
        }
      });
    } catch (error) {
      this.setState({ error: 'Không thể tải thông tin Loại sản phẩm' });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, image } = this.state;

    if (!name || !image) {
      this.setState({ error: 'Vui lòng điền đầy đủ các trường thông tin.' });
      return;
    }

    const categoryData = {
      name,
      image: this.state.image,
      created_at: this.state.created_at || Date.now(),
      updated_at: Date.now(),
    };

    try {
      if (this.props.mode === 'edit') {
        const { id } = this.props.params;
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/admin/categories/${id}`, categoryData);
      } else {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/admin/categories`, categoryData);
      }

      this.setState({ success: true, error: null });
      this.props.navigate('/admin/category');
    } catch (error) {
      this.setState({ error: 'Đã xảy ra lỗi khi lưu loại sản phẩm.' });
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  render() {
    const { name, image, error, success } = this.state;

    return (
      <div className="category-detail">
        <h2 className="category-detail-title">
          {this.props.mode === 'edit' ? 'Chỉnh sửa Loại Sản Phẩm' : 'Thêm Loại Sản Phẩm'}
        </h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Loại sản phẩm đã được lưu thành công!</div>}

        <form onSubmit={this.handleSubmit} className="category-form">
          <div className="form-group">
            <label htmlFor="name">Tên Loại Sản Phẩm</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={this.handleChange}
              placeholder="Nhập tên Loại Sản Phẩm"
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label>Ảnh Loại Sản Phẩm</label>
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
                  alt="Xem trước ảnh Loại Sản Phẩm"
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

export default withRouter(CategoryDetailComponent);
