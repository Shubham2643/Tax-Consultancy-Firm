import { Link } from 'react-router-dom';
import { getServicePath } from '../utils/slugify';

const ServiceCard = ({ service }) => {
  const { title, description, icon } = service;

  return (
    <article className="service-card card-animate">
      <div className="card-icon">
        <img src={icon} alt={title} aria-hidden="true" />
      </div>
      <h3>{title}</h3>
      <hr className="card-divider" />
      <p className="card-description">{description}</p>
      <Link to={getServicePath(service)} className="card-link" aria-label={`Learn more about ${title}`}>
        Learn more
      </Link>
    </article>
  );
};

export default ServiceCard;
