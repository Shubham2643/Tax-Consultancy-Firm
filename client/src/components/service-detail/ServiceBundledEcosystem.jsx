import { Link } from 'react-router-dom';
import { CATEGORY_MAP, getRelatedServiceIcon } from './serviceDetailHelpers';

/**
 * Band 05 Ecosystem Pavilion displaying adjacent bundled practice mandates.
 */
export default function ServiceBundledEcosystem({ relatedServices }) {
  if (!relatedServices || relatedServices.length === 0) return null;

  return (
    <section className="dossier-shell-wrap bundled-band" aria-labelledby="bundled-heading">
      <div className="ecosystem-pavilion">
        <span className="ecosystem-watermark" aria-hidden="true">ECOSYSTEM</span>
        <div className="ecosystem-pavilion-head">
          <div className="pavilion-title-block">
            <div className="pavilion-kicker-pill">
              <span className="pavilion-idx-chip">05</span>
              <i className="fa-solid fa-cubes" aria-hidden="true"></i>
              <span>INTEGRATED PRACTICE AREAS</span>
            </div>
            <h2 id="bundled-heading" className="pavilion-heading">
              Frequently Bundled <span className="title-burnished-gold">Compliances</span>
            </h2>
            <p className="pavilion-sub">
              Pair adjacent statutory mandates under one partner desk for unified ledger sync and zero missed deadlines.
            </p>
          </div>

          <Link to="/services" className="btn-pavilion-explore">
            <span>Explore All Practice Areas</span>
            <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </Link>
        </div>

        <div className="bundled-editorial-grid">
          {relatedServices.map((rel, idx) => {
            const catMeta = CATEGORY_MAP[rel.serviceType] || { code: 'ADV' };
            const relIcon = getRelatedServiceIcon(rel);
            const categoryLabel = catMeta.label || rel.serviceType;
            return (
              <Link key={rel.slug || rel._id} to={`/services/${rel.slug || rel._id}`} className="ecosystem-card">
                <div className="ecosystem-card-top">
                  <div className="eco-card-meta-row">
                    <span className="eco-icon-emblem" aria-hidden="true">
                      <i className={relIcon}></i>
                    </span>
                    <span className="eco-cat-pill">{categoryLabel}</span>
                    <span className="eco-idx-num">{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <h3>{rel.title}</h3>
                  <p>{rel.description}</p>
                </div>
                <div className="ecosystem-card-foot">
                  <span className="eco-sla-badge">
                    <span className="retainers-live-dot" aria-hidden="true"></span>
                    <span>{rel.timeline || '3–5 Days'}</span>
                  </span>
                  <strong className="eco-view-cta">
                    <span>Inspect Dossier</span>
                    <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                  </strong>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
