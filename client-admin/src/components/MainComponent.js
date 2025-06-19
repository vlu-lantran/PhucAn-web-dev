import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

import Menu from './MenuComponent';
import Home from './HomeComponent';
import Category from './CategoryComponent';
import Product from './ProductComponent';
import Order from './OrderComponent';
import Customer from './CustomerComponent';
import CategoryDetail from './CategoryDetailComponent'; 
import ProductDetail from './ProductDetailComponent';
import News from './NewsComponent'; // Import News Component
import NewsDetail from './NewsDetailComponent'; // Import News Detail Component
import Brand from './BrandComponent'; // Import Brand Component
import BrandDetail from './BrandDetailComponent'; // Import Brand Detail Component
import Contact from './ContactComponent'; // Import Contact Component
import ContactDetail  from './ContactDetailComponent';
import Slider from './SliderComponent'; // Import Slider Component
import SliderDetail from './SliderDetailComponent'; // Import Slider Detail Component

class Main extends Component {
  static contextType = MyContext;

  render() {
    if (this.context.token !== '') {
      return (
        <div className="body-admin">
          <Menu />
          <Routes>
            <Route path="/" element={<Navigate replace to="/admin/home" />} />
            <Route path="/admin/home" element={<Home />} />
            <Route path="/admin/category" element={<Category />} />
            <Route path="/admin/category/edit/:id" element={<CategoryDetail mode="edit" />} /> {/* Sửa tin tức */}
            <Route
              path="/admin/category/add"
              element={<CategoryDetail mode="add" />} // Chế độ "Add"
            />
            <Route path="/admin/product" element={<Product />} />
            <Route
              path="/admin/product/add"
              element={<ProductDetail mode="add" />} // Chế độ "Add"
            />
            <Route path="/admin/product/edit/:id" element={<ProductDetail mode="edit" />} /> {/* Sửa tin tức */}
            <Route path="/admin/order" element={<Order />} />
            <Route path="/admin/customer" element={<Customer />} />
            
            {/* Thêm các route cho tin tức */}
            <Route path="/admin/news" element={<News />} /> {/* Danh sách tin tức */}
            <Route path="/admin/news/add" element={<NewsDetail mode="add" />} /> {/* Thêm tin tức */}
            <Route path="/admin/news/edit/:id" element={<NewsDetail mode="edit" />} /> {/* Sửa tin tức */}
            

            {/* Thêm các route cho thương hiệu */}
            <Route path="/admin/brands" element={<Brand />} /> {/* Danh sách thương hiệu */}
            <Route path="/admin/brands/add" element={<BrandDetail mode="add" />} /> {/* Thêm thương hiệu */}
            <Route path="/admin/brands/edit/:id" element={<BrandDetail mode="edit" />} /> {/* Sửa thương hiệu */}

            {/* Thêm các route cho Cộng tác */}
            <Route path="/admin/contacts" element={<Contact />} /> {/* Danh sách thương hiệu */}
            <Route path="/admin/contacts/add" element={<ContactDetail mode="add" />} /> {/* Thêm thương hiệu */}
            <Route path="/admin/contacts/edit/:id" element={<ContactDetail mode="edit" />} /> {/* Sửa thương hiệu */}

            {/* Thêm các route cho thương hiệu */}
            <Route path="/admin/sliders" element={<Slider />} /> {/* Danh sách thương hiệu */}
            <Route path="/admin/sliders/add" element={<SliderDetail mode="add" />} /> {/* Thêm thương hiệu */}
            <Route path="/admin/sliders/edit/:id" element={<SliderDetail mode="edit" />} /> {/* Sửa thương hiệu */}
          </Routes>
        </div>
      );
    }
    return <div />;
  }
}

export default Main;
