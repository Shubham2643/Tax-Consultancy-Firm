/**
 * Industry-level return filing service definitions for Shree Chamunda Associates.
 * Each service maps to a dedicated /services/:slug page.
 */

const returnServices = [
  {
    title: 'GST Return Filing',
    slug: 'gst-return-filing',
    description: 'Monthly and quarterly GST return filing (GSTR-1, GSTR-3B) with input tax credit reconciliation.',
    icon: '/assets/bookkepping-2.svg',
    link: '/services/gst-return-filing',
    order: 21,
    isActive: true,
    serviceType: 'tax',
    timeline: '2-4 working days',
    governmentFee: 0,
    professionalFee: 1499,
    detailedOverview:
      'Filing GSTR-1 and GSTR-3B is mandatory for registered taxpayers. Shree Chamunda Associates compiles your monthly sales transactions, double checks the values against actual invoices, and reconciles your purchase ledger with GSTR-2B to maximize input tax credit (ITC). We calculate tax liabilities accurately to prevent automated departmental notices.',
    eligibility: [
      'Registered taxpayers under regular GST scheme',
      'Composition scheme dealers (quarterly CMP-08 filing)',
      'Any business engaged in interstate sales',
    ],
    keyBenefits: [
      'Avoid late fees up to ₹50 per day (₹20 for nil returns)',
      'Ensure customers claim input tax credits correctly',
      'Prevent automated GST audits and notices',
    ],
    processSteps: [
      { step: 1, title: 'Data Compilation', description: 'You share your monthly sales and purchase registers with our team.' },
      { step: 2, title: 'ITC Reconciliation', description: 'We match your purchase ledger against GSTR-2B to identify missing tax credits.' },
      { step: 3, title: 'Draft Return Review', description: 'We compute final tax liability and share draft returns for your approval.' },
      { step: 4, title: 'Portal Filing', description: 'Upon approval, we submit the returns on the GST Common Portal.' },
      { step: 5, title: 'Acknowledgment Delivery', description: 'We send you filing confirmations and payment receipts.' },
    ],
    documentsRequired: [
      'Sales Register (Excel format)',
      'Purchase Register / Input Ledger',
      'Access to GST Portal credentials',
      'Bank statement of the month',
    ],
    deliverables: [
      'GSTR-1 Filing Acknowledgment',
      'GSTR-3B Filed Return Copy',
      'Input Tax Credit Reconciliation Statement',
      'GST payment challan (if applicable)',
    ],
    faqs: [
      { question: 'What is the due date for monthly GST returns?', answer: 'GSTR-1 (sales details) is due by the 11th of the following month. GSTR-3B (tax summary & payment) is due by the 20th of the following month.' },
      { question: 'What happens if I miss a filing due date?', answer: 'Late fees of ₹50 per day (₹20 for nil returns) apply, along with 18% interest on any unpaid tax liabilities.' },
    ],
  },
  {
    title: 'Income Tax Return Filing',
    slug: 'income-tax-return-filing',
    description: 'Annual ITR filing for individuals, salaried employees, professionals, and businesses.',
    icon: '/assets/bookkepping-2.svg',
    link: '/services/income-tax-return-filing',
    order: 22,
    isActive: true,
    serviceType: 'tax',
    timeline: '3-5 working days',
    governmentFee: 0,
    professionalFee: 999,
    detailedOverview:
      'Filing ITR-1 to ITR-6 with precise tax planning. We reconcile your income registers with Form 26AS, TIS, and AIS statements to ensure error-free filing. Our team optimizes your declarations under old and new regimes to reduce tax liabilities.',
    eligibility: [
      'Salaried individuals with income above ₹2.5 Lakhs (or ₹7 Lakhs in new regime)',
      'Business owners and self-employed professionals',
      'Anyone seeking tax refunds or visa processing documents',
    ],
    keyBenefits: [
      'Secure loans and visa approvals easily',
      'Carry forward capital losses to offset future gains',
      'Claim legitimate tax refunds on TDS',
    ],
    processSteps: [
      { step: 1, title: 'Documents Submission', description: 'Upload your Form 16, bank statements, and tax-saving investment proofs.' },
      { step: 2, title: 'Tax Optimization', description: 'We evaluate benefits under both Old and New Tax Regimes to select the best one.' },
      { step: 3, title: 'Draft Computation', description: 'We calculate tax liabilities and share a draft computation summary.' },
      { step: 4, title: 'ITR Filing', description: 'We submit the return on the Income Tax e-filing portal.' },
      { step: 5, title: 'e-Verification', description: 'We complete the Aadhaar OTP e-verification to finalize processing.' },
    ],
    documentsRequired: [
      'Form 16 (for salaried persons)',
      'Bank Statement of the financial year',
      'PAN & Aadhaar card copy',
      'Investment proofs (LIC, PPF, Tuition fees, Health insurance)',
      'Capital Gains statement from broker',
    ],
    deliverables: [
      'ITR Computation Statement',
      'ITR-V Acknowledgment Copy',
      'Tax Saving recommendation report',
    ],
    faqs: [
      { question: 'What is the last date to file individual ITR?', answer: 'The standard deadline is July 31st of the assessment year. Late filing is allowed up to December 31st with penalties.' },
    ],
  },
  {
    title: 'PF Return',
    slug: 'pf-return',
    description: 'Monthly Provident Fund return filing and Electronic Challan-cum-Return (ECR) generation.',
    icon: '/assets/bookkepping-2.svg',
    link: '/services/pf-return',
    order: 23,
    isActive: true,
    serviceType: 'accounting',
    timeline: '2-3 working days',
    governmentFee: 0,
    professionalFee: 1200,
    detailedOverview:
      'Timely filing of monthly Provident Fund (PF) returns. We process salary books to calculate employee/employer contributions (12% each) and submit files to the EPFO portal, generating your payment ECR challan.',
    eligibility: [
      'Businesses employing 20 or more staff members',
      'Voluntarily PF registered establishments',
    ],
    keyBenefits: [
      'Maintain 100% compliance under labour laws',
      'Avoid heavy interest and damages u/s 7Q and 14B',
      'Provide retirement safety benefits to employees',
    ],
    processSteps: [
      { step: 1, title: 'Salary Sheet collection', description: 'You share your monthly salary spreadsheet.' },
      { step: 2, title: 'Contribution Computation', description: 'We compute employer and employee shares (12% of basic salary).' },
      { step: 3, title: 'ECR Upload', description: 'We upload the ECR file on the EPFO Unified Portal.' },
      { step: 4, title: 'Challan Generation', description: 'We generate the payment challan and share it for payment.' },
      { step: 5, title: 'Filing Receipt', description: 'We deliver filing acknowledgments after payment clearance.' },
    ],
    documentsRequired: [
      'Monthly payroll register (salary sheets)',
      'New joining employees\' details (UAN, Aadhaar)',
      'Exit dates for resigned employees',
    ],
    deliverables: [
      'Monthly ECR Receipt',
      'PF Challan Confirmation Copy',
      'PF Contribution statement',
    ],
    faqs: [
      { question: 'What is the due date for monthly PF returns?', answer: 'PF return and payment must be completed by the 15th of the following month.' },
    ],
  },
  {
    title: 'TDS Return',
    slug: 'tds-return',
    description: 'Quarterly TDS return filing (Form 24Q, 26Q, 27Q) with FVU file generation.',
    icon: '/assets/bookkepping-2.svg',
    link: '/services/tds-return',
    order: 24,
    isActive: true,
    serviceType: 'tax',
    timeline: '3-5 working days',
    governmentFee: 0,
    professionalFee: 1999,
    detailedOverview:
      'Quarterly filing of Tax Deducted at Source (TDS) returns. We match challan payments (Challan 281) against deductee PANs to ensure correct credit transfers on TRACES, generating Form 16/16A certificates.',
    eligibility: [
      'Any business or individual holding a TAN who has deducted TDS during the quarter',
    ],
    keyBenefits: [
      'Avoid late filing fees of ₹200 per day under Section 234E',
      'Enable deductees to claim TDS credits in their Form 26AS',
      'Avoid TDS interest penalties (1.5% per month)',
    ],
    processSteps: [
      { step: 1, title: 'Data Gathering', description: 'We compile details of TDS deductions, deductee PANs, and payment categories.' },
      { step: 2, title: 'Challan Verification', description: 'We match Challan 281 details on the NSDL database.' },
      { step: 3, title: 'Return Preparation', description: 'We generate the electronic return using government utility software.' },
      { step: 4, title: 'FVU File Validation', description: 'The return file is validated through the File Validation Utility (FVU).' },
      { step: 5, title: 'Return Submission', description: 'We submit the validated return on the TIN-FC portal or online.' },
    ],
    documentsRequired: [
      'PAN card of deductees',
      'Payment details (contractor fees, rent, salary)',
      'TDS payment challans (Challan 281)',
    ],
    deliverables: [
      'Form 27A Receipt of Filing',
      'FVU Validation File',
      'TDS Certificates (Form 16A/16)',
    ],
    faqs: [
      { question: 'What are the quarterly TDS return due dates?', answer: 'TDS returns are due by July 31st (Q1), October 31st (Q2), January 31st (Q3), and May 31st (Q4).' },
    ],
  },
  {
    title: 'E-way Bill',
    slug: 'e-way-bill',
    description: 'Electronic way bill generation for transport of goods exceeding value limits.',
    icon: '/assets/bookkepping-2.svg',
    link: '/services/e-way-bill',
    order: 25,
    isActive: true,
    serviceType: 'tax',
    timeline: '1 working day',
    governmentFee: 0,
    professionalFee: 499,
    detailedOverview:
      'Instant generation of Part-A and Part-B of the E-way bill for movement of goods. Shree Chamunda Associates helps transporters and suppliers comply with road-transit regulations to prevent seizure and heavy fines.',
    eligibility: [
      'Suppliers transporting goods worth more than ₹50,000 in a vehicle',
      'Transporters moving goods where the supplier has not generated the bill',
    ],
    keyBenefits: [
      'Legal transport of goods without risk of detention',
      'Avoid heavy fines (equal to 100% of tax value)',
      'Smooth transit across border checks',
    ],
    processSteps: [
      { step: 1, title: 'Invoice Details Entry', description: 'You share the tax invoice details and vehicle number.' },
      { step: 2, title: 'Portal Filing', description: 'We enter consignee/consignor details and transporter ID on the portal.' },
      { step: 3, title: 'Part-B Update', description: 'We fill out transporter vehicle number or LR details.' },
      { step: 4, title: 'Bill Generation', description: 'The 12-digit E-way Bill is generated instantly.' },
    ],
    documentsRequired: [
      'Tax Invoice / Bill of Entry / Delivery Challan',
      'Transporter Details (Transporter ID or Vehicle Number)',
      'PIN codes of dispatch and delivery locations',
    ],
    deliverables: [
      'E-way Bill Certificate (PDF)',
      'E-way Bill Number (EBN)',
    ],
    faqs: [
      { question: 'What is the validity of an E-way Bill?', answer: 'An E-way bill is valid for 1 day per 200 km (or 20 km for over-dimensional cargo). It must be updated or extended if transit is delayed.' },
    ],
  },
  {
    title: 'PF & ESIC Return',
    slug: 'pf-&-esic-return',
    description: 'Combined monthly compliance return filings for Provident Fund and Employee State Insurance.',
    icon: '/assets/bookkepping-2.svg',
    link: '/services/pf-&-esic-return',
    order: 26,
    isActive: true,
    serviceType: 'accounting',
    timeline: '3 working days',
    governmentFee: 0,
    professionalFee: 1999,
    detailedOverview:
      'Dual compliance management for both employee funds (EPFO) and healthcare cover (ESIC). We compile payroll records, compute employer/employee shares, file return sheets, and issue challans simultaneously.',
    eligibility: [
      'Establishments employing 20 or more staff members (having both PF & ESIC registrations)',
    ],
    keyBenefits: [
      'Zero late fee risk across two statutory boards',
      'Single-point payroll management and compliance reports',
      'Peace of mind for employee health and retirement safety',
    ],
    processSteps: [
      { step: 1, title: 'Payroll Validation', description: 'We audit your payroll register to ensure accurate PF/ESIC deductions.' },
      { step: 2, title: 'EPF ECR Preparation', description: 'We generate and upload PF monthly returns.' },
      { step: 3, title: 'ESIC Return Upload', description: 'We compute wages and file monthly ESIC contributions.' },
      { step: 4, title: 'Challan generation', description: 'We deliver payment challans for both portals.' },
    ],
    documentsRequired: [
      'Monthly employee attendance / leave register',
      'Salary sheet containing basic + allowances',
      'New joiner details (KYC documents)',
    ],
    deliverables: [
      'EPFO ECR acknowledgment',
      'ESIC monthly return filing statement',
      'PF & ESIC payment receipt confirmations',
    ],
    faqs: [
      { question: 'What is the due date for monthly ESI returns?', answer: 'Both PF and ESI payments and returns are due by the 15th of the following month.' },
    ],
  },
];

module.exports = returnServices;
