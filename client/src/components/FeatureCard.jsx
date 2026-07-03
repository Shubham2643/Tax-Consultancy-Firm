const FeatureCard = ({ feature }) => {
  const { title, description, icon } = feature;

  return (
    <div className="feature-card card-animate">
      <div className="feature-icon-box">
        <img src={icon} alt={title} className="feature-card-icon" />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureCard;
