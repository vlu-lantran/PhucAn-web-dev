import React, { Component, createRef } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '../css/ContactSlider.css';

class ContactComponent extends Component {
  state = {
    contactList: [],
    loading: true,
    error: null,
  };

  contactListRef = createRef();
  autoScrollFrame = null;
  resumeTimeout = null;
  isPaused = false;

  componentDidMount() {
    this.fetchContacts();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.autoScrollFrame);
    clearTimeout(this.resumeTimeout);
  }

  fetchContacts = async () => {
    try {
      const response = await axios.get('/api/admin/contacts');
      const data = response.data;
      this.setState(
        {
          contactList: [...data, ...data, ...data, ...data, ...data, ...data, ...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data],
          loading: false,
        },
        this.startAutoScroll
      );
    } catch (error) {
      this.setState({
        error: 'Không thể tải danh sách liên hệ.',
        loading: false,
      });
    }
  };

  startAutoScroll = () => {
    const container = this.contactListRef.current;
    if (!container) return;

    const scroll = () => {
      if (this.isPaused) return;

      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += 0.5;
      }

      this.autoScrollFrame = requestAnimationFrame(scroll);
    };

    this.autoScrollFrame = requestAnimationFrame(scroll);
  };

  pauseAndResumeAutoScroll = () => {
    this.isPaused = true;
    cancelAnimationFrame(this.autoScrollFrame);
    clearTimeout(this.resumeTimeout);

    this.resumeTimeout = setTimeout(() => {
      this.isPaused = false;
      this.startAutoScroll();
    }, 3000); // sau 3 giây cuộn lại
  };

  scrollNext = () => {
    const container = this.contactListRef.current;
    if (!container) return;

    if (container.scrollLeft >= container.scrollWidth / 2) {
      container.scrollLeft = 0;
    }

    container.scrollBy({ left: 200, behavior: 'smooth' });
    this.pauseAndResumeAutoScroll();
  };

  scrollPrev = () => {
    const container = this.contactListRef.current;
    if (!container) return;

    if (container.scrollLeft <= 0) {
      container.scrollLeft = container.scrollWidth / 2;
    }

    container.scrollBy({ left: -200, behavior: 'smooth' });
    this.pauseAndResumeAutoScroll();
  };

  render() {
    const { contactList, error } = this.state;

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    return (
      <div className="contact-container">
        <button className="arrow-btn left" onClick={this.scrollPrev}>
          <FaArrowLeft />
        </button>

        <div className="contact-list" ref={this.contactListRef}>
          {contactList.map((contact, index) => (
            <div key={index} className="contact-card">
              {contact.image ? (
                <img src={contact.image} alt="contact" className="contact-logo" />
              ) : (
                <span>Không có hình ảnh</span>
              )}
            </div>
          ))}
        </div>

        <button className="arrow-btn right" onClick={this.scrollNext}>
          <FaArrowRight />
        </button>
      </div>
    );
  }
}

export default ContactComponent;
