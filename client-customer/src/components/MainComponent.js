import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import '../App'; // Import CSS tùy chỉnh

import Menu from './MenuComponent';
import Home from './HomeComponent';
import Product from './ProductComponent';
import ProductDetail from './ProductDetailComponent';
import Myprofile from './MyprofileComponent';
import CategoryComponent from './CategoryComponent';

class Main extends Component {
  render() {
    return (
      <div className="body-customer">
        {/* Header Section */}
        <header className="main-header">
          <Menu />
        </header>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/product/category/:cid" element={<Product />} />
            <Route path="/product/search/:keyword" element={<Product />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/myprofile" element={<Myprofile />} />
            <Route path="/category" element={<CategoryComponent />} />
          </Routes>
        </main>

        {/* Footer Section */}
        <footer className="main-footer bg-dark text-white pt-5">
          <div className="container">
            <div className="row">
              {/* Cột trái */}
              <div className="col-md-6">
                <h4 className="mb-3 font-weight-bold" style={{ color: '#fff' }}>CONTACT US</h4>
                <p>
                  Cảm ơn bạn đã tin tưởng và đồng hành cùng công ty chúng tôi. Chúng tôi luôn nỗ lực mang đến
                  những sản phẩm và dịch vụ tốt nhất dành cho bạn.
                </p>
                <div className="d-flex gap-3 mt-3">
                  <a href="https://facebook.com/congty" target="_blank" rel="noopener noreferrer" className="text-white fs-4" style={{ marginRight: 20, }}>
                    <i className="fab fa-facebook fa-2x" ></i>
                  </a>
                  <a href="https://instagram.com/congty" target="_blank" rel="noopener noreferrer" className="text-white fs-4" style={{ marginRight: 20, }}>
                    <i className="fab fa-instagram fa-2x"></i>
                  </a>
                  <a href="https://linkedin.com/company/congty" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                    <i className="fab fa-linkedin fa-2x"></i>
                  </a>
                </div>
              </div>

              {/* Cột phải */}
              <div className="col-md-6 text-md-end mt-4 mt-md-0" >
                <p className="mb-2">
                  <i className="fas fa-phone-alt me-2" style={{ marginRight: 20, }}></i> 0123 456 789
                </p>
                <p>
                  <i className="fas fa-envelope me-2" style={{ marginRight: 20, }}></i> contact@congty.com
                </p>
              </div>
            </div>

            {/* Dòng cuối */}
            <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-4">
              <p className="mb-0">&copy; Copyright by MinhQuan</p>
              <div className="d-flex gap-3">
                <a href="/return-policy" className="text-white text-decoration-none" style={{ marginRight: 20, }}>Return Policy</a>
                <a href="/privacy-policy" className="text-white text-decoration-none"style={{ marginRight: 20, }}>Privacy Policy</a>
                <a href="/terms-of-service" className="text-white text-decoration-none">Term of Service</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    );
  }
}

export default Main;