import './LegalPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page fade-in">
      <div className="legal-hero">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p>Learn how we protect and manage your sensitive business documents and financial statements.</p>
        </div>
      </div>

      <div className="container">
        <div className="legal-grid">
          <div className="legal-sidebar">
            <h3>Sections</h3>
            <ul className="legal-sidebar-menu">
              <li className="active"><a href="#data-collection"><i className="fas fa-angle-right"></i> Data Collection</a></li>
              <li><a href="#data-usage"><i className="fas fa-angle-right"></i> Data Usage</a></li>
              <li><a href="#data-security"><i className="fas fa-angle-right"></i> Security Practices</a></li>
              <li><a href="#third-parties"><i className="fas fa-angle-right"></i> Third-Party Sharing</a></li>
            </ul>
          </div>

          <div className="legal-content-col">
            <div className="legal-date">
              <i className="far fa-calendar-alt"></i> Last Updated: June 30, 2026
            </div>

            <section id="data-collection" className="legal-section-block">
              <h2>1. Information We Collect</h2>
              <p>
                To provide statutory taxation and registration services, we collect standard business and individual identity records:
              </p>
              <ul>
                <li><strong>Identity Documents:</strong> PAN Cards, Aadhaar Cards, passports, voter IDs, and digital signatures.</li>
                <li><strong>Business Records:</strong> Partnership deeds, Certificates of Incorporation (COI), MOA/AOA drafts, and shop establishment licenses.</li>
                <li><strong>Financial Records:</strong> Bank statements, cash logs, sales/purchase registers, tax credit reports (Form 26AS/AIS), and payroll listings.</li>
              </ul>
            </section>

            <section id="data-usage" className="legal-section-block">
              <h2>2. How We Use Your Data</h2>
              <p>
                Collected documents are strictly used to compile tax returns, draft incorporation filings, compute tax liabilities, and represent your entity before tax authorities.
              </p>
              <div className="legal-highlight-box">
                <p>
                  Zero Notice Policy: We cross-verify financial data inputs before submitting them to GSTIN or IT portals to minimize compliance risks and notice possibilities.
                </p>
              </div>
            </section>

            <section id="data-security" className="legal-section-block">
              <h2>3. Data Security & Storage</h2>
              <p>
                We execute security protocols to protect your financial and identification files:
              </p>
              <p>
                All digital documentation is stored on secure cloud storage instances with limited access control lists. Credentials for client tax portals are encrypted and restricted to assigned consultants.
              </p>
            </section>

            <section id="third-parties" className="legal-section-block">
              <h2>4. Third-Party Sharing Limits</h2>
              <p>
                We do not sell, trade, or distribute your identity or financial records to third-party marketing companies, brokers, or external agencies.
              </p>
              <p>
                We only share your information with government bodies (Income Tax Department of India, MCA, GSTN, EPFO, and ESIC) as necessary to complete your statutory filings and registrations.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
