import './LegalPages.css';

const RefundPolicy = () => {
  return (
    <div className="legal-page fade-in">
      <div className="legal-hero">
        <div className="container">
          <h1>Refund Policy</h1>
          <p>Read about our professional services refund eligibility and government fee guidelines.</p>
        </div>
      </div>

      <div className="container">
        <div className="legal-grid">
          <div className="legal-sidebar">
            <h3>Sections</h3>
            <ul className="legal-sidebar-menu">
              <li className="active"><a href="#gov-fees"><i className="fas fa-angle-right"></i> Government Fees</a></li>
              <li><a href="#professional-fees"><i className="fas fa-angle-right"></i> Professional Fees</a></li>
              <li><a href="#cancellation-window"><i className="fas fa-angle-right"></i> Cancellation Window</a></li>
              <li><a href="#processing-time"><i className="fas fa-angle-right"></i> Processing Timelines</a></li>
            </ul>
          </div>

          <div className="legal-content-col">
            <div className="legal-date">
              <i className="far fa-calendar-alt"></i> Last Updated: June 30, 2026
            </div>

            <section id="gov-fees" className="legal-section-block">
              <h2>1. Government Fees</h2>
              <p>
                Certain services require payment of fees directly to the Government of India or state commercial tax portals (e.g. MCA incorporation fees, GST registration challans, PAN/TAN application fees).
              </p>
              <div className="legal-highlight-box">
                <p>
                  Government fees are 100% non-refundable once paid into the government treasury or when the portal challan is generated. Shree Chamunda Associates cannot recall government payments.
                </p>
              </div>
            </section>

            <section id="professional-fees" className="legal-section-block">
              <h2>2. Professional Service Fees</h2>
              <p>
                Professional fees are paid to Shree Chamunda Associates for consultation, document verification, drafting, and portal filings.
              </p>
              <ul>
                <li><strong>Full Refund:</strong> If a refund request is filed before any work has commenced or documents have been verified.</li>
                <li><strong>Partial Refund (50%):</strong> If work has been initiated (e.g. name reservation filed, drafting of deeds started) but not yet completed.</li>
                <li><strong>No Refund:</strong> Once the application has been officially submitted to the respective government portal (e.g. GST REG-01, MCA SPICe+ filed).</li>
              </ul>
            </section>

            <section id="cancellation-window" className="legal-section-block">
              <h2>3. Cancellation Window</h2>
              <p>
                To request a cancellation and refund, the client must submit a written request to <strong>shreechamundaassociates0905@gmail.com</strong> within <strong>24 hours</strong> of transaction initiation.
              </p>
            </section>

            <section id="processing-time" className="legal-section-block">
              <h2>4. Refund Processing & Timelines</h2>
              <p>
                Approved refund amounts will be credited back to the client\'s original bank account or source of payment.
              </p>
              <p>
                Standard refund processing takes <strong>7 to 10 working days</strong> from the date of refund approval.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
