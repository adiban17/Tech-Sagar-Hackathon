import React, { useState, useEffect } from 'react';

const FinancialNews = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const apiKey = import.meta.env.VITE_NEWS_API_KEY;
        if (!apiKey) {
          throw new Error('News API key not found. Please set VITE_NEWS_API_KEY in your environment variables.');
        }
        
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        
        // Keep only top 6-8 most recent articles
        const topArticles = data.articles.slice(0, 8);
        setNews(topArticles);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatTimeAgo = (publishedAt) => {
    const now = new Date();
    const published = new Date(publishedAt);
    const diffInMinutes = Math.floor((now - published) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const truncateTitle = (title, maxLength = 80) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  return (
    <div className="glass-effect rounded-lg border border-white/10 p-6 h-96 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
        <div className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
        <h3 className="text-white font-semibold">Live Market Updates</h3>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-white/10 rounded mb-2"></div>
              <div className="h-3 bg-white/5 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No news available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg transition-all duration-200 hover:bg-white/5 hover:border-white/20 border border-transparent"
            >
              <h4 className="text-white text-sm font-medium mb-2 leading-tight">
                {truncateTitle(article.title)}
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-emerald text-xs font-medium">
                  {article.source.name}
                </span>
                <span className="text-gray-400 text-xs">
                  {formatTimeAgo(article.publishedAt)}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinancialNews;
