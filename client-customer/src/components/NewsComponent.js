import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/NewsComponent.css'; // Import CSS cho NewsComponent

const NewsCard = ({ news, onClick, isHot }) => (
  <div className={isHot ? 'hot-news-item' : 'news-today-item'}>
    <div className="news-image-container">
      <img
        src={news.image || 'https://via.placeholder.com/240x180?text=No+Image'}
        alt={news.title}
        className="news-image"
        title={news.title}
      />
    </div>
    <h3>{news.title}</h3>
    <p>{news.description || 'Click "Read More" to see details...'}</p>
    <button className="button-news" onClick={() => onClick(news._id)}>Read More</button>
  </div>
);

const NewsComponent = () => {
  const [hotNews, setHotNews] = useState([]);
  const [newsToday, setNewsToday] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleReadMore = (id) => {
    if (id) navigate(`/news/${id}`);
    else alert('ID không hợp lệ');
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const API = process.env.REACT_APP_API_BASE_URL || '';
        const [hotRes, topRes] = await Promise.all([
          fetch(`${API}/api/customer/news/hot/3`),
          fetch(`${API}/api/customer/news/top/4`),
        ]);
        const hotData = await hotRes.json();
        const topData = await topRes.json();

        setHotNews(hotData);
        setNewsToday(topData);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="news-container">
      {loading ? (
        <p className="loading-text">Loading news...</p>
      ) : (
        <>
          <div className="hot-news-section">
            <h2 className="section-title text-center">🔥 HOT NEWS</h2>
            <div className="hot-news-list">
              {hotNews.map((news, index) => (
                <NewsCard key={index} news={news} onClick={handleReadMore} isHot />
              ))}
            </div>
          </div>

          <div className="news-today-section">
            <h2 className="section-title text-center">📰 NEWS TODAY</h2>
            <div className="news-today-list">
              {newsToday.map((news, index) => (
                <NewsCard key={index} news={news} onClick={handleReadMore} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NewsComponent;
