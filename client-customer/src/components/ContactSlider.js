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
  autoScrollInterval = null;
  resumeTimeout = null;
  isPaused = false;

  componentDidMount() {
    this.fetchContacts();
  }

  componentWillUnmount() {
    clearInterval(this.autoScrollInterval);
    clearTimeout(this.resumeTimeout);
  }

  fetchContacts = async () => {
    try {

      const response = await axios.get('/api/admin/contacts');
      const data = response.data;
      // Tối ưu số lần lặp lại dữ liệu
      const repeatedData = Array(6).fill(data).flat();
      this.setState(
        {
          contactList: repeatedData,
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

    this.autoScrollInterval = setInterval(() => {
      if (this.isPaused) return;

      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += 1;
      }
    }, 16); // tương đương ~60fps
  };

  pauseAndResumeAutoScroll = () => {
    this.isPaused = true;
    clearTimeout(this.resumeTimeout);

    this.resumeTimeout = setTimeout(() => {
      this.isPaused = false;
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
  const { contactList, error, loading } = this.state;

  if (loading) {
    return <div className="text-center" style={{ color: 'black' }}>Loading...</div>;
  }

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
              <img
                src={contact.image}
                alt="contact"
                className="contact-logo"
                loading="lazy"
              />
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
