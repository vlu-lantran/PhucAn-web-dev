import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import '../App'; // Import CSS tùy chỉnh

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }

  render() {
    const prods = this.state.products.map((item) => (
      <div key={item._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div className="product-card">
          <Link to={'/product/' + item._id}>
            <img
              src={'data:image/jpg;base64,' + item.image}
              alt={item.name}
              className="product-image"
            />
          </Link>
          <div className="product-info text-center">
            <h5 className="product-name">{item.name}</h5>
            <p className="product-price">{item.category.name}</p>
          </div>
        </div>
      </div>
    ));

    return (
      <div className="product-container">
        <div className="container">
          <h2 className="text-center my-4">Product List</h2>
          {this.state.products.length > 0 ? (
            <div className="row">{prods}</div>
          ) : (
            <div className="text-center my-5">
              <h4>No more product</h4>
              <Link to="/home" className="btn btn-primary mt-3">
                Return to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  componentDidMount() {
    const params = this.props.params;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  componentDidUpdate(prevProps) {
    const params = this.props.params;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  // apis
  apiGetProductsByCatID(cid) {
    axios.get('/api/customer/products/category/' + cid).then((res) => {
      const result = res.data;
      this.setState({ products: result });
    });
  }

  apiGetProductsByKeyword(keyword) {
    axios.get('/api/customer/products/search/' + keyword).then((res) => {
      const result = res.data;
      this.setState({ products: result });
    });
  }
}

export default withRouter(Product);