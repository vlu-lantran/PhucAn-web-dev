import React, { Component } from 'react';
import '../styles/home.css'; 

class Home extends Component {
  render() {
    return (
      <div className="home-container">
        <div className="home-content">
          <h2 className="home-title">Welcome to Admin Dashboard</h2>
          <p className="home-subtitle">Manage your system with ease and efficiency</p>
          <div className="home-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1551288049-b5f3c2e8f919?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
              alt="Admin Dashboard"
              className="home-image"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;