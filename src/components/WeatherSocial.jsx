import React, { useState, useEffect } from 'react';
import { FaShare, FaComment, FaStar, FaRegStar, FaThumbsUp, FaRegThumbsUp, FaList } from 'react-icons/fa';
import './WeatherSocial.css';

const WeatherSocial = ({ weatherData, city, onCityChange }) => {
  const [isFavorited, setIsFavorited] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteCities') || '[]');
    return favorites.includes(city);
  });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Load comments when city changes
  useEffect(() => {
    const loadComments = () => {
      const savedComments = localStorage.getItem(`comments_${city}`);
      if (savedComments) {
        try {
          const parsedComments = JSON.parse(savedComments);
          setComments(parsedComments);
        } catch (error) {
          console.error('Error loading comments:', error);
          setComments([]);
        }
      } else {
        setComments([]);
      }
    };

    // Load comments immediately
    loadComments();

    // Also set up an interval to periodically check for updates
    const intervalId = setInterval(loadComments, 1000);

    // Cleanup interval on unmount or when city changes
    return () => clearInterval(intervalId);
  }, [city]);

  // Update favorite status and load favorites when city changes
  useEffect(() => {
    const loadFavorites = () => {
      const savedFavorites = JSON.parse(localStorage.getItem('favoriteCities') || '[]');
      setFavorites(savedFavorites);
      setIsFavorited(savedFavorites.includes(city));
    };
    loadFavorites();
  }, [city]);

  const handleShare = () => {
    const shareText = `Current weather in ${city}: ${weatherData.main.temp}°C, ${weatherData.weather[0].description}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Current Weather',
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText);
      alert('Weather information copied to clipboard!');
    }
  };

  const toggleFavorite = () => {
    const newFavorites = isFavorited
      ? favorites.filter(fav => fav !== city)
      : [...favorites, city];
    
    localStorage.setItem('favoriteCities', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
    setIsFavorited(!isFavorited);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentObj = {
        id: Date.now(),
        text: newComment.trim(),
        timestamp: new Date().toISOString(),
        city: city,
        likes: 0,
        liked: false
      };
      
      const updatedComments = [...comments, newCommentObj];
      setComments(updatedComments);
      localStorage.setItem(`comments_${city}`, JSON.stringify(updatedComments));
      setNewComment('');
    }
  };

  const handleLikeComment = (commentId) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        const newLikes = comment.liked ? comment.likes - 1 : comment.likes + 1;
        return {
          ...comment,
          likes: newLikes,
          liked: !comment.liked
        };
      }
      return comment;
    });
    setComments(updatedComments);
    localStorage.setItem(`comments_${city}`, JSON.stringify(updatedComments));
  };

  const handleCitySelect = (selectedCity) => {
    onCityChange(selectedCity);
    setShowFavorites(false);
  };

  const removeFavorite = (cityToRemove, e) => {
    e.stopPropagation();
    const newFavorites = favorites.filter(fav => fav !== cityToRemove);
    localStorage.setItem('favoriteCities', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
    if (cityToRemove === city) {
      setIsFavorited(false);
    }
  };

  return (
    <div className="weather-social">
      <div className="social-actions">
        <button 
          className="social-btn share-btn"
          onClick={handleShare}
          aria-label="Share Weather"
        >
          <FaShare /> Share Weather
        </button>
        
        <button 
          className={`social-btn favorite-btn ${isFavorited ? 'active' : ''}`}
          onClick={toggleFavorite}
          aria-label={isFavorited ? "Unfavorite" : "Favorite"}
        >
          {isFavorited ? <FaStar /> : <FaRegStar />}
          {isFavorited ? "Unfavorite" : "Favorite"}
        </button>

        <button 
          className="social-btn favorites-btn"
          onClick={() => setShowFavorites(!showFavorites)}
          aria-label="My Favorites"
        >
          <FaList /> My Favorites
        </button>
      </div>

      {showFavorites && (
        <div className="favorites-panel">
          <h3>My Favorite Cities</h3>
          {favorites.length > 0 ? (
            <div className="favorites-list">
              {favorites.map((favCity) => (
                <div 
                  key={favCity} 
                  className={`favorite-item ${favCity === city ? 'active' : ''}`}
                  onClick={() => handleCitySelect(favCity)}
                >
                  <span>{favCity}</span>
                  <button 
                    className="remove-favorite"
                    onClick={(e) => removeFavorite(favCity, e)}
                    aria-label="Remove from favorites"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-favorites">No favorite cities yet. Add some cities to your favorites!</p>
          )}
        </div>
      )}

      <div className="comments-section">
        <h3>Comments</h3>
        
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment about the weather..."
            className="comment-input"
          />
          <button type="submit" className="comment-submit">
            Post
          </button>
        </form>

        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <p className="comment-text">{comment.text}</p>
                <div className="comment-footer">
                  <span className="comment-time">
                    {new Date(comment.timestamp).toLocaleString()}
                  </span>
                  <button 
                    className={`like-btn ${comment.liked ? 'active' : ''}`}
                    onClick={() => handleLikeComment(comment.id)}
                    aria-label={comment.liked ? "Unlike" : "Like"}
                  >
                    {comment.liked ? <FaThumbsUp /> : <FaRegThumbsUp />}
                    <span className="like-count">{comment.likes}</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherSocial; 