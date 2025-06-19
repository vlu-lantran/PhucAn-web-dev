import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import '../App'; // Import CSS tùy chỉnh

import Menu from './MenuComponent';
import Home from './HomeComponent';
import Product from './ProductComponent';
import ProductDetail from './ProductDetailComponent';
import CategoryComponent from './CategoryComponent';
import NewsComponent from './NewsComponent';
import NewsDetailComponent from './NewsDetailComponent';
import AboutUsComponent from './AboutUsComponent';
import Mycart from './MycartComponent';

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
            <Route path="/category" element={<CategoryComponent />} />
            <Route path="/news" element={<NewsComponent />} />
            <Route path="/mycart" element={<Mycart />} />
            <Route path="/news/:id" element={<NewsDetailComponent />} />
            <Route path="/about-us" element={<AboutUsComponent />} />
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
                  Thank you for trusting and accompanying our company. We always strive to provide you with the best products and services.
                </p>
                <div className="d-flex gap-3 mt-3">
                  <a href="/#" target="_blank" rel="noopener noreferrer" className="text-white fs-4" style={{ marginRight: 20, }}>
                    <i className="fab fa-facebook fa-2x" ></i>
                  </a>
                  <a href="/#" target="_blank" rel="noopener noreferrer" className="text-white fs-4" style={{ marginRight: 20, }}>
                    <i className="fab fa-instagram fa-2x"></i>
                  </a>
                  <a href="/#" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                    <i className="fab fa-linkedin fa-2x"></i>
                  </a>
                </div>
              </div>

              {/* Cột phải */}
              <div className="ccol-md-4 d-flex flex-column"  style={{ marginTop: '20px', marginRight: 20,}}>
                <p className="mb-2">
                  <i className="fas fa-phone-alt me-2" style={{ marginRight: 20, }}></i> 0918 075 887
                </p>
                <p>
                  <i className="fas fa-envelope me-2" style={{ marginRight: 20, }}></i> info@phucanltd.com  
                </p>
                <p>
                  <i className="fas fa-map me-2" style={{ marginRight: 20, }}></i> 597/60/44 Quang Trung street, Go Vap District, HCM City  
                </p>
              </div>
            </div>

            {/* Dòng cuối */}
            <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-4">
              <p className="mb-0">&copy; Copyright by PhucAnCompany</p>
              <p className="mb-0">All rights reserved.</p>
            </div>
          </div>
        </footer>

      </div>
    );
  }
}

export default Main;