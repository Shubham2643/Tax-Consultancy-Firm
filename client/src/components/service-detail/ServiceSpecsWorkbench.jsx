import { WORKBENCH_TABS, getBenefitDescription, getDeliverableSubtitle } from './serviceDetailHelpers';

/**
 * Interactive 4-tab specifications workbench covering scope, documents, workflow, and continuity.
 */
export default function ServiceSpecsWorkbench({
  service,
  activeTab,
  onSelectTab,
  keyBenefits,
  deliverables,
  documents,
  docReadiness,
  readyDocCount,
  docPercentage,
  onToggleDocCheck,
  copiedChecklist,
  onCopyChecklist,
  onPrintChecklist,
  processSteps,
  eligibilityList,
  postFilingRoadmap,
}) {
  return (
    <section id="dossier-workbench" className="dossier-shell-wrap workbench-band" aria-labelledby="workbench-heading">
      <div className="workbench-top-bar">
        <div className="workbench-heading-cluster">
          <div className="retainers-eyebrow-badge">
            <span className="badge-index-chip">02</span>
            <i className="fa-solid fa-book-open" aria-hidden="true"></i>
            <span>MANDATE ARCHITECTURE &amp; REQUIREMENTS</span>
          </div>
          <h2 id="workbench-heading" className="band-section-heading">
            Practice <span className="title-burnished-gold">Specifications</span>
          </h2>
        </div>

        <div className="workbench-tabs-rail" role="tablist" aria-label="Service dossier sections">
          {WORKBENCH_TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`workbench-tab-btn ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectTab(tab.id)}
              >
                <span className="tab-idx">{tab.num}</span>
                <i className={tab.icon} aria-hidden="true"></i>
                <span className="tab-lbl-full">{tab.label}</span>
                <span className="tab-lbl-short">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="workbench-stage">
        {activeTab === 'overview' && (
          <div id="overview" className="stage-overview-bento" role="tabpanel" aria-label="Scope and Deliverables">
            <div className="overview-obsidian-panel">
              <div className="anchor-panel-top">
                <span className="anchor-tag">STATUTORY BRIEF</span>
                <h3>Legal Scope &amp; Oversight</h3>
                <p>{service.detailedOverview || service.description}</p>
              </div>

              <div className="anchor-advantages-list">
                <span className="anchor-sub-kicker">KEY COMPLIANCE ADVANTAGES</span>
                {keyBenefits.map((benefit, idx) => (
                  <div key={idx} className="anchor-adv-row">
                    <span className="adv-check-dot" aria-hidden="true">
                      <i className="fa-solid fa-check"></i>
                    </span>
                    <div>
                      <strong>{benefit}</strong>
                      <p>{getBenefitDescription(benefit)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="anchor-panel-footer">
                <i className="fa-solid fa-vault" aria-hidden="true"></i>
                <span>Permanent Sec 128 Digital Vault &bull; 100% Challan Transparency</span>
              </div>
            </div>

            <div id="deliverables" className="overview-deliverables-panel">
              <div className="del-panel-header">
                <div>
                  <span className="del-kicker">TANGIBLE OUTPUTS</span>
                  <h3>Certified Mandate Deliverables</h3>
                </div>
                <span className="del-count-pill">
                  <i className="fa-solid fa-file-lines" aria-hidden="true"></i>
                  <span>{deliverables.length} Official Outputs</span>
                </span>
              </div>

              <div className="deliverables-quad-grid">
                {deliverables.map((item, idx) => (
                  <div key={idx} className="del-quad-card">
                    <div className="del-quad-top">
                      <span className="del-quad-num">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="del-certified-tag">
                        <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                        <span>Certified PDF</span>
                      </span>
                    </div>
                    <h4>{item}</h4>
                    <p>{getDeliverableSubtitle(item)}</p>
                  </div>
                ))}
              </div>

              <div className="del-panel-action-bar">
                <button
                  type="button"
                  className="btn-next-tab"
                  onClick={() => onSelectTab('documents')}
                >
                  <span>Review Required Documents ({documents.length})</span>
                  <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </button>
                <button
                  type="button"
                  className="btn-next-tab secondary"
                  onClick={() => onSelectTab('roadmap')}
                >
                  <span>View {processSteps.length}-Stage Workflow</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div id="documents" className="stage-documents-panel" role="tabpanel" aria-label="Documents Checklist">
            <div className="docs-toolbar-header">
              <div className="docs-progress-cluster">
                <div className="docs-progress-top">
                  <div>
                    <span className="del-kicker">PRE-FILING READINESS</span>
                    <h3>Interactive Statutory Document Checklist</h3>
                  </div>
                  <strong className="docs-progress-score">
                    {readyDocCount} of {documents.length} Assembled ({docPercentage}%)
                  </strong>
                </div>
                <div
                  className="docs-meter-track"
                  role="progressbar"
                  aria-valuenow={docPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="docs-meter-fill" style={{ width: `${docPercentage}%` }}></div>
                </div>
              </div>

              <div className="docs-tools-group">
                <button
                  type="button"
                  className={`btn-doc-tool ${copiedChecklist ? 'copied' : ''}`}
                  onClick={onCopyChecklist}
                >
                  <i className={copiedChecklist ? 'fa-solid fa-check' : 'fa-regular fa-copy'} aria-hidden="true"></i>
                  <span>{copiedChecklist ? 'Copied!' : 'Copy Checklist'}</span>
                </button>
                <button type="button" className="btn-doc-tool primary" onClick={onPrintChecklist}>
                  <i className="fa-solid fa-print" aria-hidden="true"></i>
                  <span>Print A4 Sheet</span>
                </button>
              </div>
            </div>

            <div className="docs-checklist-grid">
              {documents.map((doc, idx) => {
                const isReady = Boolean(docReadiness[doc]);
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`doc-tile-btn ${isReady ? 'assembled' : ''}`}
                    onClick={() => onToggleDocCheck(doc)}
                    aria-pressed={isReady}
                  >
                    <span className={`doc-tile-check ${isReady ? 'checked' : ''}`} aria-hidden="true">
                      {isReady ? <i className="fa-solid fa-check"></i> : String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="doc-tile-name">{doc}</span>
                    <span className={`doc-tile-status ${isReady ? 'ready' : ''}`}>
                      {isReady ? 'Assembled' : 'Required'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="docs-advisory-note">
              <i className="fa-solid fa-circle-info" aria-hidden="true"></i>
              <span>
                Click any document card above to mark it ready. Missing PAN/Aadhaar synchronization or prior financial statements? Mention it in Step 03 below—our Nikol desk handles rectification prior to portal upload.
              </span>
            </div>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div id="roadmap" className="stage-roadmap-panel" role="tabpanel" aria-label="Filing Workflow">
            <div className="stage-intro-row">
              <div>
                <span className="del-kicker">AUDIT-SAFE EXECUTION</span>
                <h3>{processSteps.length}-Stage Portal Filing Workflow</h3>
              </div>
              <span className="stage-sla-pill">
                <i className="fa-regular fa-clock" aria-hidden="true"></i>
                <span>Target Completion: {service.timeline || '3–7 Working Days'}</span>
              </span>
            </div>

            <div className="pipeline-cards-grid">
              {processSteps.map((step, idx) => (
                <div key={idx} className="pipeline-stage-card">
                  <div className="pipeline-card-top">
                    <span className="pipeline-num">{String(step.step || idx + 1).padStart(2, '0')}</span>
                    <span className="pipeline-tag">Stage {String(step.step || idx + 1).padStart(2, '0')}</span>
                  </div>
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'eligibility' && (
          <div id="eligibility" className="stage-eligibility-panel" role="tabpanel" aria-label="Eligibility and Continuity">
            <div className="elig-charter-split">
              <div className="elig-who-box">
                <span className="del-kicker">APPLICABLE ENTITIES</span>
                <h3>Who Should Engage This Mandate</h3>
                <ul className="elig-clean-list">
                  {eligibilityList.map((item, idx) => (
                    <li key={idx}>
                      <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="elig-assurance-obsidian">
                <span className="anchor-tag">CHAMBERS FIDUCIARY OATH</span>
                <h3>Client Confidentiality &amp; Oversight</h3>
                <ul className="elig-oath-list">
                  <li>
                    <i className="fa-solid fa-lock" aria-hidden="true"></i>
                    <span>
                      <strong>Strict NDA Protection:</strong> Financial statements, bank trails, and commercial projections stay strictly confidential.
                    </span>
                  </li>
                  <li>
                    <i className="fa-solid fa-user-tie" aria-hidden="true"></i>
                    <span>
                      <strong>Partner Supervision:</strong> Every ledger computation and statutory return is reviewed by senior specialists before filing.
                    </span>
                  </li>
                  <li>
                    <i className="fa-solid fa-receipt" aria-hidden="true"></i>
                    <span>
                      <strong>Direct Challan Proof:</strong> 100% government payment receipts shared transparently with zero intermediary markup.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="continuity-roadmap-block">
              <div className="continuity-head">
                <span className="continuity-badge-icon" aria-hidden="true">
                  <i className="fa-solid fa-calendar-check"></i>
                </span>
                <div>
                  <h4>{postFilingRoadmap.heading}</h4>
                  <p>{postFilingRoadmap.sub}</p>
                </div>
              </div>
              <div className="continuity-cards-row">
                {postFilingRoadmap.items.map((m) => (
                  <div key={m.title} className="continuity-card">
                    <span className="cont-tag">{m.tag}</span>
                    <strong>{m.title}</strong>
                    <p>{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
