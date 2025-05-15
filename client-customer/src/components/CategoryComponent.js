import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/BrandComponent.css';

const CategoryComponent = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/customer/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <div className="category-section">
      <div className="container">
        <h2 className="section-title text-center">Category</h2>
        <div className="brand-grid">
          {categories.map((cat) => (
            <div className="brand-card" key={cat._id}>
              <Link to={`/product/category/${cat._id}`} className="brand-link">
                <div className="brand-image-container">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="brand-image"
                  />
                  <div className="brand-footer">
                    <span className="see-more-btn">See More</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryComponent;