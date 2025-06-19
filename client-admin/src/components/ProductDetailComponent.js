import React, { Component, createRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/product-detail.css';
import withRouter from '../utils/withRouter';

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: 0,
      cmbCategory: '',
      imgProduct: '',
      txtUnit: '',
      txtPacking: '',
      txtDetail: '',
      successMessage: '',
      errorMessage: '',
    };
    this.editorRef = createRef();
  }

  componentDidMount() {
    if (this.props.mode === 'edit') {
      this.loadProduct();
    }
    this.apiGetCategories();
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item && this.props.item) {
      console.log('Props item:', this.props.item); // Debug
      const category = this.props.item.category;
      const categoryId = category && typeof category === 'object' ? category._id : (category || '');
      
      this.setState({
        txtID: this.props.item._id || '',
        txtName: this.props.item.name || '',
        txtPrice: this.props.item.price || 0,
        cmbCategory: categoryId,
        txtUnit: this.props.item.unit || '',
        txtPacking: this.props.item.packing || '',
        txtDetail: this.props.item.detail || '',
        imgProduct: this.props.item.image ? 'data:image/jpg;base64,' + this.props.item.image : '',
      });
    }
    if (this.props.mode === 'add' && prevProps.mode !== 'add') {
      this.setState({
        successMessage: 'Thêm sản phẩm thành công!',
        errorMessage: '',
        txtID: '',
        txtName: '',
        txtPrice: 0,
        cmbCategory: '',
        imgProduct: '',
        txtUnit: '',
        txtPacking: '',
        txtDetail: '',
      });
    }
  }

  loadProduct = async () => {
    const { id } = this.props.params;
    console.log('Loading product ID:', id); // Debug
    try {
      const API = process.env.REACT_APP_API_BASE_URL || '';
      const response = await axios.get(`${API}/api/admin/products/${id}`);
      const product = response.data;
      console.log('Product data:', product); // Debug
      this.setState({
        txtID: product._id || '',
        txtName: product.name || '',
        txtPrice: product.price || 0,
        cmbCategory: typeof product.category === 'string' ? product.category : product.category?._id || '',
        txtUnit: product.unit || '',
        txtPacking: product.packing || '',
        txtDetail: product.detail || '',
        imgProduct: product.image ? 'data:image/jpg;base64,' + product.image : '',
      });
    } catch (error) {
      console.error('Lỗi tải sản phẩm:', error.response || error);
      this.setState({ errorMessage: 'Không thể tải thông tin sản phẩm' });
    }
  };

  btnAddClick = (e) => {
    e.preventDefault();
    const { txtName, txtPrice, cmbCategory, imgProduct, txtUnit, txtPacking, txtDetail } = this.state;
    const image = imgProduct?.split(',')[1] || '';

    if (!txtName || !txtPrice || !cmbCategory || !image) {
      this.setState({ errorMessage: 'Vui lòng nhập đầy đủ Tên, Giá, Danh mục và Ảnh.', successMessage: '' });
      return;
    }
    if (typeof cmbCategory !== 'string' || !/^[0-9a-fA-F]{24}$/.test(cmbCategory)) {
      console.error('Category ID không hợp lệ:', cmbCategory);
      this.setState({ errorMessage: 'Danh mục không hợp lệ.', successMessage: '' });
      return;
    }

    const newProduct = {
      name: txtName,
      price: parseInt(txtPrice),
      category: cmbCategory,
      image,
      unit: txtUnit,
      packing: txtPacking,
      detail: txtDetail,
    };

    this.apiPostProduct(newProduct);
  };

  btnUpdateClick = (e) => {
    e.preventDefault();
    const { txtID, txtName, txtPrice, cmbCategory, imgProduct, txtUnit, txtPacking, txtDetail } = this.state;
    console.log('txtID:', txtID, 'Type:', typeof txtID, 'Value:', txtID || 'empty'); // Debug
    console.log('cmbCategory:', cmbCategory, 'Type:', typeof cmbCategory); // Debug
    const image = imgProduct?.split(',')[1] || '';

    if (!txtID || txtID === '' || typeof txtID === 'undefined') {
      console.error('ID sản phẩm không hợp lệ:', txtID);
      this.setState({ errorMessage: 'ID sản phẩm không hợp lệ.', successMessage: '' });
      return;
    }
    if (!txtName || !txtPrice || !cmbCategory || !image) {
      this.setState({ errorMessage: 'Vui lòng nhập đầy đủ Tên, Giá, Danh mục và Ảnh.', successMessage: '' });
      return;
    }
    if (typeof cmbCategory !== 'string' || !/^[0-9a-fA-F]{24}$/.test(cmbCategory)) {
      console.error('Category ID không hợp lệ:', cmbCategory);
      this.setState({ errorMessage: 'Danh mục không hợp lệ.', successMessage: '' });
      return;
    }

    const updatedProduct = {
      name: txtName,
      price: parseInt(txtPrice),
      category: cmbCategory,
      image,
      unit: txtUnit,
      packing: txtPacking,
      detail: txtDetail,
    };

    this.apiPutProduct(txtID, updatedProduct);
  };

  apiGetCategories() {
    const API = process.env.REACT_APP_API_BASE_URL || '';
    axios
      .get(`${API}/api/admin/categories`)
      .then((res) => {
        this.setState({ categories: res.data });
      })
      .catch((error) => {
        console.error('Lỗi khi lấy danh sách danh mục:', error);
      });
  }

  previewImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({ imgProduct: evt.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { txtName, txtPrice, cmbCategory, imgProduct } = this.state;
    const image = imgProduct?.split(',')[1] || '';

    if (!txtName || !txtPrice || !cmbCategory || !image) {
      this.setState({ errorMessage: 'Vui lòng nhập đầy đủ Tên, Giá, Danh mục và Ảnh.', successMessage: '' });
      return;
    }
    if (typeof cmbCategory !== 'string' || !/^[0-9a-fA-F]{24}$/.test(cmbCategory)) {
      console.error('Category ID không hợp lệ:', cmbCategory);
      this.setState({ errorMessage: 'Danh mục không hợp lệ.', successMessage: '' });
      return;
    }

    const product = {
      name: txtName,
      price: parseInt(txtPrice),
      category: cmbCategory,
      image,
      unit: this.state.txtUnit,
      packing: this.state.txtPacking,
      detail: this.state.txtDetail,
    };

    if (this.props.mode === 'edit') {
      this.apiPutProduct(this.state.txtID, product);
    } else {
      this.apiPostProduct(product);
    }
  };

  apiPostProduct(prod) {
    const API = process.env.REACT_APP_API_BASE_URL || '';
    axios
      .post(`${API}/api/admin/products`, prod)
      .then((res) => {
        this.setState({
          successMessage: 'Thêm sản phẩm thành công!',
          errorMessage: '',
          txtID: '',
          txtName: '',
          txtPrice: 0,
          cmbCategory: '',
          imgProduct: '',
          txtUnit: '',
          txtPacking: '',
          txtDetail: '',
        });
        setTimeout(() => this.setState({ successMessage: '' }), 2000);
      })
      .catch((error) => {
        console.error('Lỗi thêm sản phẩm:', error.response || error);
        this.setState({ errorMessage: 'Có lỗi xảy ra khi thêm sản phẩm.', successMessage: '' });
      });
  }

  apiPutProduct(id, prod) {
    const API = process.env.REACT_APP_API_BASE_URL || '';
    console.log('apiPutProduct - ID:', id, 'Product:', prod); // Debug
    axios
      .put(`${API}/api/admin/products/${id}`, prod)
      .then((res) => {
        this.setState({ successMessage: 'Cập nhật thành công!', errorMessage: '' });
        setTimeout(() => this.setState({ successMessage: '' }), 2000);
      })
      .catch((error) => {
        console.error('Lỗi cập nhật:', error.response || error);
        this.setState({ errorMessage: 'Có lỗi xảy ra khi cập nhật sản phẩm.', successMessage: '' });
      });
  }

  render() {
    const cates = this.state.categories.map((cate) => (
      <option key={cate._id} value={cate._id}>
        {cate.name}
      </option>
    ));

    const { mode } = this.props;
    const isAddMode = mode === 'add';

    return (
      <div className="product-container">
        <div className="product-header">
          <div className="breadcrumb-container">
            <div className="breadcrumb">
              <Link to="/admin/home"><span>Trang chủ</span></Link> /{' '}
              <Link to="/admin/product/add"><span>Thêm sản phẩm</span></Link>
            </div>
            {this.state.successMessage && (
              <div className="alert-success global-msg">{this.state.successMessage}</div>
            )}
          </div>
        </div>

        <div className="product-detail">
          <h2 className="product-detail-title">
            {isAddMode ? 'Thêm sản phẩm' : 'Cập nhật sản phẩm'}
          </h2>

          {this.state.errorMessage && (
            <div className="alert-error global-msg">{this.state.errorMessage}</div>
          )}

          <form className="product-detail-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>ID</label>
              <input
                type="text"
                value={this.state.txtID}
                readOnly={true}
                className="form-input readonly"
                placeholder="ID"
              />
            </div>
            <div className="form-group">
              <label>Tên</label>
              <input
                type="text"
                value={this.state.txtName}
                onChange={(e) => this.setState({ txtName: e.target.value })}
                className="form-input"
                placeholder="NAME"
              />
            </div>
            <div className="form-group">
              <label>Giá</label>
              <input
                type="number"
                value={this.state.txtPrice}
                onChange={(e) => this.setState({ txtPrice: e.target.value })}
                className="form-input"
                placeholder="PRICE"
              />
            </div>
            <div className="form-group">
              <label>Danh mục</label>
              <select
                value={this.state.cmbCategory}
                onChange={(e) => this.setState({ cmbCategory: e.target.value })}
                className="form-input"
              >
                <option value="">Chọn Danh mục</option>
                {cates}
              </select>
            </div>
            <div className="form-group">
              <label>Đơn vị</label>
              <input
                type="text"
                value={this.state.txtUnit}
                onChange={(e) => this.setState({ txtUnit: e.target.value })}
                className="form-input"
                placeholder="VD: chai, hộp, gói"
              />
            </div>
            <div className="form-group">
              <label>Đóng gói</label>
              <input
                type="text"
                value={this.state.txtPacking}
                onChange={(e) => this.setState({ txtPacking: e.target.value })}
                className="form-input"
                placeholder="VD: thùng 24 chai"
              />
            </div>
            <div className="form-group">
              <label>Chi tiết</label>

              <div className="editor-tools">
                <button type="button" onClick={() => this.applyFormat('bold')}>B</button>
                <button type="button" onClick={() => this.applyFormat('italic')}>I</button>
                <button type="button" onClick={() => this.applyFormat('underline')}>U</button>
                <button type="button" onClick={() => this.applyFormat('justifyLeft')}>Canh trái</button>
                <button type="button" onClick={() => this.applyFormat('justifyCenter')}>Canh giữa</button>
                <button type="button" onClick={() => this.applyFormat('justifyRight')}>Canh phải</button>
                <button type="button" onClick={() => this.applyFormat('removeFormat')}>Xóa định dạng</button>
              </div>

              <div
                ref={this.editorRef}
                className="content-editor"
                contentEditable
                style={{
                  minHeight: '150px',
                  border: '1px solid #ccc',
                  padding: '10px',
                  borderRadius: '4px',
                }}
                onInput={() => {
                  this.setState({ txtDetail: this.editorRef.current.innerHTML });
                }}
                dangerouslySetInnerHTML={{ __html: this.state.txtDetail }}
              ></div>
            </div>

            <div className="form-group">
              <label>Ảnh</label>
              <input
                type="file"
                name="fileImage"
                accept="image/jpeg, image/png, image/gif"
                onChange={(e) => this.previewImage(e)}
                className="form-input"
              />
            </div>
            {this.state.imgProduct && (
              <div className="image-preview">
                <img
                  src={this.state.imgProduct}
                  width="300px"
                  height="300px"
                  alt="Preview"
                  className="preview-image"
                />
              </div>
            )}
            <div className="form-actions">
              {isAddMode ? (
                <button type="submit" className="btn btn-add" onClick={(e) => this.btnAddClick(e)}>
                  Lưu
                </button>
              ) : (
                <button type="submit" className="btn btn-update" onClick={(e) => this.btnUpdateClick(e)}>
                  UPDATE
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(ProductDetail);