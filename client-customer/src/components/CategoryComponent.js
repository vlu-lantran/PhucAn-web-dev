import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/Category.css';

const CategoryComponent = () => {
  const [categories, setCategories] = useState([]);
  const [visibleIndexes, setVisibleIndexes] = useState([]);
  const [loading, setLoading] = useState(true); // state loading

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/customer/categories');
      setCategories(res.data);

      res.data.forEach((_, index) => {
        setTimeout(() => {
          setVisibleIndexes((prev) => [...prev, index]);
        }, index * 150);
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false); // tắt loading dù thành công hay lỗi
    }
  };

  if (loading) {
    return (
      <div className="category-section">
        <div className="container">
          <h2 className="section-title text-center">Category</h2>
          <p className="text-center" style={{ color: "black" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-section">
      <div className="container">
        <h2 className="section-title text-center">Category</h2>
        <div className="brand-grid">
          {categories.map((cat, index) => (
            <div
              className={`brand-card ${visibleIndexes.includes(index) ? 'visible' : ''}`}
              key={cat._id}
            >
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
