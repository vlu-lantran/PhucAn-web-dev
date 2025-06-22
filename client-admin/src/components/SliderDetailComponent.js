import React, { Component, createRef } from 'react';
import axios from 'axios';
import '../styles/brand-detail.css';
import withRouter from '../utils/withRouter';

class SliderDetailComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      link: '',
      image: '',
      created_at: '',
      updated_at: '',
      error: null,
      success: false,
    };
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
      this.loadSlider();
    }
  }

  loadSlider = async () => {
    const { id } = this.props.params;
    try {
      const response = await axios.get(`/api/admin/sliders/${id}`);
      const slider = response.data;
      this.setState({
        name: slider.name,
        link: slider.link || '',
        image: slider.image,
        created_at: slider.created_at,
        updated_at: slider.updated_at,
      });
    } catch (error) {
      this.setState({ error: 'Không thể tải thông tin slider' });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, link } = this.state;

    if (!name) {
      this.setState({ error: 'Vui lòng nhập tên slider.' });
      return;
    }

    const sliderData = {
      name,
      link,
      image: this.state.image,
      created_at: this.state.created_at || Date.now(),
      updated_at: Date.now(),
    };

    try {
      if (this.props.mode === 'edit') {
        const { id } = this.props.params;
        await axios.put(`/api/admin/sliders/${id}`, sliderData);
      } else {
        await axios.post('/api/admin/sliders', sliderData);
      }

      this.setState({ success: true, error: null });
      this.props.navigate('/admin/sliders');
    } catch (error) {
      this.setState({ error: 'Đã xảy ra lỗi khi lưu slider.' });
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { name, link, image, error, success } = this.state;

    return (
      <div className="brand-detail-container">
        <h2 className="brand-detail-title">
          {this.props.mode === 'edit' ? 'Chỉnh sửa Slider' : 'Thêm Slider'}
        </h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Slider đã được lưu thành công!</div>}

        <form onSubmit={this.handleSubmit} className="brand-form">
          <div className="form-group">
            <label htmlFor="name">Tên slider</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={this.handleChange}
              placeholder="Nhập tên slider"
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="link">Liên kết</label>
            <input
              type="text"
              id="link"
              name="link"
              value={link}
              onChange={this.handleChange}
              placeholder="Nhập đường dẫn (ví dụ: https://example.com)"
              maxLength="255"
            />
          </div>

          <div className="form-group">
            <label>Ảnh slider</label>
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
                  alt="Xem trước ảnh slider"
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

export default withRouter(SliderDetailComponent);
