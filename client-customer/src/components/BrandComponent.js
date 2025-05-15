import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/BrandComponent.css'; // Chứa CSS riêng cho phần này

const BrandComponent = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    axios.get('/api/customer/brands')
      .then(res => {
        setBrands(res.data);
      })
      .catch(err => {
        console.error('Error fetching brands:', err);
      });
  }, []);

  return (
    
        <div className="container">
        <h2 className="section-title text-center mb-4">MORE ABOUT OUR COMPANY</h2>
        <div className="brand-grid">
            {brands.map((brand, index) => (
            <div className="brand-card" key={index}>
                <div className="brand-image-container">
                <img
                    src={brand.image} // Đường dẫn ảnh từ database
                    alt={brand.name || `Brand ${index}`}
                    className="brand-image"
                />
                <div className="brand-footer">
                    <button className="see-more-btn">See More</button>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
   
  );
};

export default BrandComponent;
