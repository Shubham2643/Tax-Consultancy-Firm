/**
 * Band 04 Executive Clarifications Vault featuring searchable accordion Q&As and direct partner strip.
 */
export default function ServiceClarificationsVault({
  serviceTitle,
  rawFaqs,
  filteredFaqs,
  faqFilter,
  onFaqFilterChange,
  openFaq,
  onToggleFaq,
}) {
  return (
    <section id="faqs" className="dossier-shell-wrap faqs-band" aria-labelledby="faqs-heading">
      <div className="faqs-vault-container">
        <div className="faqs-centered-header">
          <span className="faqs-watermark" aria-hidden="true">CLARIFICATIONS</span>
          <div className="retainers-eyebrow-badge">
            <span className="badge-index-chip">04</span>
            <i className="fa-solid fa-circle-question" aria-hidden="true"></i>
            <span>STATUTORY CLARIFICATIONS &amp; PROTOCOL</span>
          </div>
          <h2 id="faqs-heading" className="band-section-heading">
            Executive <span className="title-burnished-gold">Clarifications</span>
          </h2>
          <p className="band-section-subtext">
            Key guidance curated by our Managing Partners covering turnaround timelines, treasury challans, and digital custody.
          </p>

          <div className="faqs-spotlight-shell">
            <i className="fa-solid fa-magnifying-glass spotlight-icon" aria-hidden="true"></i>
            <input
              type="text"
              placeholder="Search clarifications, timelines, portal challans..."
              value={faqFilter}
              onChange={(e) => onFaqFilterChange(e.target.value)}
              className="faqs-filter-input"
              aria-label="Search FAQs"
            />
            {faqFilter && (
              <button
                type="button"
                className="btn-faq-clear"
                onClick={() => onFaqFilterChange('')}
                aria-label="Clear search"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
              </button>
            )}
            <span className="faqs-match-pill">
              {filteredFaqs.length} / {rawFaqs.length} Verified
            </span>
          </div>
        </div>

        <div className="open-accordion-list">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`open-faq-row ${isOpen ? 'expanded' : ''}`}>
                  <button
                    type="button"
                    className="open-faq-trigger"
                    onClick={() => onToggleFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-num-tag">Q{String(idx + 1).padStart(2, '0')}</span>
                    <span className="faq-question-text">{faq.question}</span>
                    <span className="faq-toggle-pill" aria-hidden="true">
                      <i className={`fa-solid fa-${isOpen ? 'minus' : 'plus'} faq-arrow-icon`}></i>
                    </span>
                  </button>
                  {isOpen && (
                    <div className="open-faq-body">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="faqs-empty-box">
              <i className="fa-regular fa-circle-question" aria-hidden="true"></i>
              <p>No clarifications matched &ldquo;{faqFilter}&rdquo;.</p>
            </div>
          )}
        </div>

        <div className="faqs-concierge-strip">
          <div className="concierge-copy-group">
            <span className="concierge-shield" aria-hidden="true">
              <i className="fa-solid fa-shield-halved"></i>
            </span>
            <div>
              <strong>Need bespoke guidance on your entity&apos;s facts?</strong>
              <span>Speak directly with our senior partner desk at Nikol Chambers.</span>
            </div>
          </div>
          <div className="concierge-actions">
            <a href="#consultation-intake" className="btn-concierge-gold">
              <span>Ask Partner Desk</span>
              <i className="fa-solid fa-arrow-up" aria-hidden="true"></i>
            </a>
            <a
              href={`https://wa.me/919510984735?text=${encodeURIComponent(
                `Hello Shree Chamunda Associates, I have a question regarding ${serviceTitle}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-concierge-wa"
            >
              <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
              <span>WhatsApp Desk</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
