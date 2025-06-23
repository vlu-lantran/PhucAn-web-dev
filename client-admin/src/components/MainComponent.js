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
import News from './NewsComponent';
import NewsDetail from './NewsDetailComponent';
import Brand from './BrandComponent';
import BrandDetail from './BrandDetailComponent';
import Contact from './ContactComponent';
import ContactDetail from './ContactDetailComponent';
import Slider from './SliderComponent';
import SliderDetail from './SliderDetailComponent';

class Main extends Component {
  static contextType = MyContext;

  render() {
    if (this.context.token !== '') {
      return (
        <div className="body-admin">
          <Menu />
          <Routes>
            <Route path="*" element={<Navigate to="/admin/home" />} />
            <Route path="/" element={<Navigate replace to="/admin/home" />} />
            <Route path="/admin/home" element={<Home />} />
            <Route path="/admin/category" element={<Category />} />
            <Route path="/admin/category/add" element={<CategoryDetail mode="add" />} />
            <Route path="/admin/category/edit/:id" element={<CategoryDetail mode="edit" />} />
            <Route path="/admin/product" element={<Product />} />
            <Route path="/admin/product/add" element={<ProductDetail mode="add" />} />
            <Route path="/admin/product/edit/:id" element={<ProductDetail mode="edit" />} />
            <Route path="/admin/order" element={<Order />} />
            <Route path="/admin/customer" element={<Customer />} />
            <Route path="/admin/news" element={<News />} />
            <Route path="/admin/news/add" element={<NewsDetail mode="add" />} />
            <Route path="/admin/news/edit/:id" element={<NewsDetail mode="edit" />} />
            <Route path="/admin/brands" element={<Brand />} />
            <Route path="/admin/brands/add" element={<BrandDetail mode="add" />} />
            <Route path="/admin/brands/edit/:id" element={<BrandDetail mode="edit" />} />
            <Route path="/admin/contacts" element={<Contact />} />
            <Route path="/admin/contacts/add" element={<ContactDetail mode="add" />} />
            <Route path="/admin/contacts/edit/:id" element={<ContactDetail mode="edit" />} />
            <Route path="/admin/sliders" element={<Slider />} />
            <Route path="/admin/sliders/add" element={<SliderDetail mode="add" />} />
            <Route path="/admin/sliders/edit/:id" element={<SliderDetail mode="edit" />} />
          </Routes>
        </div>
      );
    }

    return <div />;
  }
}

export default Main;
