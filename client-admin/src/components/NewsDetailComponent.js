import React, { Component, createRef } from 'react';
import axios from 'axios';
import '../styles/news-detail.css';
import withRouter from '../utils/withRouter';

class NewsDetailComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      author: '',
      content: '',
      created_at: '',
      image:'',
      error: null,
      success: false,
    };
    this.editorRef = createRef();
    this.fileInputRef = createRef();
    this.bgImageInputRef = createRef();
  }

  handleBackgroundImageUpload = (e) => {
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
      this.loadNews();
    }
  }

  loadNews = async () => {
    const { id } = this.props.params;
    try {
      const response = await axios.get(`/api/admin/news/${id}`);
      const news = response.data;
      this.setState({
        title: news.title,
        author: news.author,
        content: news.content,
        created_at: news.created_at,
        image: news.image,
      }, () => {
        if (this.editorRef.current) {
          this.editorRef.current.innerHTML = news.content;
        }
      });
    } catch (error) {
      this.setState({ error: 'Không thể tải thông tin tin tức' });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { title, author } = this.state;
    const content = this.editorRef.current.innerHTML;

    if (!title || !author || !content) {
      this.setState({ error: 'Vui lòng điền đầy đủ các trường thông tin.' });
      return;
    }

    const newsData = {
      title,
      author,
      content,
      image: this.state.image,
      created_at: Date.now(),
    };

    try {
      if (this.props.mode === 'edit') {
        const { id } = this.props.params;
        await axios.put(`/api/admin/news/${id}`, newsData);
      } else {
        await axios.post('/api/admin/news', newsData);
      }

      this.setState({ success: true, error: null });
      this.props.navigate('/admin/news');
    } catch (error) {
      this.setState({ error: 'Đã xảy ra lỗi khi lưu tin tức.' });
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      this.insertImage(base64Image);
    };
    reader.readAsDataURL(file);
  };

  insertImage = (src) => {
    const img = document.createElement('img');
    img.src = src;
    img.style.maxWidth = '100%';
    const range = window.getSelection().getRangeAt(0);
    range.deleteContents();
    range.insertNode(img);
  };

  render() {
    const { title, author, error, success } = this.state;

    return (
      <div className="news-detail-container">
        <h2 className="news-detail-title">
          {this.props.mode === 'edit' ? 'Chỉnh sửa Tin Tức' : 'Thêm Tin Tức'}
        </h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Tin tức đã được lưu thành công!</div>}

        <form onSubmit={this.handleSubmit} className="news-form">
          <div className="form-group">
            <label htmlFor="title">Tiêu đề</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={this.handleChange}
              placeholder="Nhập tiêu đề"
              maxLength="50"
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Tác giả</label>
            <input
              type="text"
              id="author"
              name="author"
              value={author}
              onChange={this.handleChange}
              placeholder="Nhập tên tác giả"
            />
          </div>
          <div className="form-group">
            <label>Ảnh nền</label>
            <button
              type="button"
              onClick={() => this.bgImageInputRef.current.click()}
              className="select-image-btn"
            >
              Chọn ảnh nền
            </button>
            <input
              type="file"
              accept="image/*"
              ref={this.bgImageInputRef}
              style={{ display: 'none' }}
              onChange={this.handleBackgroundImageUpload}
            />
            {this.state.image && (
              <div style={{ marginTop: '10px' }}>
                <strong>Xem trước:</strong><br />
                <img
                  src={this.state.image}
                  alt="Xem trước ảnh nền"
                  style={{ maxWidth: '100%', borderRadius: '6px', marginTop: '5px' }}
                />
              </div>
            )}
          </div>



          <div className="form-group">
            <label>Nội dung</label>
            <div className="editor-tools">
              <button type="button" onClick={() => this.applyFormat('bold')}>B</button>
              <button type="button" onClick={() => this.applyFormat('italic')}>I</button>
              <button type="button" onClick={() => this.applyFormat('underline')}>U</button>
              <button type="button" onClick={() => this.applyFormat('justifyLeft')}>Canh trái</button>
              <button type="button" onClick={() => this.applyFormat('justifyCenter')}>Canh giữa</button>
              <button type="button" onClick={() => this.applyFormat('justifyRight')}>Canh phải</button>
              <button type="button" onClick={() => this.fileInputRef.current.click()}>Chọn ảnh</button>
              <input
                type="file"
                accept="image/*"
                ref={this.fileInputRef}
                style={{ display: 'none' }}
                onChange={this.handleImageUpload}
              />
            </div>

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

export default withRouter(NewsDetailComponent);
