import '../imageslider.css';
import React, { useEffect, useState } from 'react';

export const ImageSlider = () => {
  const slides = [
    { src: '/assets/sale.jpg' },
    { src: '/assets/sale2.jpg' },
    { src: '/assets/sale3.jpg' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // chuyển slide mỗi 3 giây

    return () => clearInterval(interval); // cleanup khi unmount
  }, [slides.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="slider-container">
      <div className="slider-frame">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            style={{ display: index === currentIndex ? 'block' : 'none' }}
          >
            <img src={slide.src} alt={`slide-${index}`} className="slide-image" />
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
