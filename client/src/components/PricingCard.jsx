import { useNavigate } from 'react-router-dom';

const PricingCard = ({ plan, index }) => {
  const { name, price, period, features, isPopular } = plan;
  const navigate = useNavigate();

  const handleSelect = () => {
    navigate('/contact', { state: { planName: name } });
  };

  // Assign tier icons based on index
  const tierIcons = ['fas fa-seedling', 'fas fa-rocket', 'fas fa-crown'];
  const tierIcon = tierIcons[index] || 'fas fa-star';

  return (
    <div className={`price-card card-animate ${isPopular ? 'price-card-popular' : ''}`}>
      {isPopular && (
        <div className="popular-badge">
          <i className="fas fa-bolt"></i> Most Popular
        </div>
      )}

      <div className="price-card-header">
        <div className={`price-tier-icon ${isPopular ? 'price-tier-icon-popular' : ''}`}>
          <i className={tierIcon}></i>
        </div>
        <h3>{name}</h3>
      </div>

      <div className="price-amount">
        <span className="price-currency">₹</span>
        <span className="price-value">{price.toLocaleString()}</span>
        <span className="price-period">/{period}</span>
      </div>

      <div className="price-divider"></div>

      <ul className="price-features">
        {features.map((feature, idx) => (
          <li key={idx}>
            <span className="feature-check">
              <i className="fas fa-check"></i>
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <button
        className={`price-btn ${isPopular ? 'price-btn-popular' : ''}`}
        onClick={handleSelect}
      >
        Get Started <i className="fas fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default PricingCard;
