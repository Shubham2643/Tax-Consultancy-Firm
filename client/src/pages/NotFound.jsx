import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import './NotFound.css';

const NotFound = () => {
  useSEO({ title: '404 - Page Not Found', description: 'The page you are looking for does not exist.' });

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="not-found-home-btn">
          <i className="fas fa-home"></i> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
