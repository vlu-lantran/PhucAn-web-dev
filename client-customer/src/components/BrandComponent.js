import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 👈 Thêm dòng này
import '../css/BrandComponent.css';

const BrandComponent = () => {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate(); // 👈 Dùng hook navigate

  useEffect(() => {
    axios.get('/api/customer/brands')
      .then(res => {
        setBrands(res.data);
      })
      .catch(err => {
        console.error('Error fetching brands:', err);
      });
  }, []);

  const handleSeeMoreClick = () => {
    navigate('/about-us'); // 👈 Điều hướng đến /about-us
  };

  return (
    <div className="container">
      <h2 className="section-title text-center mb-4">MORE ABOUT OUR COMPANY</h2>
      <div className="brand-grid">
        {brands.map((brand, index) => (
          <div className="brand-card" key={index}>
            <div className="brand-image-container">
              <img
                src={brand.image}
                alt={brand.name || `Brand ${index}`}
                className="brand-image"
              />
              <div className="brand-footer">
                <button className="see-more-btn" onClick={handleSeeMoreClick}>
                  See More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandComponent;
