import './LegalPages.css';

const TermsOfService = () => {
  return (
    <div className="legal-page fade-in">
      <div className="legal-hero">
        <div className="container">
          <h1>Terms of Service</h1>
          <p>Read about our professional standards, retainers, and client service delivery agreements.</p>
        </div>
      </div>

      <div className="container">
        <div className="legal-grid">
          <div className="legal-sidebar">
            <h3>Sections</h3>
            <ul className="legal-sidebar-menu">
              <li className="active"><a href="#service-delivery"><i className="fas fa-angle-right"></i> Service Delivery</a></li>
              <li><a href="#retainers-billing"><i className="fas fa-angle-right"></i> Retainers & Billing</a></li>
              <li><a href="#termination"><i className="fas fa-angle-right"></i> Termination</a></li>
              <li><a href="#client-representation"><i className="fas fa-angle-right"></i> Client Representations</a></li>
            </ul>
          </div>

          <div className="legal-content-col">
            <div className="legal-date">
              <i className="far fa-calendar-alt"></i> Last Updated: June 30, 2026
            </div>

            <section id="service-delivery" className="legal-section-block">
              <h2>1. Professional Service Delivery</h2>
              <p>
                Shree Chamunda Associates agrees to perform all taxation, bookkeeping, and company incorporation services in a professional and diligent manner, adhering to standard ICAI standards and statutory guidelines.
              </p>
              <p>
                Service delivery timelines (e.g. 3-5 working days) are estimates. Actual completion times may vary depending on government portal uptimes, server speeds (e.g. MCA SPICe+ loading), and clarifying inquiries from department officers.
              </p>
            </section>

            <section id="retainers-billing" className="legal-section-block">
              <h2>2. Retainers & Billing Cycles</h2>
              <p>
                Ongoing services (such as monthly bookkeeping, GST filing, and E-way bill generation) are billed on a monthly retainer basis.
              </p>
              <div className="legal-highlight-box">
                <p>
                  Late Payments: Retainer payments are due on the 5th of each month. Delayed payments exceeding 15 days may result in temporary suspension of return filings, for which late fees on portals shall be borne by the client.
                </p>
              </div>
            </section>

            <section id="termination" className="legal-section-block">
              <h2>3. Service Termination</h2>
              <p>
                Either party may terminate ongoing retainer agreements by providing a <strong>30-day written notice</strong>.
              </p>
              <p>
                Upon termination, Shree Chamunda Associates will compile all ledger registers and hand over accounting databases after outstanding professional fees are settled in full.
              </p>
            </section>

            <section id="client-representation" className="legal-section-block">
              <h2>4. Client Representations</h2>
              <p>
                The client represents and warrants that they hold legal ownership and appropriate authorization for the entities, trademarks, and accounts for which they request GST registration, MCA filings, or PAN generation.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
