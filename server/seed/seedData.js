const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Service = require('../models/Service');
const PricingPlan = require('../models/PricingPlan');
const Feature = require('../models/Feature');
const NavMenu = require('../models/NavMenu');
const SiteSettings = require('../models/SiteSettings');
const BlogPost = require('../models/BlogPost');
const FAQ = require('../models/FAQ');
const User = require('../models/User');
const Session = require('../models/Session');
const TeamMember = require('../models/TeamMember');
const registrationServices = require('./registrationServices');
const returnServices = require('./returnServices');
const startupServices = require('./startupServices');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB. Seeding data...');

    // Clear existing data
    await Service.deleteMany({});
    await PricingPlan.deleteMany({});
    await Feature.deleteMany({});
    await NavMenu.deleteMany({});
    await SiteSettings.deleteMany({});
    await BlogPost.deleteMany({});
    await FAQ.deleteMany({});
    await User.deleteMany({});
    await Session.deleteMany({});
    await TeamMember.deleteMany({});

    // --- SERVICES (10 cards) ---
    const services = [
      {
        title: 'Accounting System Setup',
        slug: 'accounting-system-setup',
        description: 'Custom accounting systems designed to streamline your financial operations and reporting.',
        icon: '/assets/accounting-system.svg',
        link: '#',
        order: 1,
        isActive: true,
        detailedOverview: 'Setting up a robust accounting environment is essential for financial transparency and scaling. We configure systems (Tally Prime, Zoho Books, QuickBooks, etc.) tailored to your industry, creating a solid foundation for financial control.',
        deliverables: ['Chart of Accounts Design', 'Software License & Configuration', 'Integration with Payment Gateways', 'Staff Training Guide'],
        documentsRequired: ['PAN Card of Business', 'GSTIN Certificate (if registered)', 'Bank Statement / Cancelled Cheque', 'Existing Balance Sheet (for migration)'],
        timeline: '5-7 working days',
        serviceType: 'accounting',
      },
      {
        title: 'Personal Tax Return & Accounting',
        slug: 'personal-tax-return-and-accounting',
        description: 'Expert tax planning and compliance services to optimize your financial position.',
        icon: '/assets/infinite.svg',
        link: '#',
        order: 2,
        isActive: true,
        detailedOverview: 'Expert e-filing of individual Income Tax Returns (ITR-1 to ITR-4) to optimize deductions under 80C, 80D, HRA, and presumptive schemes. We analyze your AIS/26AS tax credits to ensure 100% compliance with zero notices.',
        deliverables: ['ITR Computation Sheet', 'Aadhaar e-Verified Return ITR-V Receipt', 'Tax Saving Advisory Report'],
        documentsRequired: ['Form 16 from Employer', 'Form 26AS & AIS Tax Credit Statements', 'Bank Interest Certificates', 'Investment Proofs (80C, 80D, HRA, ELSS, Insurance)'],
        timeline: '2-3 working days',
        serviceType: 'tax',
      },
      {
        title: 'Bookkeeping Services',
        slug: 'bookkeeping-services',
        description: 'Accurate and timely bookkeeping to maintain clear financial records.',
        icon: '/assets/bookkepping-2.svg',
        link: '#',
        order: 3,
        isActive: true,
        detailedOverview: 'Ongoing cloud-based ledger entry, bank statement reconciliations, accounts payable/receivable tracking, and expense entries to keep your business financial records accurate and completely audit-ready.',
        deliverables: ['Monthly Profit & Loss Statement', 'Bank Reconciliation Reports', 'Accounts Payable/Receivable Ledger', 'Monthly Expense Analytics'],
        documentsRequired: ['Bank Current Account Statements', 'Sales Invoices & Purchase Bills', 'Expense Receipts / Petty Cash logs', 'Credit Card Statements'],
        timeline: 'Monthly / Ongoing',
        serviceType: 'accounting',
      },
      {
        title: 'Payroll Services',
        slug: 'payroll-services',
        description: 'Comprehensive payroll solutions to ensure timely and compliant employee payments.',
        icon: '/assets/payroll-2.svg',
        link: '#',
        order: 4,
        isActive: true,
        detailedOverview: 'End-to-end payroll management: salary processing, dynamic payslip generation, TDS deduction on salaries (Form 24Q), and monthly PF & ESIC compliance filings to manage your workforce seamlessly.',
        deliverables: ['Monthly Salary Registers', 'Digitized Employee Payslips', 'PF & ESIC Challans', 'Quarterly Form 24Q TDS Returns'],
        documentsRequired: ['Employee Aadhaar & PAN Details', 'Bank Accounts for Salary Deposits', 'Monthly Attendance & Leaves Data', 'PF & ESIC Registration Credentials'],
        timeline: 'Monthly Cycle (3 working days)',
        serviceType: 'accounting',
      },
      {
        title: 'Business Tax Filing',
        slug: 'business-tax-filing',
        description: 'End-to-end business tax return preparation ensuring compliance and maximizing deductions.',
        icon: '/assets/bookkepping-2.svg',
        link: '#',
        order: 5,
        isActive: true,
        detailedOverview: 'Comprehensive partnership, LLP, and corporate tax returns (ITR-5 & ITR-6) along with GST return preparation. We cross-verify purchase ledgers with GST input tax credit (GSTR-2B) to maximize tax savings.',
        deliverables: ['Audit & Non-Audit ITR Computation', 'GST Monthly GSTR-1 & 3B Filings', 'TDS Return Acknowledgments', 'GST Input Reconciliation Statement'],
        documentsRequired: ['Audited Balance Sheet & P&L Statements', 'GST Purchase & Sales Ledgers', 'TDS Challans and Certificates', 'Directors\' Resolution Copy'],
        timeline: '5-10 working days',
        serviceType: 'tax',
      },
      {
        title: 'Financial Statement Preparation',
        slug: 'financial-statement-preparation',
        description: 'Preparation of professional financial statements for internal or external reporting.',
        icon: '/assets/bookkepping-2.svg',
        link: '#',
        order: 6,
        isActive: true,
        detailedOverview: 'Compilation of professional Balance Sheet, Profit & Loss Statements, and Cash Flow Statements conforming to statutory Accounting Standards. Essential for bank loan applications and equity presentations.',
        deliverables: ['Draft Balance Sheet & P&L', 'Cash Flow Statement', 'Notes to Accounts Draft', 'Financial Ratio Analysis Sheet'],
        documentsRequired: ['Trial Balance', 'Bank statements & loan amortization schedules', 'Fixed Asset Register', 'Closing Inventory Valuation Sheet'],
        timeline: '4-6 working days',
        serviceType: 'accounting',
      },
      {
        title: 'Tax Advisory & Planning',
        slug: 'tax-advisory-and-planning',
        description: 'Strategic advice to minimize tax liability and plan long-term tax strategies.',
        icon: '/assets/bookkepping-2.svg',
        link: '#',
        order: 7,
        isActive: true,
        detailedOverview: 'Strategic corporate and personal tax planning to structure transactions, optimize taxes legally, and avoid compliance audits. We analyze business contracts and structure investments for low tax outcomes.',
        deliverables: ['Tax Structuring Advisory Report', 'Advance Tax Estimator Sheet', 'Capital Gains Optimization Plan'],
        documentsRequired: ['Current year projected financial statements', 'Details of planned property / asset transactions', 'Investment portfolios', 'Past 3 years ITR acknowledgments'],
        timeline: '5-7 working days',
        serviceType: 'tax',
      },
      {
        title: 'Internal Audit Services',
        slug: 'internal-audit-services',
        description: 'Independent evaluations to improve operations and control effectiveness.',
        icon: '/assets/bookkepping-2.svg',
        link: '#',
        order: 8,
        isActive: true,
        detailedOverview: 'Independent internal audits to verify accounting control effectiveness, identify leakages or fraud, and streamline operational efficiency. We test purchase controls, cash handlings, and payroll checks.',
        deliverables: ['Internal Audit Report', 'Risk Assessment & Mitigation Matrix', 'Management Letter on Control Deficiencies'],
        documentsRequired: ['Internal Accounting Policy manual', 'Complete Ledger backup', 'Inventory Register', 'Vendor & Customer contracts'],
        timeline: '10-15 working days',
        serviceType: 'general',
      },
      {
        title: 'Business Incorporation Services',
        slug: 'business-incorporation-services',
        description: 'Help with legal entity setup and registration, including tax IDs and documentation.',
        icon: '/assets/bookkepping-2.svg',
        link: '#',
        order: 9,
        isActive: true,
        detailedOverview: 'Start your business as a Private Limited Company, LLP, OPC, or Partnership. We handle name reservation, digital signatures, PAN/TAN allocation, and SPICe+ Ministry of Corporate Affairs (MCA) filings.',
        deliverables: ['Certificate of Incorporation (COI)', 'Memorandum & Articles of Association (MOA/AOA)', 'Company PAN & TAN Cards', 'Digital Signature Certificates (DSC)'],
        documentsRequired: ['Aadhaar & PAN of all directors/partners', 'Passport-size photos', 'Directors\' Address Proof (Bank Statement / Utility Bill)', 'Registered office address proof (Electricity bill + Rent agreement + NOC)'],
        timeline: '7-10 working days',
        serviceType: 'startup',
      },
      {
        title: 'Non-Profit Accounting',
        slug: 'non-profit-accounting',
        description: 'Specialized accounting services tailored for NGOs and charitable organizations.',
        icon: '/assets/bookkepping-2.svg',
        link: '#',
        order: 10,
        isActive: true,
        detailedOverview: 'Specialized accounting, bookkeeping, and compliance for NGOs, trusts, and societies under Section 12A, 80G, and FCRA regulations. We handle donation accounts and fund utilization audits.',
        deliverables: ['Fund Utilization Reports', 'Trust Balance Sheets & Receipts/Payments Statements', 'ITR-7 Filing & Audit Report'],
        documentsRequired: ['Trust Deed / Society Registration copy', '12A & 80G registration certificates', 'Donation register and receipts', 'Bank Statements'],
        timeline: '5-7 working days',
        serviceType: 'general',
      },
    ];
    await Service.insertMany([...services, ...registrationServices, ...returnServices, ...startupServices]);
    console.log('✅ Services seeded (including registration, return, and startup services)');

    // --- PRICING PLANS (3 plans) ---
    const pricingPlans = [
      {
        name: 'Basic Plan',
        price: 2999,
        period: 'month',
        features: ['Monthly Bookkeeping', 'GST Return Filings', 'Standard Email Support'],
        isPopular: false,
        order: 1,
      },
      {
        name: 'Standard Plan',
        price: 5999,
        period: 'month',
        features: ['Accounting & GST Filings', 'TDS Return & Reconciliation', 'Priority Phone Support'],
        isPopular: true,
        order: 2,
      },
      {
        name: 'Premium Plan',
        price: 24999,
        period: 'month',
        features: ['Full Business Outsourcing', 'Income Tax Return (ITR-6) Filing', 'Dedicated CA Support'],
        isPopular: false,
        order: 3,
      },
      {
        name: 'Incorporate Plan',
        price: 49999,
        period: 'one-time',
        features: ['Pvt Ltd Registration', '2 Digital Signatures (DSC)', 'Name Approval & DIN Allotment', 'PAN, TAN & MoA/AoA Drafting'],
        isPopular: false,
        order: 4,
      },
    ];
    await PricingPlan.insertMany(pricingPlans);
    console.log('✅ Pricing plans seeded');

    // --- FEATURES (3 cards) ---
    const features = [
      {
        title: 'Saving Strategies',
        description: 'A disciplined savings habit is your first defense against life\'s uncertainties. Beyond securing your emergency fund, savings can be strategically channeled into low-risk instruments like fixed deposits or debt mutual funds, offering steady growth without exposure to market volatility.',
        icon: '/assets/economic_15587072.png',
        order: 1,
      },
      {
        title: 'Competitive Pricing',
        description: 'Competitive pricing is the process of selecting strategic price points to best take advantage of a product or service based market relative to competition.',
        icon: '/assets/badge_11455935.png',
        order: 2,
      },
      {
        title: '24/7 Support',
        description: '24/7 support means customers can get help and find answers to questions as soon as they come up—24/7 and in real-time. Demand for 24/7 support is almost certainly going to come as your business becomes successful scaling up beyond its initial audiences and markets.',
        icon: '/assets/gear_9449778.png',
        order: 3,
      },
    ];
    await Feature.insertMany(features);
    console.log('✅ Features seeded');

    // --- NAVIGATION MENU ---
    const navMenuItems = [
      {
        label: 'Home',
        href: '/',
        order: 1,
        children: [],
        isActive: true,
      },
      {
        label: 'Start a Business',
        href: '#',
        order: 2,
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
        isActive: true,
      },
      {
        label: 'Registration',
        href: '#',
        order: 3,
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
        isActive: true,
      },
      {
        label: 'Return',
        href: '#',
        order: 4,
        children: [
          { label: 'GST Return Filing', href: '/services/gst-return-filing' },
          { label: 'Income Tax Return Filing', href: '/services/income-tax-return-filing' },
          { label: 'PF Return', href: '/services/pf-return' },
          { label: 'TDS Return', href: '/services/tds-return' },
          { label: 'E-way Bill', href: '/services/e-way-bill' },
          { label: 'PF & ESIC Return', href: '/services/pf-&-esic-return' },
        ],
        isActive: true,
      },
      {
        label: 'Accounting & Compliance',
        href: '#',
        order: 5,
        children: [
          { label: 'Accounting & Bookkeeping', href: '/services/bookkeeping-services' },
          { label: 'Payroll', href: '/services/payroll-services' },
        ],
        isActive: true,
      },
      {
        label: 'Others',
        href: '#',
        order: 6,
        children: [
          { label: 'Blog', href: '/blog' },
          { label: 'FAQs', href: '/faqs' },
          { label: 'About Us', href: '/about' },
          { label: 'Contact Us', href: '/contact' },
        ],
        isActive: true,
      },
      {
        label: 'Services',
        href: '/services',
        order: 7,
        children: [],
        isActive: true,
      },
    ];
    await NavMenu.insertMany(navMenuItems);
    console.log('✅ Navigation menu seeded');

    // --- SITE SETTINGS ---
    const siteSettings = {
      heroTitle: "SHREE CHAMUNDA ASSOCIATES",
      heroSubtitle: "THE BEST TAX CONSULTANCY FIRM IN GUJARAT",
      heroDescription:
        "Welcome to Shree Chamunda Associates, your trusted partner for comprehensive tax consultancy and financial advisory services. Founded with a commitment to excellence, we specialize in helping individuals and businesses navigate the complexities of taxation with ease and confidence.",
      phone: "+91 95109 84735",
      email: "shreechamundaassociates0905@gmail.com",
      address: "C-35, Zaveri Estate, Singarva, Kathwada, Ahmedabad, Gujarat",
      workingHours: "Mon-Sat: 10.00 AM-7.00 PM",
      companyDescription:
        "Shree Chamunda Associates is a well reputed company providing complete solutions for Tax Services.",
      socialLinks: {
        facebook: "https://www.facebook.com/share/1BRPjWQVX8/",
        instagram:
          "https://www.instagram.com/shree_chamunda_associate?igsh=Z3BlOGNhdXc4bGNm",
        whatsapp: "https://wa.me/919510984735",
      },
      offerItems: [
        "Best Taxation Service",
        "Tax Disputes",
        "Quality Control",
        "High Standard of Integrity",
        "Professional Team",
        "24/7 Legal Customer Support",
      ],
      trustDescription:
        "Confidentiality and Ethics: We adhere to the highest professional standards of confidentiality and ethics. You can trust us to handle your sensitive financial information with the utmost care and discretion.",
      trustDescription2:
        "Proactive Strategies: We believe in proactive tax planning rather than reactive measures. By anticipating changes in tax laws and identifying help. We provide ongoing tax consultation services for small business owners to help with everything from tax planning to bookkeeping. Whether you're a sole proprietor or managing a larger team.",
      trustMainText:
        "We believe that selecting the right financial services firm is paramount to the financial success!",
      quickLinks: [
        { label: "Home", url: "/" },
        { label: "About Us", url: "/about" },
        { label: "Services", url: "/services" },
        { label: "Blog", url: "/blog" },
        { label: "Contact Us", url: "/contact" },
        { label: "Client Portal", url: "/login" },
        { label: "Terms & Conditions", url: "/terms-conditions" },
        { label: "Refund Policy", url: "/refund-policy" },
      ],
      importantLinks: [
        { label: "Income Tax Dept.", url: "https://www.incometax.gov.in" },
        {
          label: "Central Board of Excise & Customs",
          url: "https://www.cbic.gov.in",
        },
        {
          label: "Ministry of Corporate Affairs",
          url: "https://www.mca.gov.in",
        },
        {
          label: "Employees Provident Fund",
          url: "https://www.epfindia.gov.in",
        },
        { label: "Goods and Services Tax", url: "https://www.gst.gov.in" },
      ],
    };
    await SiteSettings.create(siteSettings);
    console.log('✅ Site settings seeded');

    // --- FAQS (10 real-world tax consultancy FAQs) ---
    const faqs = [
      {
        question: 'Who is required to obtain GST registration?',
        answer: 'Any business whose aggregate turnover exceeds ₹40 Lakhs (for goods supply) or ₹20 Lakhs (for service providers) in a financial year is required to register for GST. Special category states have lower thresholds (₹10-20 Lakhs). Additionally, compulsory registration applies to e-commerce sellers, interstate suppliers, and casual taxable persons regardless of turnover.',
        category: 'GST',
        order: 1,
      },
      {
        question: 'What are the main types of GST returns to be filed?',
        answer: 'Regular taxpayers file GSTR-1 (details of outward supplies, monthly or quarterly depending on turnover) and GSTR-3B (summary of sales, purchase input tax credit, and payment of tax, monthly). Composition dealers file CMP-08 quarterly and GSTR-4 annually.',
        category: 'GST',
        order: 2,
      },
      {
        question: 'What is the due date for filing personal Income Tax Returns (ITR)?',
        answer: 'For individual taxpayers, HUFs, and salaried persons who do not require a tax audit, the standard deadline is July 31st of the assessment year (unless extended by the government). For businesses requiring an audit under Section 44AB, the deadline is October 31st.',
        category: 'Income Tax',
        order: 3,
      },
      {
        question: 'What documents are required to file ITR for a salaried individual?',
        answer: 'You will need Form 16 (provided by your employer), Form 26AS & AIS (Tax Credit Statements from the Income Tax Portal), PAN & Aadhaar numbers, bank account details, and proof of tax-saving investments (under sections 80C, 80D, etc.) such as ELSS, insurance receipts, PPF, or home loan interest statements.',
        category: 'Income Tax',
        order: 4,
      },
      {
        question: 'What is the difference between a Partnership Firm and an LLP?',
        answer: 'A traditional Partnership Firm has unlimited liability for all partners, meaning personal assets can be used to clear firm debts. A Limited Liability Partnership (LLP) is a body corporate where partners have limited liability (restricted to their capital contribution), and the LLP has a separate legal identity, perpetuity, and lesser personal risk.',
        category: 'Business Registration',
        order: 5,
      },
      {
        question: 'What are the benefits of registering under MSME/Udyam?',
        answer: 'MSME registration provides eligibility for collateral-free bank loans, lower interest rates, protection against delayed payments from buyers (mandatory payment within 45 days), government subsidies on patent registration, electricity concessions, and exclusive reservation in government tenders.',
        category: 'Business Registration',
        order: 6,
      },
      {
        question: 'What is a Tax Deducted at Source (TDS) Return?',
        answer: 'TDS returns are quarterly statements submitted to the Income Tax Department by any business or individual who has deducted tax at source (like salary payments, rent, professional fees). It contains details of the deductee, the amount deducted, and tax deposited. Due dates are July 31, Oct 31, Jan 31, and May 31.',
        category: 'Compliance',
        order: 7,
      },
      {
        question: 'When is a Tax Audit mandatory for a business or profession?',
        answer: 'A Tax Audit under Section 44AB is mandatory if a business\'s total turnover exceeds ₹1 Crore (or ₹10 Crores if cash transactions are under 5% of total transactions). For professionals (like doctors, CAs, engineers), an audit is required if gross receipts exceed ₹50 Lakhs.',
        category: 'Compliance',
        order: 8,
      },
      {
        question: 'What is an E-way Bill and when is it required?',
        answer: 'An E-way Bill is an electronic document generated for the movement of goods worth more than ₹50,000 in a vehicle. It must be generated prior to dispatching the goods and contains details of the consignor, consignee, items, and vehicle number.',
        category: 'GST',
        order: 9,
      },
      {
        question: 'How long do I need to preserve my bookkeeping and financial records?',
        answer: 'Under the Income Tax Act, books of accounts must be preserved for at least 6 years from the end of the relevant assessment year. Under the GST Act, records must be kept for 72 months (6 years) from the due date of filing the annual return for the relevant year.',
        category: 'Compliance',
        order: 10,
      },
    ];
    await FAQ.insertMany(faqs);
    console.log('✅ FAQs seeded');

    // --- BLOG POSTS (5 high-quality tax articles) ---
    const blogs = [
      {
        title: 'Union Budget 2026: Key Tax Reforms & Slab Changes Explained',
        summary: 'The finance minister announced critical updates to personal income tax brackets, corporate compliances, and standard deductions for 2026. Read our full analysis of how it impacts your tax liabilities.',
        content: 'The Union Budget for the fiscal year 2026 has introduced some of the most historic restructuring of personal income tax slabs and business compliance procedures in recent years. Aimed at bolstering capital market investments and giving tax relief to the middle class, the reforms warrant immediate changes to tax saving strategies.\n\n### New Personal Income Tax Slabs for 2026\nUnder the revised default New Tax Regime, the standard deduction has been increased from ₹50,000 to ₹75,000. Here are the updated tax slabs:\n- **Up to ₹3,000,000**: Nil\n- **₹300,001 to ₹700,000**: 5%\n- **₹700,001 to ₹1,000,000**: 10%\n- **₹1,000,001 to ₹1,200,000**: 15%\n- **₹1,200,001 to ₹1,500,000**: 20%\n- **Above ₹1,500,000**: 30%\n\nThis new structure translates to an automatic savings of up to ₹17,500 for salaried employees earning above ₹7 Lakhs.\n\n### Rationalization of Capital Gains Tax\nFor long-term capital gains (LTCG), the holding period definitions have been simplified. The LTCG tax rate for equity shares is adjusted to 12.5% (up from 10%), but the annual exemption limit has been increased from ₹1.25 Lakhs to ₹1.5 Lakhs. Short-term capital gains (STCG) on equity will now be taxed at a flat 20%.\n\n### Corporate Tax & Compliance Simplification\nThe corporate tax rate for foreign companies operating in India has been reduced from 40% to 35% to invite overseas investments. Furthermore, the threshold limit for presumptive taxation for MSME retailers (Section 44AD) has been raised to ₹3 Crores, provided digital transactions account for 95% of total turnover.',
        category: 'Income Tax',
        author: 'CA Rajesh Sharma, Senior Partner',
        readTime: '5 min read',
        tags: ['Budget 2026', 'Tax Slabs', 'Income Tax', 'Deductions'],
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'GST Registration Checklist for Small Businesses in 2026',
        summary: 'Planning to launch your business or crossing the GST threshold? Here is a comprehensive guide to documents, steps, and compliance requirements to secure your GSTIN seamlessly.',
        content: 'Obtaining a Goods and Services Tax Identification Number (GSTIN) is one of the crucial first milestones for a growing business in India. In 2026, the GST registration portal has become highly automated, meaning clean documentation leads to instant approval.\n\n### Who Needs GST Registration?\n1. **Turnover exceeds limit**: ₹40 Lakhs for manufacturers/traders of goods, or ₹20 Lakhs for service providers.\n2. **Inter-state sales**: If you sell goods across state borders (even online), registration is mandatory from day one.\n3. **E-commerce sellers**: Anyone listing products on platforms like Amazon, Flipkart, or Shopify.\n4. **Casual Taxable Persons**: Setting up temporary business stalls at exhibitions.\n\n### Documents Checklist\n- **PAN Card** of the Proprietor / Company / LLP.\n- **Aadhaar Card** of directors/proprietor for biometric e-verification.\n- **Proof of Business Address**: Electricity bill, municipal tax receipt, or lease agreement. If rented, a signed NOC (No Objection Certificate) from the owner is compulsory.\n- **Bank Details**: Cancelled cheque or bank statement showing IFSC.\n- **Company Incorporation Docs**: COI, Partnership deed, or LLP Agreement if applicable.\n\n### The Registration Process\nRegistering involves filling out Part-A of Form GST REG-01 on the GST Common Portal, uploading the documents, and completing Aadhaar authentication. Biometric verification may be scheduled if flagged by the risk management system. Once approved, you will receive your 15-digit GSTIN via email. Ensure you file GSTR-1 and GSTR-3B timely to avoid penalties.',
        category: 'GST',
        author: 'Pragnesh Patel, Tax Consultant',
        readTime: '6 min read',
        tags: ['GST', 'Small Business', 'Registration', 'Tax Guide'],
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'A Complete Guide to Income Tax Return (ITR) Filing in India',
        summary: 'Do not wait until the July deadline. Understand which ITR form applies to your income source, find out the key deductions under the New Tax Regime, and learn how to file smoothly.',
        content: 'Filing your Income Tax Return (ITR) is not just a legal obligation; it is a vital document for loan approvals, visa applications, and carrying forward investment losses. With the government promoting the New Tax Regime with lower tax slabs, choosing between Old and New regimes has become a key tax planning activity.\n\n### Which ITR Form is Yours?\n- **ITR-1 (Sahaj)**: For individuals having salary income, one house property, and interest income (up to ₹50 Lakhs total).\n- **ITR-2**: For capital gains, multiple house properties, or foreign assets, but no business income.\n- **ITR-3**: For individuals/HUFs who carry on a proprietary business or profession.\n- **ITR-4 (Sugam)**: For presumptive business income under section 44AD/44ADA (turnover up to ₹2 Crores).\n\n### Key Steps for ITR Filing\n1. **Gather Documents**: Form 16 from your employer, Bank Interest Certificates, Form 26AS, and AIS (Annual Information Statement).\n2. **Reconcile with AIS**: The Income Tax Department pre-populates your interest, dividend, and mutual fund transactions. Match these details with your bank books.\n3. **Select Regime**: Evaluate if Old Regime deductions (80C, HRA, Section 24) save more tax compared to the lower rates of the New Regime.\n4. **Verification**: E-verify your filed return using Aadhaar OTP within 30 days of submission to ensure processing.',
        category: 'Income Tax',
        author: 'CA Rajesh Sharma',
        readTime: '8 min read',
        tags: ['Income Tax', 'ITR', 'Salaried Class', 'Tax Saving'],
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Choosing the Right Business Structure: Partnership vs LLP vs Private Limited',
        summary: 'Startups often face a dilemma when setting up their legal structure. We compare legal liabilities, compliance costs, tax rates, and funding prospects to help you decide.',
        content: 'How you structure your business dictates your compliance costs, audit liabilities, tax brackets, and capability to raise investor capital. Here is a breakdown of the three most popular business structures for startup founders.\n\n### 1. Partnership Firm\n- **Best For**: Small shops, family businesses, local partnerships.\n- **Liability**: Unlimited. Partners are jointly and personally liable for all business debt.\n- **Compliance**: Very low. No annual MCA filing required.\n- **Investor Appeal**: None. Investors do not fund unregistered partnerships.\n\n### 2. Limited Liability Partnership (LLP)\n- **Best For**: Professional service agencies, consulting businesses, medium scale enterprises.\n- **Liability**: Limited. Partners are only liable to the extent of their agreed capital.\n- **Compliance**: Moderate. Annual filing of Form 8 and Form 11 with the Ministry of Corporate Affairs (MCA) is required.\n- **Investor Appeal**: Low. Hard to dilute shareholding or offer ESOPs.\n\n### 3. Private Limited Company (Pvt Ltd)\n- **Best For**: Scalable startups seeking venture capital or rapid expansion.\n- **Liability**: Limited to the nominal value of shareholding.\n- **Compliance**: High. Mandatory statutory audit, quarterly board meetings, annual MCA filings.\n- **Investor Appeal**: Extremely High. VC funds and angel investors only invest in Private Limited Companies because shares can be easily issued and transferred.',
        category: 'Business Startups',
        author: 'M. K. Mehta, Legal Advisor',
        readTime: '7 min read',
        tags: ['Business Setup', 'LLP', 'Company Incorporation', 'Startups'],
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Common Bookkeeping Mistakes that Hurt Small Businesses',
        summary: 'Poor financial record-keeping leads to compliance penalties and poor business decisions. Learn the critical mistakes to avoid to keep your account books audit-ready.',
        content: 'Maintaining accurate bookkeeping is like maintaining the engine of your car. If ignored, small issues build up until the engine breaks down. In business, that translates to GST notice audits, cash crunches, and incorrect tax filings.\n\n### Mistake 1: Mixing Personal and Business Finances\nUsing one credit card for grocery purchases and buying inventory makes bank reconciliation a nightmare. Always open a business current account and keep personal receipts separate.\n\n### Mistake 2: Delaying Bank Reconciliation\nReconciling your bank ledger with your actual bank statement must be done monthly, if not weekly. Delaying it leads to forgotten expenses, bank charges going unnoticed, and transaction mismatches.\n\n### Mistake 3: Poor Invoice Management & Missing Receipts\nIf tax auditors flag business expenses, you must show receipts/invoices. Store digital copies of your expense bills in structured cloud folders immediately.\n\n### Mistake 4: Not Automating Accounts\nUsing manual excel sheets increases mathematical errors and limits cash flow visibility. Invest in professional cloud software (like Tally Prime, Zoho Books, or QuickBooks) or hire outsourcing bookkeeping services.',
        category: 'Compliance',
        author: 'Shree Chamunda Associates Team',
        readTime: '5 min read',
        tags: ['Bookkeeping', 'Accounting', 'Business Growth', 'Tips'],
        image: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&w=800&q=80',
      },
    ];
    await BlogPost.insertMany(blogs);
    console.log('✅ Blog posts seeded');

    // --- TEAM MEMBERS ---
    const teamMembers = [
      {
        name: 'Pragnesh Adiyecha',
        role: 'Founder & Principal Consultant',
        specialty: 'GST & Corporate Tax Advisory',
        img: '/assets/shreeChamundalogo.png',
        order: 1,
        isActive: true
      },
      {
        name: 'CA Gaurav Vyas',
        role: 'Senior Chartered Accountant',
        specialty: 'Statutory Audits & Presumptive Taxation',
        img: '/assets/shreeChamundalogo.png',
        order: 2,
        isActive: true
      },
      {
        name: 'Shubham Adiyecha',
        role: 'Web Developer & Digital Solutions Lead',
        specialty: 'Website Development & Digital Tax Tools',
        img: '/assets/shreeChamundalogo.png',
        order: 3,
        isActive: true
      }
    ];
    await TeamMember.insertMany(teamMembers);
    console.log('✅ Team members seeded');

    // --- DEFAULT ADMIN USER ---
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync('AdminPassword2026!', salt, 100000, 64, 'sha512').toString('hex');
    await User.create({
      name: 'Admin',
      email: 'admin@shreechamunda.com',
      password: `${salt}:${hash}`,
      role: 'admin',
      phone: '+91 95109 84735',
    });
    console.log('✅ Default admin user seeded (admin@shreechamunda.com / AdminPassword2026!)');

    console.log('\n🎉 All data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
