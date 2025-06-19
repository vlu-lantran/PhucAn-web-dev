import '../imageslider.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const ImageSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // <-- Thêm loading state

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const API = process.env.REACT_APP_API_BASE_URL || '';
        const response = await axios.get(`${API}/api/customer/sliders`);
        console.log('Slides:', response.data);
        setSlides(response.data);
      } catch (error) {
        console.error('Lỗi khi tải sliders:', error);
      } finally {
        setLoading(false); // <-- Tắt loading sau khi lấy xong dữ liệu
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [slides]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const isExternalLink = (url) => {
    return /^https?:\/\//.test(url);
  };

  if (loading) {
    return <p className="text-center" style={{ color: "black" }}>Loading...</p>;
  }

  return (
    <div className="slider-container">
      <div className="slider-frame">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            style={{ display: index === currentIndex ? 'block' : 'none' }}
          >
            {isExternalLink(slide.link) ? (
              <a href={slide.link} target="_blank" rel="noopener noreferrer">
                <img
                  src={slide.src || slide.image}
                  alt={slide.name || `slide-${index}`}
                  className="slide-image"
                />
              </a>
            ) : (
              <Link to={slide.link}>
                <img
                  src={slide.src || slide.image}
                  alt={slide.name || `slide-${index}`}
                  className="slide-image"
                />
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="dots-container">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};
