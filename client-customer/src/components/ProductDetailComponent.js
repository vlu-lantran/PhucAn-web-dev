import React, { Component } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // React Router v6 hooks
import '../App.css'; // Import CSS tùy chỉnh

// Create a wrapper component to use hooks with class component
const withRouterParams = (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    return <WrappedComponent {...props} params={params} navigate={navigate} />;
  };
};

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
    };
  }

  componentDidMount() {
    const productId = this.props.params.id; // Lấy ID từ props
    this.apiGetProductById(productId);
  }

  // API: Lấy thông tin sản phẩm theo ID
  apiGetProductById(id) {
    axios
      .get(`/api/customer/products/${id}`)
      .then((res) => {
        const result = res.data;
        this.setState({ product: result });
      })
      .catch((error) => {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
        this.setState({ product: null });
      });
  }

  render() {
    const { product } = this.state;

    // Nếu chưa có dữ liệu sản phẩm, hiển thị thông báo
    if (!product) {
      return (
        <div className="product-detail-container text-center my-5">
          <h4>Can't find Product</h4>
          <button
            onClick={() => this.props.navigate('/home')}
            className="btn btn-primary mt-3"
          >
            Return to Home
          </button>
        </div>
      );
    }

    return (
      <div className="product-detail-container my-5">
        <div className="product-detail-row">
          {/* Cột hình ảnh */}
          <div className="product-image-col">
            <div
              className="product-image"
              style={{ backgroundImage: `url(data:image/jpg;base64,${product.image})` }}
            ></div>
          </div>

          {/* Cột thông tin */}
          <div className="product-info-col">
            <h4>Name: {product.name}</h4>
            {/* Sửa ở đây: Truy cập product.category.name thay vì product.category */}
            <p><strong>Category:</strong> {product.category?.name || 'Không có danh mục'}</p>

            {/* Phần Sales Information */}
            <div className="sales-info">
              <h5>Sales Information</h5>
              <p><strong>Price a unit:</strong> {product.price}</p>
              <p><strong>Unit of measure:</strong> {product.unit}</p>
              <p><strong>Packing unit:</strong> {product.packing}</p>
              {/* <p><strong>Minimum quantity:</strong> {product.minimum}</p> */}
            </div>
          </div>
        </div>

        {/* Phần chi tiết sản phẩm */}
        <div className="product-detail-section mt-4">
          <h5>Product Detail:</h5>
          <p>{product.detail || 'Không có chi tiết sản phẩm.'}</p>
        </div>
      </div>
    );
  }
}

export default withRouterParams(ProductDetail);