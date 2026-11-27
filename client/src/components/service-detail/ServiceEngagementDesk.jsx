import { Link } from 'react-router-dom';
import { CAPITAL_SLABS, TURNOVER_TIERS, FILING_FREQUENCIES } from './serviceDetailHelpers';

/**
 * Band 03 workspace combining the interactive scope/fee calibrator with the partner engagement form.
 */
export default function ServiceEngagementDesk({
  service,
  isIncorporation,
  capitalSlab,
  onCapitalSlabChange,
  directorCount,
  onDirectorCountChange,
  turnoverTier,
  onTurnoverTierChange,
  filingFrequency,
  onFilingFrequencyChange,
  pricingSummary,
  formData,
  onInputChange,
  attachedFile,
  onFileUpload,
  onRemoveFile,
  formStatus,
  onFormSubmit,
}) {
  const selectedTierObj = TURNOVER_TIERS.find((t) => t.id === turnoverTier) || TURNOVER_TIERS[1];
  const selectedFreqObj = FILING_FREQUENCIES.find((f) => f.id === filingFrequency) || FILING_FREQUENCIES[0];

  const {
    hasStructuredFees,
    calculatedGovtFee,
    calculatedProfFee,
    totalMandateFee,
    indicativeAmount,
    indicativeUnit,
    indicativeTierName,
    indicativeBillingNote,
  } = pricingSummary;

  return (
    <section id="consultation-intake" className="dossier-shell-wrap engagement-band" aria-labelledby="engagement-heading">
      <div className="section-header-centered engagement-section-header">
        <div className="retainers-eyebrow-badge">
          <span className="badge-index-chip">03</span>
          <i className="fa-solid fa-sliders" aria-hidden="true"></i>
          <span>MANDATE CALIBRATION &amp; PARTNER INTAKE DESK</span>
        </div>
        <h2 id="engagement-heading" className="band-section-heading">
          Calibrate Scope &amp; <span className="title-burnished-gold">Initiate Engagement</span>
        </h2>
        <p className="band-section-subtext">
          Select your entity scale below to configure an engagement profile and transmit your brief directly to our Managing Partners.
        </p>
      </div>

      <div className="engagement-workbench-grid">
        {/* Left column: fee & scope calibrator + direct chambers contact */}
        <aside className="engagement-obsidian-col">
          <div className="engagement-fee-card">
            <div className="eng-card-head">
              <div>
                <span className="eng-kicker">FEE &amp; VOLUME CALIBRATOR</span>
                <h3>{hasStructuredFees ? 'Transparent Mandate Estimate' : 'Indicative Retainer Calibrator'}</h3>
              </div>
              <span className="eng-lock-pill">
                <i className="fa-solid fa-lock" aria-hidden="true"></i>
                <span>Scope-Locked</span>
              </span>
            </div>

            <div className="eng-calibrator-controls">
              {isIncorporation ? (
                <>
                  <div className="eng-ctrl-group">
                    <span className="eng-ctrl-label">Authorized Share Capital Slab</span>
                    <div className="eng-slab-grid">
                      {CAPITAL_SLABS.map((slab) => (
                        <button
                          key={slab.id}
                          type="button"
                          className={`eng-slab-btn ${capitalSlab === slab.id ? 'active' : ''}`}
                          onClick={() => onCapitalSlabChange(slab.id)}
                        >
                          <strong>{slab.label}</strong>
                          <span>{slab.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="eng-ctrl-group">
                    <span className="eng-ctrl-label">Designated Directors (DIN &amp; DSC)</span>
                    <div className="eng-stepper">
                      <button
                        type="button"
                        className="btn-eng-step"
                        disabled={directorCount <= 2}
                        onClick={() => onDirectorCountChange(Math.max(2, directorCount - 1))}
                        aria-label="Decrease directors"
                      >
                        <i className="fa-solid fa-minus" aria-hidden="true"></i>
                      </button>
                      <strong className="eng-step-val">{directorCount} Directors</strong>
                      <button
                        type="button"
                        className="btn-eng-step"
                        disabled={directorCount >= 6}
                        onClick={() => onDirectorCountChange(Math.min(6, directorCount + 1))}
                        aria-label="Increase directors"
                      >
                        <i className="fa-solid fa-plus" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="eng-ctrl-group">
                    <span className="eng-ctrl-label">Annual Turnover &amp; Voucher Volume</span>
                    <div className="eng-slab-grid">
                      {TURNOVER_TIERS.map((tier) => (
                        <button
                          key={tier.id}
                          type="button"
                          className={`eng-slab-btn ${turnoverTier === tier.id ? 'active' : ''}`}
                          onClick={() => onTurnoverTierChange(tier.id)}
                        >
                          <strong>{tier.label}</strong>
                          <span>{tier.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="eng-ctrl-group">
                    <span className="eng-ctrl-label">Filing &amp; Accounting Frequency</span>
                    <div className="eng-freq-grid">
                      {FILING_FREQUENCIES.map((freq) => (
                        <button
                          key={freq.id}
                          type="button"
                          className={`eng-freq-btn ${filingFrequency === freq.id ? 'active' : ''}`}
                          onClick={() => onFilingFrequencyChange(freq.id)}
                        >
                          {freq.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {hasStructuredFees ? (
              <div className="eng-readout-panel">
                <div className="readout-hero-row">
                  <div>
                    <span className="readout-caption">Estimated Total Investment</span>
                    <div className="readout-amount">₹{totalMandateFee.toLocaleString('en-IN')}</div>
                  </div>
                  <span className="readout-tax-pill">Official Challan Included</span>
                </div>
                <div className="readout-ledger-rows">
                  <div className="r-row">
                    <span>Govt Portal &amp; Stamp Duty</span>
                    <strong>
                      {calculatedGovtFee > 0 ? `₹${calculatedGovtFee.toLocaleString('en-IN')}` : 'Nil (Exempt)'}
                    </strong>
                  </div>
                  <div className="r-row">
                    <span>Advisory &amp; Filing Retainer</span>
                    <strong>₹{calculatedProfFee.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="eng-readout-panel">
                <div className="readout-hero-row">
                  <div>
                    <span className="readout-caption">Indicative Starting Retainer ({indicativeTierName})</span>
                    <div className="readout-amount">
                      ₹{indicativeAmount.toLocaleString('en-IN')}
                      <span className="readout-unit">{indicativeUnit}</span>
                    </div>
                  </div>
                  <span className="readout-tax-pill">{selectedFreqObj.label} Cycle</span>
                </div>
                <div className="readout-ledger-rows">
                  <div className="r-row">
                    <span>Scope Scale</span>
                    <strong>{selectedTierObj.label} ({selectedTierObj.sub})</strong>
                  </div>
                  <div className="r-row">
                    <span>Included Coverage</span>
                    <strong>{indicativeBillingNote}</strong>
                  </div>
                </div>
                <Link to="/pricing" className="btn-compare-retainers">
                  <span>Compare Fixed Monthly Retainer Tiers</span>
                  <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </Link>
              </div>
            )}

            <div className="eng-chambers-footer">
              <div className="chambers-foot-meta">
                <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                <span>612, Hill Town Square, MG Road, Nikol, Ahmedabad &bull; Mon–Sat 9:30 AM–7:30 PM</span>
              </div>
              <div className="chambers-foot-btns">
                <a href="tel:+919510984735" className="btn-chambers-pill phone">
                  <i className="fa-solid fa-phone" aria-hidden="true"></i>
                  <span>+91 95109 84735</span>
                </a>
                <a
                  href={`https://wa.me/919510984735?text=${encodeURIComponent(
                    `Hello Shree Chamunda Associates, I would like to consult on statutory mandate: ${service.title}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-chambers-pill whatsapp"
                >
                  <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
                  <span>WhatsApp Chambers</span>
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Right column: Partner intake form */}
        <div className="engagement-form-card">
          <div className="intake-panel-header">
            <div>
              <span className="del-kicker">DIRECT PARTNER DESK</span>
              <h3>Book Service Engagement</h3>
            </div>
            <span className="intake-sla-tag">
              <span className="retainers-live-dot" aria-hidden="true"></span>
              <span>&lt; 2h Turnaround</span>
            </span>
          </div>

          <div className="intake-context-bar">
            <span className="ctx-label">Selected Mandate</span>
            <strong className="ctx-value">{service.title}</strong>
            <span className="ctx-meta">
              {isIncorporation
                ? `${capitalSlab} Capital • ${directorCount} Directors`
                : `${selectedTierObj.label} • ${selectedFreqObj.label}`}
            </span>
          </div>

          {formStatus.success && (
            <div className="form-alert-banner success">
              <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
              <div>
                <strong>Engagement Mandate Logged</strong>
                <p>Our senior tax advisors will review your scope and connect within 2 business hours.</p>
              </div>
            </div>
          )}

          {formStatus.error && (
            <div className="form-alert-banner error">
              <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
              <div>
                <strong>Submission Notice</strong>
                <p>{formStatus.error}</p>
              </div>
            </div>
          )}

          <form onSubmit={onFormSubmit} className="spacious-intake-form">
            <div className="form-split-2">
              <div className="field-block">
                <label htmlFor="name">Full Name *</label>
                <div className="input-icon-shell">
                  <i className="fa-regular fa-user" aria-hidden="true"></i>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={onInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className="dossier-field-input"
                  />
                </div>
              </div>

              <div className="field-block">
                <label htmlFor="phone">Phone or WhatsApp Number *</label>
                <div className="input-icon-shell">
                  <i className="fa-solid fa-phone" aria-hidden="true"></i>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={onInputChange}
                    placeholder="+91 98765 43210"
                    className="dossier-field-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-split-2">
              <div className="field-block">
                <label htmlFor="email">Corporate Email Address *</label>
                <div className="input-icon-shell">
                  <i className="fa-regular fa-envelope" aria-hidden="true"></i>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={onInputChange}
                    placeholder="rahul@enterprise.com"
                    className="dossier-field-input"
                  />
                </div>
              </div>

              <div className="field-block">
                <label htmlFor="entityName">Commercial Entity or Proposed Name</label>
                <div className="input-icon-shell">
                  <i className="fa-solid fa-building" aria-hidden="true"></i>
                  <input
                    type="text"
                    id="entityName"
                    name="entityName"
                    value={formData.entityName}
                    onChange={onInputChange}
                    placeholder="e.g. Apex Logix Private Limited"
                    className="dossier-field-input"
                  />
                </div>
              </div>
            </div>

            <div className="field-block">
              <label>Attach KYC or Financial Statements (Optional)</label>
              {!attachedFile ? (
                <label className="spacious-dropzone">
                  <input
                    type="file"
                    onChange={onFileUpload}
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    className="file-hidden-input"
                  />
                  <span className="dropzone-icon" aria-hidden="true">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                  </span>
                  <div className="dropzone-copy">
                    <strong>Upload PAN, Bank Statement, or Entity KYC (PDF / Image)</strong>
                    <span>Maximum 10 MB &bull; Encrypted transfer directly to Managing Partner desk</span>
                  </div>
                </label>
              ) : (
                <div className="attached-file-chip">
                  <div className="file-chip-meta">
                    <i className="fa-solid fa-file-pdf" aria-hidden="true"></i>
                    <div>
                      <strong>{attachedFile.name}</strong>
                      <span>{attachedFile.size}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onRemoveFile}
                    className="btn-remove-attachment"
                    aria-label="Remove attached file"
                  >
                    <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                  </button>
                </div>
              )}
            </div>

            <div className="field-block">
              <label htmlFor="message">Deadlines &amp; Practice Notes</label>
              <textarea
                id="message"
                name="message"
                rows="3"
                value={formData.message}
                onChange={onInputChange}
                placeholder="Share monthly transaction volume, urgent statutory notice deadlines, or specific accounting requirements..."
                className="dossier-field-textarea"
              ></textarea>
            </div>

            <button type="submit" className="btn-submit-engagement" disabled={formStatus.submitting}>
              {formStatus.submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
                  <span>Transmitting Engagement Docket...</span>
                </>
              ) : (
                <>
                  <span>Submit Engagement Mandate to Partner Desk</span>
                  <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </>
              )}
            </button>

            <div className="intake-fiduciary-foot">
              <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
              <span>Direct Nikol Chambers Desk &bull; Strict Non-Disclosure Guaranteed &bull; Zero Hidden Fees</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
