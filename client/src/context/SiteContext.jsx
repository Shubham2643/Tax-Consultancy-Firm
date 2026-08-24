import { createContext, useContext, useState, useEffect } from 'react';
import { getSettings, getNavMenu } from '../api';

const SiteContext = createContext();

export const useSiteContext = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteContextProvider');
  }
  return context;
};

export const SiteContextProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [navMenu, setNavMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        setLoading(true);
        const [settingsData, navData] = await Promise.all([
          getSettings(),
          getNavMenu(),
        ]);
        setSettings(settingsData.data);
        setNavMenu(navData.data);
      } catch (err) {
        console.error('Failed to load site data:', err);
        setError(err.message || 'Failed to load site data');
        // Set fallback data so the site still renders
        setSettings({
          siteName: "Shree Chamunda Associates",
          phone: "+91 95109 84735",
          email: "shreechamundaassociates0905@gmail.com",
          address: "Ahmedabad, Gujarat, India",
          workingHours: "Mon - Sat: 9:00 AM - 7:00 PM",
          heroTitle: "SHREE CHAMUNDA ASSOCIATES",
          heroSubtitle: "THE BEST TAX CONSULTANCY FIRM IN GUJARAT",
          heroDescription:
            "Welcome to Shree Chamunda Associates, your trusted partner for comprehensive tax consultancy and financial advisory services. Founded with a commitment to excellence, we specialize in helping individuals and businesses navigate the complexities of taxation with ease and confidence.",
          aboutText:
            "Shree Chamunda Associates is a premier tax consultancy firm based in Gujarat, offering expert financial services to businesses and individuals.",
          trustHeading: "WHAT WE OFFER",
          trustMainText:
            "Comprehensive Tax & Financial Solutions for Your Business Growth",
          trustChecklist: [
            "GST Registration & Filing",
            "Income Tax Planning & Filing",
            "Company & LLP Registration",
            "Bookkeeping & Accounting",
            "Financial Advisory Services",
            "Tax Audit & Compliance",
          ],
          trustDescription:
            "With years of experience in tax consultancy, we help businesses navigate complex tax regulations with ease. Our team of certified professionals provides personalized solutions tailored to your specific needs.",
          trustDescription2:
            "We believe in building long-term relationships with our clients by delivering consistent, reliable, and high-quality services that drive business growth.",
          quickLinks: [
            { label: "Home", url: "/" },
            { label: "About Us", url: "/about" },
            { label: "Services", url: "/services" },
            { label: "Contact", url: "/contact" },
          ],
          importantLinks: [
            { label: "Income Tax Portal", url: "https://www.incometax.gov.in" },
            { label: "GST Portal", url: "https://www.gst.gov.in" },
            { label: "MCA Portal", url: "https://www.mca.gov.in" },
            { label: "TDS Portal", url: "https://www.tdscpc.gov.in" },
          ],
          socialLinks: {
            facebook: "https://www.facebook.com/share/1BRPjWQVX8/",
            instagram:
              "https://www.instagram.com/shree_chamunda_associate?igsh=Z3BlOGNhdXc4bGNm",
            whatsapp: " https://wa.me/919510984735",
          },
        });
        setNavMenu([
          { label: 'Home', href: '/', children: [] },
          {
            label: 'Start a Business',
            href: '#',
            children: [
              { label: 'Private Limited Company', href: '/services/private-limited-company' },
              { label: 'Limited Liability Partnership Firm', href: '/services/limited-liability-partnership-firm' },
              { label: 'Sole Properties', href: '/services/sole-proprietorship' },
              { label: 'Hindu Undividable Family(HUF)', href: '/services/huf-registration' },
              { label: 'Public Limited Company', href: '/services/public-limited-company' },
              { label: 'One Person Company(OPC)', href: '/services/one-person-company' },
              { label: 'Partnership Firm', href: '/services/partnership-firm' },
              { label: 'E-commerce Business', href: '/services/e-commerce-business' },
            ],
          },
          {
            label: 'Registration',
            href: '#',
            children: [
              { label: 'Government Registration', href: '/services/government-registration' },
              { label: 'GST Registration', href: '/services/gst-registration' },
              { label: 'Import Export Code Registration', href: '/services/import-export-code-registration' },
              { label: 'Startup-India Registration', href: '/services/startup-india-registration' },
              { label: 'Udhyam-MSME Registration', href: '/services/udhyam-msme-registration' },
              { label: 'Professional Tax Registration', href: '/services/professional-tax-registration' },
              { label: 'PAN Application', href: '/services/pan-application' },
              { label: 'TAN Application', href: '/services/tan-application' },
              { label: 'ESI Registration', href: '/services/esi-registration' },
              { label: 'Digital Signature', href: '/services/digital-signature' },
            ],
          },
          {
            label: 'Return',
            href: '#',
            children: [
              { label: 'GST Return Filing', href: '/services/gst-return-filing' },
              { label: 'Income Tax Return Filing', href: '/services/income-tax-return-filing' },
              { label: 'PF Return', href: '/services/pf-return' },
              { label: 'TDS Return', href: '/services/tds-return' },
              { label: 'E-way Bill', href: '/services/e-way-bill' },
              { label: 'PF & ESIC Return', href: '/services/pf-&-esic-return' },
            ],
          },
          {
            label: 'Accounting & Compliance',
            href: '#',
            children: [
              { label: 'Book Keeping & Accounting', href: '/services/book-keeping-&-accounting' },
              { label: 'Auditing (Internal & Tax Audit)', href: '/services/auditing' },
              { label: 'TDS / TCS Compliance', href: '/services/tds-compliance' },
              { label: 'Company Annual Filing (ROC)', href: '/services/roc-compliance' },
            ],
          },
          {
            label: 'Others',
            href: '#',
            children: [
              { label: 'Trademark Registration', href: '/services/trademark-registration' },
              { label: 'Copyright Registration', href: '/services/copyright-registration' },
              { label: 'Food License (FSSAI)', href: '/services/fssai-license' },
              { label: 'ISO Certification', href: '/services/iso-certification' },
            ],
          },
          { label: 'Services', href: '/services', children: [] },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();
  }, []);

  const value = {
    settings,
    navMenu,
    loading,
    error,
  };

  return (
    <SiteContext.Provider value={value}>
      {children}
    </SiteContext.Provider>
  );
};

export default SiteContext;
