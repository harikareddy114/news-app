import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import img from "./components/img.webp";

const defaultImg = { src: img };

const NewsData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('business');
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);
    axios.get(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&page=${page}&pageSize=${pageSize}&apiKey=569addbbb0d34c50ae52d0ab337b55c9`)
      .then(response => {
        setData(response.data.articles);
        setTotalResults(response.data.totalResults);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [category, page]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalResults / pageSize)) {
      setPage(newPage);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const totalPages = Math.ceil(totalResults / pageSize);

  return (
    <div className="container">
      <h1>News Data</h1>
      <div className="category-selector">
        <CategoryButton category="business" currentCategory={category} onClick={handleCategoryChange} />
        <CategoryButton category="technology" currentCategory={category} onClick={handleCategoryChange} />
        <CategoryButton category="entertainment" currentCategory={category} onClick={handleCategoryChange} />
      </div>
      <ul className="news-list">
        {data.map((article, index) => (
          <li key={index} className="news-item">
            <img
              src={article.urlToImage || defaultImg.src}
              alt={article.title}
              onError={(e) => { e.target.src = defaultImg.src; }}
            />
            <div className="news-details">
              <h2>{article.title}</h2>
              <p>{article.description ? (
                article.description.length > 100 ? `${article.description.substring(0, 100)}...` : article.description
              ) : (
                "No description available"
              )}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">Read More</a>
            </div>
          </li>
        ))}
      </ul>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

const CategoryButton = ({ category, currentCategory, onClick }) => {
  const activeClass = category === currentCategory ? 'active' : '';

  return (
    <button className={`category-button ${activeClass}`} onClick={() => onClick(category)}>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </button>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        className="page-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {pages.map(page => (
        <button
          key={page}
          className={`page-button ${page === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="page-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewsData />} />
      </Routes>
    </Router>
  );
}

export default App;
