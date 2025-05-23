import React, { useEffect } from "react";
import "../css/AboutUsComponent.css";
import HeroImage from "../assets/Industrial-and-Manufacturing.jpg";

const AboutUsComponent = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll(".fade-in, .slide-left, .slide-right");
    sections.forEach((section) => observer.observe(section));
  }, []);

  return (
    <div className="about-us-container">
      <div className="hero-section">
        <img src={HeroImage} alt="About Us Background" className="hero-bg" />
        <div className="hero-overlay">
          <h1 className="hero-title">About Us</h1>
        </div>
      </div>

      <div className="logo-container text-center fade-in">
        <h1 className="company-name">Phúc An</h1>
        <p className="company-tagline">Manufacturing | Trading | Importing</p>
      </div>

      <section className="fade-in">
        <h2 className="section-title">Who We Are</h2>
        <p>
          Phuc An is a dynamic Vietnamese company specializing in manufacturing and trading industrial equipment. We pride ourselves on delivering reliable solutions and building long-term partnerships globally.
        </p>
      </section>

      <section className="fade-in">
        <h2 className="section-title">Our Mission & Vision</h2>
        <p>
          <strong>Mission:</strong> Deliver trusted industrial solutions that empower businesses and elevate industries.
        </p>
        <p>
          <strong>Vision:</strong> Become Southeast Asia's leading trading and manufacturing partner by 2030.
        </p>
      </section>

      <section className="fade-in">
        <h2 className="section-title">Core Business Areas</h2>
        <ul className="two-column-list">
          <li>Industrial Tools & Equipment</li>
          <li>Protective & Safety Gear</li>
          <li>Medical & Lab Supplies</li>
          <li>Welding & Lifting Equipment</li>
          <li>Engineering & Technical Procurement</li>
        </ul>
      </section>

      <div className="row-container">
        <div className="slide-left">
          <h2 className="section-title">Our Partners</h2>
          <p>
            We work closely with international suppliers and regional contractors to ensure scalable, top-tier industrial supply chains.
          </p>
        </div>
        <div className="slide-right">
          <h2 className="section-title">Key Projects</h2>
          <p>
            Brunei Fertilizer Plant, Long Son Petrochemicals, and Dung Quat Refinery are just a few of our landmark projects.
          </p>
        </div>
      </div>

      <section className="fade-in">
        <h2 className="section-title">Our People</h2>
        <p>
          Our expert team includes engineers, technical buyers, and project managers who bring precision and passion to every solution.
        </p>
      </section>

      <section className="fade-in">
        <h2 className="section-title">Sustainability & Responsibility</h2>
        <p>
          We are dedicated to ethical business, environmental care, and community support as part of our long-term commitment.
        </p>
      </section>
    </div>
  );
};

export default AboutUsComponent;
