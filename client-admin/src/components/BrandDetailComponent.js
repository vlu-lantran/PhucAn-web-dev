import React, { Component, createRef } from 'react';
import axios from 'axios';
import '../styles/brand-detail.css'; // Thêm style riêng cho BrandDetailComponent
import withRouter from '../utils/withRouter';

class BrandDetailComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      content: '',
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
      this.loadBrand();
    }
  }

  loadBrand = async () => {
    const { id } = this.props.params;
    try {
      const response = await axios.get(`/api/admin/brands/${id}`);
      const brand = response.data;
      this.setState({
        name: brand.name,
        content: brand.content,
        image: brand.image,
        created_at: brand.created_at,
        updated_at: brand.updated_at,
      }, () => {
        if (this.editorRef.current) {
          this.editorRef.current.innerHTML = brand.content;
        }
      });
    } catch (error) {
      this.setState({ error: 'Không thể tải thông tin thương hiệu' });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, content } = this.state;

    if (!name || !content) {
      this.setState({ error: 'Vui lòng điền đầy đủ các trường thông tin.' });
      return;
    }

    const brandData = {
      name,
      content,
      image: this.state.image,
      created_at: this.state.created_at || Date.now(),
      updated_at: Date.now(),
    };

    try {
      if (this.props.mode === 'edit') {
        const { id } = this.props.params;
        await axios.put(`/api/admin/brands/${id}`, brandData);
      } else {
        await axios.post('/api/admin/brands', brandData);
      }

      this.setState({ success: true, error: null });
      this.props.navigate('/admin/brands');
    } catch (error) {
      this.setState({ error: 'Đã xảy ra lỗi khi lưu thương hiệu.' });
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
    const { name, content, image, error, success } = this.state;

    return (
      <div className="brand-detail-container">
        <h2 className="brand-detail-title">
          {this.props.mode === 'edit' ? 'Chỉnh sửa Thương Hiệu' : 'Thêm Thương Hiệu'}
        </h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Thương hiệu đã được lưu thành công!</div>}

        <form onSubmit={this.handleSubmit} className="brand-form">
          <div className="form-group">
            <label htmlFor="name">Tên thương hiệu</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={this.handleChange}
              placeholder="Nhập tên thương hiệu"
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label>Ảnh thương hiệu</label>
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
                  alt="Xem trước ảnh thương hiệu"
                  style={{ maxWidth: '100%', borderRadius: '6px', marginTop: '5px' }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Mô tả thương hiệu</label>
            <div
                ref={this.editorRef}
                className="content-editor"
                contentEditable
                style={{
                minHeight: '200px',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '4px',
                }}
                onInput={() => {
                this.setState({ content: this.editorRef.current.innerHTML });
                }}
            ></div>
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

export default withRouter(BrandDetailComponent);
