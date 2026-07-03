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
            "We provide comprehensive tax consultancy services including GST registration, income tax filing, company registration, and more. Our expert team ensures your financial compliance with personalized solutions.",
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
          { label: 'About', href: '/about', children: [] },
          {
            label: 'Services',
            href: '/services',
            children: [
              { label: 'GST Services', href: '/services#gst' },
              { label: 'Income Tax', href: '/services#income-tax' },
              { label: 'Company Registration', href: '/services#registration' },
              { label: 'Accounting', href: '/services#accounting' },
            ],
          },
          { label: 'Blog', href: '/blog', children: [] },
          { label: 'Contact', href: '/contact', children: [] },
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
