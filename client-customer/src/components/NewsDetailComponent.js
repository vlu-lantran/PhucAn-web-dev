import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../css/news-view.css';

const NewsViewComponent = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`/api/customer/news/${id}`);
        setNews(response.data);
      } catch (err) {
        setError('Không thể tải tin tức.');
      }
    };

    fetchNews();
  }, [id]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!news) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="news-view-container">
      <h1 className="news-title">{news.title}</h1>
      <p className="news-meta">
        Author: {news.author} | Date published: {new Date(news.created_at).toLocaleDateString()}
      </p>

      {news.image && (
        <div className="news-image">
          <img src={news.image} alt="Ảnh nền tin tức" />
        </div>
      )}

      <div
        className="news-content"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />
    </div>
  );
};

export default NewsViewComponent;
