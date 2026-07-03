import './LegalPages.css';

const TermsConditions = () => {
  return (
    <div className="legal-page fade-in">
      <div className="legal-hero">
        <div className="container">
          <h1>Terms & Conditions</h1>
          <p>Please read these terms and conditions carefully before using our tax advisory services.</p>
        </div>
      </div>

      <div className="container">
        <div className="legal-grid">
          {/* Sidebar table of contents */}
          <div className="legal-sidebar">
            <h3>Sections</h3>
            <ul className="legal-sidebar-menu">
              <li className="active"><a href="#scope"><i className="fas fa-angle-right"></i> Scope of Services</a></li>
              <li><a href="#client-obligations"><i className="fas fa-angle-right"></i> Client Obligations</a></li>
              <li><a href="#fees-payments"><i className="fas fa-angle-right"></i> Fees & Payments</a></li>
              <li><a href="#liability-limit"><i className="fas fa-angle-right"></i> Limitation of Liability</a></li>
              <li><a href="#governing-law"><i className="fas fa-angle-right"></i> Governing Law</a></li>
            </ul>
          </div>

          {/* Main Legal Content */}
          <div className="legal-content-col">
            <div className="legal-date">
              <i className="far fa-calendar-alt"></i> Last Updated: June 30, 2026
            </div>

            <section id="scope" className="legal-section-block">
              <h2>1. Scope of Services</h2>
              <p>
                Shree Chamunda Associates provides comprehensive tax representation, GST registration, income tax filing, bookkeeping, audit support, and corporate incorporation services.
              </p>
              <p>
                All services are provided on an advisory basis. Shree Chamunda Associates represents clients before tax authorities but does not guarantee specific unilateral decisions from government officers.
              </p>
            </section>

            <section id="client-obligations" className="legal-section-block">
              <h2>2. Client Obligations</h2>
              <p>
                The client agrees to provide complete, accurate, and truthful documentation required for any registration or tax filing. Shree Chamunda Associates is not responsible for audits, fines, or notices resulting from falsified or incorrect information provided by the client.
              </p>
              <div className="legal-highlight-box">
                <p>
                  Important: It is the client\'s sole responsibility to upload document updates within specified portal deadlines. Late fees levied by GSTIN or MCA due to client-side delays will not be absorbed by our firm.
                </p>
              </div>
            </section>

            <section id="fees-payments" className="legal-section-block">
              <h2>3. Fees & Payments</h2>
              <p>
                Fees consist of two components:
              </p>
              <ul>
                <li><strong>Government Fees:</strong> Paid directly to portals for licenses or taxes.</li>
                <li><strong>Professional Service Fees:</strong> Retained by Shree Chamunda Associates for service completion.</li>
              </ul>
              <p>
                Professional fees must be settled in full prior to return filing dispatches or certificate downloads.
              </p>
            </section>

            <section id="liability-limit" className="legal-section-block">
              <h2>4. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable Indian law, Shree Chamunda Associates shall not be liable for any indirect, incidental, or punitive damages, including loss of business profits or capital interest, arising out of late filings if documentation was submitted past internal target schedules.
              </p>
            </section>

            <section id="governing-law" className="legal-section-block">
              <h2>5. Governing Law & Jurisdiction</h2>
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the laws of India.
              </p>
              <p>
                Any legal actions, suits, or proceedings arising out of these terms shall be subject to the exclusive jurisdiction of the courts located in Ahmedabad, Gujarat, India.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
