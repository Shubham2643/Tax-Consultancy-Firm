// Offline Fallback Service Portfolio
// Automatically referenced if the API backend is slow, times out, or offline

export const FALLBACK_SERVICES = [
  {
    "title": "Private Limited Company",
    "slug": "private-limited-company",
    "description": "Register a Private Limited Company (Pvt Ltd) to secure limited liability, raise venture capital, and build corporate credibility.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/private-limited-company",
    "order": 31,
    "isActive": true,
    "serviceType": "startup",
    "timeline": "7-10 working days",
    "governmentFee": 1500,
    "professionalFee": 5500,
    "detailedOverview": "Private Limited Company incorporation is the most popular corporate legal structure for startups and growing businesses in India. It requires a minimum of 2 directors and offers the ability to dilute shares and raise external equity funding. Shree Chamunda Associates handles SPICe+ MCA filing, name approval, DIN allocation, DSC, PAN, TAN, and Certificate of Incorporation issuance.",
    "eligibility": [
      "Minimum 2 Directors (at least one Indian resident)",
      "Minimum 2 Shareholders (can be the same as directors)",
      "A unique name that does not resemble existing companies/trademarks"
    ],
    "keyBenefits": [
      "Limited liability protection of personal assets",
      "Separate legal entity status with perpetual succession",
      "Easy transferability of shares and high investor appeal"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Name Reservation (RUN)",
        "description": "We reserve a unique name on the Ministry of Corporate Affairs (MCA) portal."
      },
      {
        "step": 2,
        "title": "DSC Acquisition",
        "description": "We procure Digital Signature Certificates (DSC) for all directors."
      },
      {
        "step": 3,
        "title": "SPICe+ Form Submission",
        "description": "We draft and file SPICe+ Part-B, Agile Pro, and e-MOA/AOA forms."
      },
      {
        "step": 4,
        "title": "MCA Approval & PAN/TAN",
        "description": "MCA verifies the application and issues the Certificate of Incorporation with PAN & TAN."
      },
      {
        "step": 5,
        "title": "Corporate Bank Account",
        "description": "We assist in opening a zero-balance business current account with partner banks."
      }
    ],
    "documentsRequired": [
      "PAN Card of all Directors",
      "Aadhaar Card of all Directors",
      "Address Proof of Directors (Bank Statement/Utility bill not older than 2 months)",
      "Registered Office Address Proof (Electricity bill / Property tax receipt)",
      "Rent Agreement & Owner NOC (if office is rented)"
    ],
    "deliverables": [
      "Certificate of Incorporation (COI)",
      "Memorandum of Association (MOA)",
      "Articles of Association (AOA)",
      "Company PAN & TAN Cards",
      "Class 3 DSC for 2 Directors"
    ],
    "faqs": [
      {
        "question": "What is the minimum capital required to start a Pvt Ltd?",
        "answer": "There is no minimum authorized capital requirement. You can start a company with an initial capital of as low as ₹10,000."
      },
      {
        "question": "Is a physical office mandatory for company registration?",
        "answer": "Yes, but it does not have to be a commercial space. A residential address (like a director's home) can serve as the registered office."
      }
    ]
  },
  {
    "title": "Limited Liability Partnership Firm",
    "slug": "limited-liability-partnership-firm",
    "description": "Incorporate an LLP to enjoy corporate status with lower compliance requirements compared to companies.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/limited-liability-partnership-firm",
    "order": 32,
    "isActive": true,
    "serviceType": "startup",
    "timeline": "8-12 working days",
    "governmentFee": 1000,
    "professionalFee": 4500,
    "detailedOverview": "An LLP combines the limited liability benefits of a company with the operational flexibility of a traditional partnership. It is ideal for service firms, consulting agencies, and family-owned enterprises. Shree Chamunda Associates drafts the LLP agreement, reserves the name, procures DSC, and files the incorporation form FiLLiP with the MCA.",
    "eligibility": [
      "Minimum 2 Designated Partners",
      "A signed LLP Agreement defining profit sharing",
      "Unique name matching MCA guidelines"
    ],
    "keyBenefits": [
      "No audit required if turnover is under ₹40 Lakhs and capital is under ₹25 Lakhs",
      "Less compliance cost than a Private Limited Company",
      "Partners are not liable for other partners' misconduct or negligence"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Name Approval (RUN-LLP)",
        "description": "Reserve a unique name for the LLP on the MCA portal."
      },
      {
        "step": 2,
        "title": "DSC Procurement",
        "description": "Acquire digital signatures for all designated partners."
      },
      {
        "step": 3,
        "title": "FiLLiP Form Filing",
        "description": "File the integration incorporation application with MCA."
      },
      {
        "step": 4,
        "title": "LLP Agreement Drafting",
        "description": "Draft the LLP agreement defining partners rights and duties."
      },
      {
        "step": 5,
        "title": "Agreement Filing (Form 3)",
        "description": "Submit the signed LLP agreement within 30 days of incorporation."
      }
    ],
    "documentsRequired": [
      "PAN Card of all Partners",
      "Aadhaar Card of all Partners",
      "Partners Address Proof (Utility bill / Bank statement)",
      "Registered Office utility bill",
      "Rent Agreement & Owner NOC"
    ],
    "deliverables": [
      "LLP Incorporation Certificate (Form 16)",
      "Approved LLP Agreement",
      "LLP PAN & TAN Cards",
      "DSC for 2 Partners"
    ],
    "faqs": [
      {
        "question": "Who can be a partner in an LLP?",
        "answer": "Any individual or body corporate (including a Private Limited Company or foreign company) can become a partner in an LLP."
      }
    ]
  },
  {
    "title": "Sole Properties",
    "slug": "sole-proprietorship",
    "description": "Start a Sole Proprietorship business with simple local registrations and a business current account.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/sole-proprietorship",
    "order": 33,
    "isActive": true,
    "serviceType": "startup",
    "timeline": "2-4 working days",
    "governmentFee": 0,
    "professionalFee": 1499,
    "detailedOverview": "Sole Proprietorship is the simplest form of business entity, owned and managed by a single individual. It does not have a separate legal identity, but is quick to start and has the lowest compliance costs. Shree Chamunda Associates sets up your proprietorship using MSME/Udyam and GST registrations to enable opening a business bank account.",
    "eligibility": [
      "A single individual who is an Indian citizen and resident"
    ],
    "keyBenefits": [
      "Easiest business structure to establish and close",
      "Complete control of all operations and profits by the owner",
      "Minimal annual compliance filings and simple income tax reporting"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "License Selection",
        "description": "We select the correct registration license (Udyam, GST, or Shop Act) based on your business."
      },
      {
        "step": 2,
        "title": "Documentation & Filing",
        "description": "We prepare the applications and upload the proprietor's KYC files."
      },
      {
        "step": 3,
        "title": "Certificate Download",
        "description": "The registration certificates are generated and downloaded."
      },
      {
        "step": 4,
        "title": "Current Account Opening",
        "description": "We assist with bank documentation to open your business current account."
      }
    ],
    "documentsRequired": [
      "PAN Card of the Proprietor",
      "Aadhaar Card of the Proprietor",
      "Office Address Proof (Electricity bill / Rent agreement)",
      "Owner NOC (if rented)",
      "Proprietor passport photo"
    ],
    "deliverables": [
      "Udyam MSME Certificate",
      "GST Registration Certificate (if applicable)",
      "Business PAN Allocation (same as owner's PAN)"
    ],
    "faqs": [
      {
        "question": "Is a separate PAN required for a Sole Proprietorship?",
        "answer": "No. A proprietorship has no separate legal existence, so the owner's personal PAN is used for all business tax filings."
      }
    ]
  },
  {
    "title": "Hindu Undividable Family(HUF)",
    "slug": "huf-registration",
    "description": "Set up a HUF entity to legally split tax liability and save taxes on family assets.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/huf-registration",
    "order": 34,
    "isActive": true,
    "serviceType": "startup",
    "timeline": "5-7 working days",
    "governmentFee": 107,
    "professionalFee": 2499,
    "detailedOverview": "Under Hindu Law, a Hindu Undivided Family (HUF) is treated as a separate legal entity for tax purposes. By creating a HUF, families can create an additional tax slab, split their income legally, and minimize tax liability under the Income Tax Act. Shree Chamunda Associates drafts the HUF deed, applies for a HUF PAN, and sets up the HUF bank account.",
    "eligibility": [
      "A family consisting of a common ancestor and all lineal descendants (Hindu, Buddhist, Sikh, Jain families)"
    ],
    "keyBenefits": [
      "Separate basic tax exemption limit (₹3 Lakhs to ₹7 Lakhs tax-free)",
      "Can own property and carry out business in the HUF name",
      "Enables savings through investments in the HUF name (80C, etc.)"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Family Structure Declaration",
        "description": "We document the family tree containing the Karta and all members."
      },
      {
        "step": 2,
        "title": "HUF Deed Drafting",
        "description": "We draft the legal HUF declaration deed detailing Karta powers."
      },
      {
        "step": 3,
        "title": "Stamp Paper Execution",
        "description": "The deed is executed and signed on a stamp paper by all members."
      },
      {
        "step": 4,
        "title": "PAN Application",
        "description": "We apply for a separate PAN card for the HUF on NSDL."
      },
      {
        "step": 5,
        "title": "HUF Account Setup",
        "description": "We set up the HUF bank current/savings account."
      }
    ],
    "documentsRequired": [
      "PAN & Aadhaar of Karta (Head of Family)",
      "Aadhaar Card of all Coparceners (family members)",
      "HUF Declaration Deed on Stamp Paper",
      "Address proof of Karta"
    ],
    "deliverables": [
      "HUF Deed Draft",
      "HUF PAN Card",
      "HUF Bank Account Opening kit"
    ],
    "faqs": [
      {
        "question": "Who is a Karta in a HUF?",
        "answer": "The Karta is the senior member (male or female) of the family who manages the HUF affairs and signs all tax papers."
      }
    ]
  },
  {
    "title": "Public Limited Company",
    "slug": "public-limited-company",
    "description": "Register a Public Limited Company to raise capital from the general public and list on stock exchanges.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/public-limited-company",
    "order": 35,
    "isActive": true,
    "serviceType": "startup",
    "timeline": "12-15 working days",
    "governmentFee": 2500,
    "professionalFee": 9999,
    "detailedOverview": "A Public Limited Company requires a minimum of 7 shareholders and 3 directors. It has no restriction on the maximum number of shareholders, making it ideal for large-scale operations seeking public capital. Shree Chamunda Associates handles SPICe+ MCA filing, DIN allocations, digital signatures, name reservation, and incorporation certificates.",
    "eligibility": [
      "Minimum 3 Directors",
      "Minimum 7 Shareholders/Subscribers",
      "Unique name ending with \"Limited\""
    ],
    "keyBenefits": [
      "Ability to raise public equity capital through IPOs",
      "High credibility with financial institutions and global partners",
      "Shares are freely transferable on stock exchanges"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Name Reservation (RUN)",
        "description": "Submit a name reservation request ending with the word \"Limited\"."
      },
      {
        "step": 2,
        "title": "DSC & DIN procurement",
        "description": "Procure digital signature certificates and Director Identification Numbers (DIN)."
      },
      {
        "step": 3,
        "title": "MCA Filing",
        "description": "File incorporation documents (SPICe+) and e-MOA/AOA forms with MCA."
      },
      {
        "step": 4,
        "title": "COI & PAN/TAN",
        "description": "The Registrar of Companies issues the COI and corporate tax IDs."
      }
    ],
    "documentsRequired": [
      "PAN Card of all Directors/Shareholders",
      "Aadhaar Card of all Directors/Shareholders",
      "Identity & Address Proof of Directors (Bank stmt/utility bill)",
      "Registered office address utility bill",
      "Rent agreement & NOC"
    ],
    "deliverables": [
      "Certificate of Incorporation (COI)",
      "Memorandum & Articles of Association (MOA/AOA)",
      "Company PAN & TAN Cards",
      "DIN for 3 Directors",
      "DSC for 3 Directors"
    ],
    "faqs": [
      {
        "question": "Is a Public Limited Company required to hold an Annual General Meeting?",
        "answer": "Yes, public companies must hold an AGM annually and submit audited balance sheets to the ROC."
      }
    ]
  },
  {
    "title": "One Person Company(OPC)",
    "slug": "one-person-company",
    "description": "Register an OPC to secure company status with a single director/shareholder.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/one-person-company",
    "order": 36,
    "isActive": true,
    "serviceType": "startup",
    "timeline": "7-10 working days",
    "governmentFee": 1200,
    "professionalFee": 5000,
    "detailedOverview": "A One Person Company (OPC) is a corporate structure that allows a sole entrepreneur to operate a corporate entity with limited liability. It requires only 1 director and 1 nominee. Shree Chamunda Associates manages SPICe+ MCA filing, nominee consent registration, DIN allocation, name approval, and certificate of incorporation.",
    "eligibility": [
      "1 Director (must be Indian resident and citizen)",
      "1 Nominee member who takes over in case of death/disability",
      "A unique company name"
    ],
    "keyBenefits": [
      "Limited liability protection of a corporation for a single owner",
      "Lesser compliances compared to a Private Limited Company",
      "Easy conversion to a Private Limited Company as business grows"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Name Reservation",
        "description": "Submit name reservation application on the MCA portal."
      },
      {
        "step": 2,
        "title": "DSC Procurement",
        "description": "Get digital signatures for director and nominee."
      },
      {
        "step": 3,
        "title": "SPICe+ Incorporation Filing",
        "description": "File the incorporation documents along with nominee consent forms."
      },
      {
        "step": 4,
        "title": "COI & Tax IDs",
        "description": "Obtain Certificate of Incorporation along with PAN & TAN."
      }
    ],
    "documentsRequired": [
      "PAN Card of Director & Nominee",
      "Aadhaar Card of Director & Nominee",
      "Identity & Address Proof of Director & Nominee",
      "Registered office utility bill",
      "Rent agreement & NOC"
    ],
    "deliverables": [
      "Certificate of Incorporation (COI)",
      "e-MOA & e-AOA",
      "Company PAN & TAN Cards",
      "DSC for 1 Director & Nominee"
    ],
    "faqs": [
      {
        "question": "Can a person incorporate more than one OPC?",
        "answer": "No. An Indian citizen and resident is only allowed to incorporate one OPC at a time."
      }
    ]
  },
  {
    "title": "Partnership Firm",
    "slug": "partnership-firm",
    "description": "Register a Partnership Firm to start a co-owned business with a signed partnership deed.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/partnership-firm",
    "order": 37,
    "isActive": true,
    "serviceType": "startup",
    "timeline": "5-8 working days",
    "governmentFee": 500,
    "professionalFee": 3000,
    "detailedOverview": "A Partnership Firm is formed when two or more persons agree to share the profits of a business. It is governed by the Indian Partnership Act 1932. Shree Chamunda Associates drafts the partnership deed, executes it on stamp paper, registers it with the Registrar of Firms (ROF) in Gujarat, and obtains the firm's PAN card.",
    "eligibility": [
      "Minimum 2 Partners",
      "A signed Partnership Deed defining profit/loss ratios",
      "Maximum limit of 50 partners"
    ],
    "keyBenefits": [
      "Easy to set up and manage with a signed deed",
      "Lowest setup cost for co-owned businesses",
      "Decision-making shared among partners"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Deed Drafting",
        "description": "We draft the partnership deed defining partner roles and shares."
      },
      {
        "step": 2,
        "title": "Deed Execution",
        "description": "Partners execute the deed on a stamp paper of appropriate value."
      },
      {
        "step": 3,
        "title": "ROF Filing",
        "description": "We submit registration application with the Registrar of Firms."
      },
      {
        "step": 4,
        "title": "PAN Application",
        "description": "We apply for a separate firm PAN card on NSDL."
      }
    ],
    "documentsRequired": [
      "PAN & Aadhaar of all Partners",
      "Partners Address Proof (Utility bill / Bank statement)",
      "Office Address Proof (Electricity bill / Rent agreement)",
      "NOC from property owner",
      "Partnership deed executed on stamp paper"
    ],
    "deliverables": [
      "Partnership Deed Draft",
      "NSDL Firm PAN Card",
      "Registrar of Firms (ROF) Registration Certificate"
    ],
    "faqs": [
      {
        "question": "Is ROF registration mandatory for partnerships?",
        "answer": "Registration with ROF is not legally mandatory, but unregistered firms cannot file lawsuits against third parties or partners in court."
      }
    ]
  },
  {
    "title": "E-commerce Business",
    "slug": "e-commerce-business",
    "description": "Start selling online through Amazon, Flipkart, or your own Shopify store with GSTIN and business setup.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/e-commerce-business",
    "order": 38,
    "isActive": true,
    "serviceType": "startup",
    "timeline": "5-7 working days",
    "governmentFee": 0,
    "professionalFee": 2499,
    "detailedOverview": "Selling goods or services online requires a structural business setup (Pvt Ltd, LLP, or Proprietorship) along with compulsory GST registration. Shree Chamunda Associates sets up your legal structure, obtains your GSTIN, registers your trademark, and helps you configure business payment gateways.",
    "eligibility": [
      "Any individual or entity starting an online retail, logistics, or digital marketplace business"
    ],
    "keyBenefits": [
      "Compulsory GST registration handled seamlessly",
      "Legal structure optimized for marketplace onboarding (Amazon/Flipkart)",
      "Brand protection through trademark application"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Business Structure Setup",
        "description": "We set up a proprietorship, company, or LLP."
      },
      {
        "step": 2,
        "title": "GST Registration",
        "description": "We register the business for GST, which is mandatory for e-commerce."
      },
      {
        "step": 3,
        "title": "Bank Account Setup",
        "description": "We open a current bank account for digital transactions."
      },
      {
        "step": 4,
        "title": "Brand Trademark",
        "description": "We file a trademark application to protect your brand name online."
      }
    ],
    "documentsRequired": [
      "Aadhaar & PAN of founders",
      "Office premises address proof",
      "Bank current account statement/cancelled cheque",
      "Owner NOC (if rented)"
    ],
    "deliverables": [
      "Business Incorporation Certificate",
      "GST Registration Certificate",
      "Trademark Application copy",
      "Payment Gateway integration guide"
    ],
    "faqs": [
      {
        "question": "Is GST mandatory for selling on Amazon?",
        "answer": "Yes, under GST laws, any supplier selling goods via e-commerce operators must obtain compulsory GST registration regardless of turnover."
      }
    ]
  },
  {
    "title": "Government Registration",
    "slug": "government-registration",
    "description": "Complete government registration services for businesses — from entity setup to statutory licenses and compliance certificates.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/government-registration",
    "order": 11,
    "isActive": true,
    "serviceType": "registration",
    "timeline": "7-15 working days",
    "governmentFee": 2500,
    "professionalFee": 4500,
    "detailedOverview": "Government Registration encompasses all mandatory statutory registrations required to legally operate a business in India. Whether you are launching a new venture or formalizing an existing one, Shree Chamunda Associates handles end-to-end registration with central and state authorities — including entity incorporation, trade licenses, shop & establishment registration, and professional tax enrollment. Our team ensures every application is filed correctly the first time, minimizing rejections and delays.",
    "eligibility": [
      "Individuals or entities starting a new business in India",
      "Existing unregistered businesses seeking legal compliance",
      "Freelancers and professionals requiring trade licenses",
      "Retail shops, restaurants, and service establishments",
      "Manufacturing units requiring factory/establishment licenses"
    ],
    "keyBenefits": [
      "Legal recognition to operate your business without penalties",
      "Eligibility for government tenders and MSME benefits",
      "Smooth opening of business bank accounts",
      "Protection against local authority inspections and fines",
      "Foundation for GST, PF, and other statutory registrations"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Consultation & Document Review",
        "description": "We assess your business type, location, and applicable registrations. You receive a customized checklist of required documents."
      },
      {
        "step": 2,
        "title": "Application Preparation",
        "description": "Our team prepares and verifies all application forms, affidavits, and supporting documents per the relevant authority guidelines."
      },
      {
        "step": 3,
        "title": "Online / Offline Filing",
        "description": "Applications are submitted to the Municipal Corporation, Labour Department, or relevant state portal with proper fee payment."
      },
      {
        "step": 4,
        "title": "Inspection & Verification",
        "description": "We coordinate site inspections (if required) and respond to any queries raised by the registering authority."
      },
      {
        "step": 5,
        "title": "Certificate Delivery",
        "description": "Upon approval, we deliver your registration certificates and guide you on renewal timelines and ongoing compliance."
      }
    ],
    "documentsRequired": [
      "Aadhaar & PAN of proprietor/directors",
      "Passport-size photographs",
      "Business address proof (rent agreement + NOC from owner)",
      "Utility bill of registered office (not older than 2 months)",
      "Partnership deed / COI (if applicable)",
      "Identity proof of all partners/directors",
      "Nature of business declaration"
    ],
    "deliverables": [
      "Shop & Establishment Registration Certificate",
      "Trade License (if applicable)",
      "Professional Tax Enrollment Certificate",
      "Compliance calendar with renewal dates",
      "Digital copies of all approved certificates"
    ],
    "faqs": [
      {
        "question": "Which government registrations are mandatory for a new shop?",
        "answer": "At minimum, most businesses need Shop & Establishment registration under the state Shops Act, a trade license from the local municipality, and Professional Tax registration. Manufacturing units may additionally require factory licenses."
      },
      {
        "question": "Can I operate without government registration?",
        "answer": "Operating without required registrations exposes you to penalties, closure notices, and inability to open business bank accounts or claim input tax credits. We strongly recommend completing all applicable registrations before commencing operations."
      },
      {
        "question": "How long does government registration take in Gujarat?",
        "answer": "Shop & Establishment registration in Gujarat typically takes 5-7 working days. Trade licenses may take 10-15 days depending on the municipal corporation and whether a site inspection is required."
      }
    ]
  },
  {
    "title": "GST Registration",
    "slug": "gst-registration",
    "description": "Fast, hassle-free GSTIN registration with Aadhaar authentication — mandatory for businesses crossing turnover thresholds or engaged in interstate trade.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/gst-registration",
    "order": 12,
    "isActive": true,
    "serviceType": "registration",
    "timeline": "3-7 working days",
    "governmentFee": 0,
    "professionalFee": 1999,
    "detailedOverview": "Goods and Services Tax (GST) registration grants your business a unique 15-digit GSTIN, enabling legal collection and remittance of GST, claiming input tax credit on purchases, and issuing tax-compliant invoices. Shree Chamunda Associates handles the entire GST REG-01 application process on the GST Common Portal — from document compilation and Aadhaar-based e-KYC to responding to department queries and obtaining your GSTIN certificate.",
    "eligibility": [
      "Businesses with annual turnover exceeding ₹40 Lakhs (goods) or ₹20 Lakhs (services)",
      "Inter-state suppliers regardless of turnover",
      "E-commerce sellers on Amazon, Flipkart, Meesho, etc.",
      "Casual taxable persons and non-resident taxable persons",
      "Input Service Distributors and agents of suppliers"
    ],
    "keyBenefits": [
      "Legal interstate and intrastate sales with GST invoices",
      "Claim input tax credit (ITC) on business purchases",
      "Enhanced credibility with B2B clients and government tenders",
      "Mandatory for e-commerce marketplace listings",
      "Avoid penalties up to 100% of tax due for non-registration"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Document Collection",
        "description": "Gather PAN, Aadhaar, address proof, bank details, and business constitution documents as per your entity type."
      },
      {
        "step": 2,
        "title": "Part-A Filing (TRN Generation)",
        "description": "We file Part-A of Form GST REG-01 on the GST portal to generate your Temporary Reference Number (TRN)."
      },
      {
        "step": 3,
        "title": "Part-B & Document Upload",
        "description": "Complete Part-B with business details, authorized signatory info, and upload scanned documents in prescribed formats."
      },
      {
        "step": 4,
        "title": "Aadhaar Authentication",
        "description": "Proprietor/directors complete Aadhaar OTP verification. Biometric verification is scheduled only if flagged by the system."
      },
      {
        "step": 5,
        "title": "GSTIN Allotment",
        "description": "Upon approval, your GSTIN certificate (REG-06) is issued. We configure your first return filing calendar."
      }
    ],
    "documentsRequired": [
      "PAN card of business/proprietor",
      "Aadhaar card of authorized signatory",
      "Proof of business address (electricity bill + rent agreement + NOC)",
      "Bank account proof (cancelled cheque or statement)",
      "Certificate of Incorporation / Partnership deed (if applicable)",
      "Board resolution / authorization letter for signatory",
      "Digital photograph of proprietor/director"
    ],
    "deliverables": [
      "GSTIN Certificate (Form REG-06)",
      "Login credentials for GST portal",
      "GST registration acknowledgment",
      "First-year return filing schedule",
      "Invoice format template with GST fields"
    ],
    "faqs": [
      {
        "question": "Is GST registration free?",
        "answer": "Yes, there is no government fee for GST registration. Our professional fee covers document preparation, portal filing, Aadhaar authentication support, and query resolution."
      },
      {
        "question": "Can I register for GST voluntarily below the threshold?",
        "answer": "Absolutely. Voluntary registration is common for startups wanting to claim ITC, sell on e-commerce platforms, or appear more credible to corporate clients."
      },
      {
        "question": "What happens after GST registration?",
        "answer": "You must file GSTR-1 (outward supplies) and GSTR-3B (summary return with tax payment) monthly or quarterly based on your turnover. We offer ongoing GST return filing services."
      }
    ]
  },
  {
    "title": "Import Export Code Registration",
    "slug": "import-export-code-registration",
    "description": "Obtain your 10-digit IEC code from DGFT for legal import and export of goods and services from India.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/import-export-code-registration",
    "order": 13,
    "isActive": true,
    "serviceType": "registration",
    "timeline": "2-5 working days",
    "governmentFee": 500,
    "professionalFee": 2499,
    "detailedOverview": "The Import Export Code (IEC) is a 10-digit identification number issued by the Directorate General of Foreign Trade (DGFT), mandatory for any business or individual importing or exporting goods and services from India. Without an IEC, customs clearance is impossible. Shree Chamunda Associates manages the complete online application on the DGFT portal — including entity verification, document upload, fee payment, and IEC certificate download.",
    "eligibility": [
      "Businesses importing raw materials or finished goods",
      "Exporters of goods, software, or services",
      "Manufacturers seeking global market access",
      "E-commerce exporters shipping products abroad",
      "Individuals engaged in international trade (with valid PAN)"
    ],
    "keyBenefits": [
      "Mandatory for customs clearance at ports and airports",
      "Avail export incentives under MEIS/RoDTEP schemes",
      "Open foreign currency accounts with banks",
      "Participate in international trade fairs and exhibitions",
      "Lifetime validity — no renewal required (updated annually)"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Entity Verification",
        "description": "We verify your PAN, entity type, and bank details against DGFT requirements before initiating the application."
      },
      {
        "step": 2,
        "title": "Online Application Filing",
        "description": "Application is filed on the DGFT portal with business details, NIC codes, and authorized person information."
      },
      {
        "step": 3,
        "title": "Document Upload & Fee Payment",
        "description": "Required documents are uploaded in prescribed format and government fee of ₹500 is paid online."
      },
      {
        "step": 4,
        "title": "DGFT Processing",
        "description": "DGFT verifies the application. We monitor status and respond to any clarification requests promptly."
      },
      {
        "step": 5,
        "title": "IEC Certificate Issuance",
        "description": "Your 10-digit IEC is generated and the certificate is downloaded. We guide you on AD code registration with customs."
      }
    ],
    "documentsRequired": [
      "PAN card of individual/firm/company",
      "Aadhaar card of applicant/proprietor",
      "Cancelled cheque or bank certificate",
      "Proof of business address",
      "Certificate of Incorporation (for companies/LLPs)",
      "Partnership deed (for partnership firms)",
      "Digital photograph and signature"
    ],
    "deliverables": [
      "10-digit IEC certificate from DGFT",
      "IEC registration acknowledgment",
      "AD code registration guidance for customs",
      "Export documentation checklist",
      "DGFT portal login assistance"
    ],
    "faqs": [
      {
        "question": "Is IEC required for services export only?",
        "answer": "Yes, IEC is mandatory even if you export only services (IT, consulting, etc.) and not physical goods. However, individuals exporting services for personal use may be exempt in certain cases."
      },
      {
        "question": "Does IEC need renewal?",
        "answer": "IEC has lifetime validity but must be updated annually on the DGFT portal between April-June. Failure to update may lead to deactivation."
      },
      {
        "question": "Can a proprietorship get IEC?",
        "answer": "Yes, proprietorships, partnerships, LLPs, and companies can all obtain IEC using their respective PAN numbers."
      }
    ]
  },
  {
    "title": "Startup-India Registration",
    "slug": "startup-india-registration",
    "description": "Get DPIIT Startup India recognition — unlock tax holidays, IPR fee rebates, self-certification compliance, and easier funding access.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/startup-india-registration",
    "order": 14,
    "isActive": true,
    "serviceType": "registration",
    "timeline": "5-10 working days",
    "governmentFee": 0,
    "professionalFee": 3499,
    "detailedOverview": "Startup India is the Government of India's flagship initiative to build a robust startup ecosystem. DPIIT (Department for Promotion of Industry and Internal Trade) recognition grants your startup access to a 3-year income tax holiday under Section 80-IAC, 80% rebate on patent/trademark fees, self-certification under 6 labour and 3 environment laws, and fast-track patent examination. Shree Chamunda Associates prepares your pitch deck summary, innovation narrative, and DPIIT application to maximize approval chances.",
    "eligibility": [
      "Entity incorporated as Private Limited, LLP, or Registered Partnership",
      "Age of entity not exceeding 10 years from date of incorporation",
      "Annual turnover not exceeding ₹100 Crores in any financial year",
      "Working towards innovation, development, or improvement of products/processes",
      "Not formed by splitting or reconstructing an existing business"
    ],
    "keyBenefits": [
      "3-year tax holiday under Section 80-IAC (subject to approval)",
      "80% rebate on patent filing fees and 50% on trademark fees",
      "Self-certification compliance under labour and environment laws",
      "Exemption from prior experience/turnover criteria in government tenders",
      "Access to Fund of Funds for Startups (FFS) and SIDBI schemes"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Eligibility Assessment",
        "description": "We verify your entity type, age, turnover, and innovation criteria against DPIIT guidelines."
      },
      {
        "step": 2,
        "title": "Innovation Narrative Preparation",
        "description": "Our team drafts the innovation description, business model summary, and scalability statement required by DPIIT."
      },
      {
        "step": 3,
        "title": "DPIIT Portal Registration",
        "description": "Application is filed on the Startup India portal with entity details, director info, and supporting documents."
      },
      {
        "step": 4,
        "title": "Certificate of Recognition",
        "description": "Upon approval, DPIIT issues the Startup Recognition Certificate with your unique recognition number."
      },
      {
        "step": 5,
        "title": "Post-Recognition Advisory",
        "description": "We guide you on applying for Section 80-IAC tax exemption and availing IPR fee concessions."
      }
    ],
    "documentsRequired": [
      "Certificate of Incorporation / LLP Agreement",
      "PAN card of entity",
      "Brief write-up on innovation and business model",
      "Website link or pitch deck (if available)",
      "Directors/partners list with Aadhaar and PAN",
      "Proof of concept or prototype details (recommended)",
      "Authorization letter for applicant"
    ],
    "deliverables": [
      "DPIIT Startup Recognition Certificate",
      "Startup India portal profile setup",
      "Section 80-IAC application guidance",
      "IPR fee concession application support",
      "Compliance self-certification templates"
    ],
    "faqs": [
      {
        "question": "Is Startup India registration the same as company registration?",
        "answer": "No. Company registration (via MCA) creates your legal entity. Startup India recognition is an additional DPIIT certification that unlocks startup-specific benefits for eligible entities."
      },
      {
        "question": "Can a sole proprietorship get Startup India recognition?",
        "answer": "No. Only Private Limited Companies, LLPs, and Registered Partnership Firms are eligible for DPIIT recognition."
      },
      {
        "question": "How long is the tax holiday valid?",
        "answer": "Approved startups can claim 100% deduction on profits for 3 consecutive years out of 10 years since incorporation, under Section 80-IAC."
      }
    ]
  },
  {
    "title": "Udhyam-MSME Registration",
    "slug": "udhyam-msme-registration",
    "description": "Free Udyam MSME registration for micro, small, and medium enterprises — unlock collateral-free loans, subsidies, and tender preferences.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/udhyam-msme-registration",
    "order": 15,
    "isActive": true,
    "serviceType": "registration",
    "timeline": "1-3 working days",
    "governmentFee": 0,
    "professionalFee": 999,
    "detailedOverview": "Udyam Registration (formerly Udyog Aadhaar) is the official MSME registration on the Udyam portal, based entirely on self-declaration with Aadhaar and PAN verification. Registered MSMEs gain access to collateral-free loans under CGTMSE, lower interest rates, protection against delayed payments (45-day rule), electricity tariff concessions, and exclusive reservation in government procurement. Shree Chamunda Associates handles Aadhaar OTP verification, NIC code selection, and Udyam certificate generation.",
    "eligibility": [
      "Micro: Investment ≤ ₹1 Cr and turnover ≤ ₹5 Cr",
      "Small: Investment ≤ ₹10 Cr and turnover ≤ ₹50 Cr",
      "Medium: Investment ≤ ₹50 Cr and turnover ≤ ₹250 Cr",
      "Proprietorships, partnerships, LLPs, and companies",
      "Both manufacturing and service enterprises"
    ],
    "keyBenefits": [
      "Collateral-free bank loans up to ₹2 Crores under CGTMSE",
      "1% exemption on interest rate on OD (as per RBI guidelines)",
      "Protection against delayed payments beyond 45 days",
      "50% subsidy on patent registration fees",
      "Priority sector lending and ISO certification reimbursement"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Classification Assessment",
        "description": "We determine your MSME category (Micro/Small/Medium) based on investment in plant & machinery and annual turnover."
      },
      {
        "step": 2,
        "title": "Aadhaar & PAN Verification",
        "description": "Proprietor's Aadhaar is verified via OTP. PAN of entity is validated against IT records automatically."
      },
      {
        "step": 3,
        "title": "Udyam Portal Filing",
        "description": "Application is filed on udyamregistration.gov.in with NIC code, activity details, and investment/turnover declarations."
      },
      {
        "step": 4,
        "title": "Certificate Generation",
        "description": "Udyam Registration Certificate with QR code and unique Udyam Number is generated instantly upon successful filing."
      },
      {
        "step": 5,
        "title": "Benefit Activation Guide",
        "description": "We provide guidance on availing CGTMSE loans, updating Udyam annually, and linking with GSTIN."
      }
    ],
    "documentsRequired": [
      "Aadhaar number of proprietor/authorized signatory",
      "PAN of individual (proprietorship) or entity (company/LLP)",
      "GSTIN (if registered — auto-fetched)",
      "Bank account number and IFSC",
      "NIC code for business activity",
      "Investment and turnover self-declaration"
    ],
    "deliverables": [
      "Udyam Registration Certificate with QR code",
      "Unique Udyam Registration Number (URN)",
      "MSME classification confirmation",
      "CGTMSE loan application guidance",
      "Annual update reminder setup"
    ],
    "faqs": [
      {
        "question": "Is Udyam registration really free?",
        "answer": "Yes, the government charges zero fee for Udyam registration. Our fee covers NIC code selection, portal filing, Aadhaar OTP assistance, and post-registration advisory."
      },
      {
        "question": "Can I register without GST?",
        "answer": "Yes, GST registration is not mandatory for Udyam registration. However, if you have a GSTIN, it is auto-linked and simplifies verification."
      },
      {
        "question": "Do I need to renew Udyam registration?",
        "answer": "No renewal is required, but you must update your Udyam registration if your enterprise is reclassified (e.g., from Micro to Small) due to increased investment or turnover."
      }
    ]
  },
  {
    "title": "Professional Tax Registration",
    "slug": "professional-tax-registration",
    "description": "Mandatory Professional Tax enrollment and registration for employers and professionals in applicable states including Gujarat.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/professional-tax-registration",
    "order": 16,
    "isActive": true,
    "serviceType": "registration",
    "timeline": "3-7 working days",
    "governmentFee": 500,
    "professionalFee": 1499,
    "detailedOverview": "Professional Tax (PT) is a state-level tax levied on professions, trades, and employment. In Gujarat, every employer with salaried employees and every professional (tax practitioner, doctor, lawyer, consultant) must obtain Professional Tax Enrollment (PTEC) and Registration (PTRC) certificates. Non-compliance attracts penalties up to ₹5,000 per month. Shree Chamunda Associates handles enrollment on the Gujarat commercial tax portal, EC registration, and monthly PT return setup.",
    "eligibility": [
      "Employers with one or more salaried employees in Gujarat",
      "Self-employed professionals earning above threshold",
      "Companies, LLPs, and partnership firms with employees",
      "Contractors and traders with salaried staff",
      "Branches operating in multiple PT-applicable states"
    ],
    "keyBenefits": [
      "Legal compliance with state Professional Tax Act",
      "Avoid penalties and prosecution for non-registration",
      "Smooth payroll processing with PT deductions",
      "Required for government and corporate vendor empanelment",
      "Enables PT return filing and certificate generation"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Applicability Check",
        "description": "We determine whether you need PTEC (employer enrollment), PTRC (employer registration), or both based on your entity and employee count."
      },
      {
        "step": 2,
        "title": "Portal Registration",
        "description": "Entity is registered on the Gujarat Professional Tax portal with PAN, address, and business details."
      },
      {
        "step": 3,
        "title": "Certificate Application",
        "description": "Enrollment and registration applications are filed with applicable government fees."
      },
      {
        "step": 4,
        "title": "EC Generation",
        "description": "Electronic Certificate (EC) is generated upon approval with your PT registration number."
      },
      {
        "step": 5,
        "title": "Return Filing Setup",
        "description": "We configure monthly PT return filing schedule and employee PT slab calculations."
      }
    ],
    "documentsRequired": [
      "PAN card of entity",
      "Certificate of Incorporation / registration proof",
      "Address proof of business premises",
      "List of employees with salary details",
      "Bank account details",
      "Authorized signatory Aadhaar and PAN",
      "GSTIN certificate (if available)"
    ],
    "deliverables": [
      "Professional Tax Enrollment Certificate (PTEC)",
      "Professional Tax Registration Certificate (PTRC)",
      "EC (Electronic Certificate) from commercial tax dept.",
      "Monthly PT return filing calendar",
      "Employee PT deduction slab chart"
    ],
    "faqs": [
      {
        "question": "What is the Professional Tax rate in Gujarat?",
        "answer": "For employees, PT ranges from ₹0 to ₹200 per month based on salary slabs (max ₹2,500/year). Employers pay a flat ₹2,500/year enrollment fee under PTEC."
      },
      {
        "question": "Is PT applicable to freelancers?",
        "answer": "Self-employed professionals like CAs, doctors, and lawyers must enroll under PTEC and pay the annual professional tax in applicable states including Gujarat."
      },
      {
        "question": "How often are PT returns filed?",
        "answer": "Professional Tax returns are filed monthly in Gujarat, with annual payment of tax deducted from employees' salaries."
      }
    ]
  },
  {
    "title": "PAN Application",
    "slug": "pan-application",
    "description": "New PAN card application or correction for individuals, HUFs, companies, and firms — essential for all financial and tax transactions.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/pan-application",
    "order": 17,
    "isActive": true,
    "serviceType": "registration",
    "timeline": "7-15 working days",
    "governmentFee": 107,
    "professionalFee": 499,
    "detailedOverview": "Permanent Account Number (PAN) is a 10-character alphanumeric identifier issued by the Income Tax Department, mandatory for filing income tax returns, opening bank accounts, high-value transactions, and business registrations. Shree Chamunda Associates handles new PAN applications (Form 49A for Indian citizens, 49AA for foreigners) and PAN correction/reprint requests through NSDL or UTIITSL — with document verification, online filing, and status tracking until card delivery.",
    "eligibility": [
      "Indian citizens without an existing PAN",
      "NRIs requiring PAN for property or investment in India",
      "Minors (applied by parent/guardian)",
      "Companies, LLPs, firms, and trusts needing entity PAN",
      "Individuals requiring PAN correction (name, DOB, address)"
    ],
    "keyBenefits": [
      "Mandatory for income tax return filing",
      "Required for bank account opening and DEMAT accounts",
      "Needed for property transactions above ₹10 Lakhs",
      "Essential for GST, TAN, and business registrations",
      "Serves as universal identity proof for financial transactions"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Application Type Selection",
        "description": "We determine the correct form (49A/49AA) and category (individual, company, HUF, etc.) for your application."
      },
      {
        "step": 2,
        "title": "Document Preparation",
        "description": "Identity proof, address proof, and date of birth proof are verified and scanned as per NSDL/UTIITSL specifications."
      },
      {
        "step": 3,
        "title": "Online Application Filing",
        "description": "Application is filed online with accurate details. Acknowledgment number is generated for tracking."
      },
      {
        "step": 4,
        "title": "Document Dispatch / e-KYC",
        "description": "Physical documents are dispatched to NSDL/UTIITSL (if required) or Aadhaar-based e-KYC is completed for instant processing."
      },
      {
        "step": 5,
        "title": "PAN Card Delivery",
        "description": "PAN is allotted and e-PAN is emailed. Physical card is dispatched to your registered address within 15-20 days."
      }
    ],
    "documentsRequired": [
      "Proof of Identity (Aadhaar, passport, voter ID, driving license)",
      "Proof of Address (Aadhaar, utility bill, bank statement)",
      "Proof of Date of Birth (birth certificate, matriculation certificate)",
      "Passport-size photograph (for physical card)",
      "COI / registration certificate (for entities)",
      "Signed application form (Form 49A/49AA)"
    ],
    "deliverables": [
      "PAN allotment letter",
      "e-PAN PDF via email",
      "Physical PAN card (dispatched by NSDL/UTIITSL)",
      "Application acknowledgment with tracking number",
      "PAN verification on IT portal"
    ],
    "faqs": [
      {
        "question": "How long does a new PAN take?",
        "answer": "With Aadhaar-based e-KYC, PAN is often allotted within 2-4 days. Physical card delivery takes an additional 10-15 days. Without e-KYC, processing takes 15-20 working days."
      },
      {
        "question": "Can I have two PAN cards?",
        "answer": "No. Holding more than one PAN is illegal and punishable with a fine up to ₹10,000. If you have duplicate PANs, we assist with surrender proceedings."
      },
      {
        "question": "Is PAN required for minors?",
        "answer": "PAN is not mandatory for minors unless they have taxable income. However, many parents apply for PAN early for investment in the child's name."
      }
    ]
  },
  {
    "title": "TAN Application",
    "slug": "tan-application",
    "description": "Tax Deduction and Collection Account Number (TAN) application for businesses deducting TDS on salary, rent, professional fees, and payments.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/tan-application",
    "order": 18,
    "isActive": true,
    "serviceType": "registration",
    "timeline": "5-10 working days",
    "governmentFee": 65,
    "professionalFee": 799,
    "detailedOverview": "Tax Deduction and Collection Account Number (TAN) is a 10-digit alphanumeric number required by every person who deducts or collects tax at source (TDS/TCS). Without TAN, TDS returns cannot be filed and penalties of ₹10,000 apply. Shree Chamunda Associates handles Form 49B application through NSDL, ensuring accurate category selection, address details, and timely TAN allotment for your business.",
    "eligibility": [
      "Employers deducting TDS on employee salaries",
      "Businesses paying rent exceeding ₹50,000/month",
      "Companies deducting TDS on professional/contractor fees",
      "Buyers deducting TDS on property purchases (Section 194-IA)",
      "Any entity required to deduct or collect tax at source"
    ],
    "keyBenefits": [
      "Mandatory for filing quarterly TDS returns (24Q, 26Q, 27Q)",
      "Enables generation of TDS certificates (Form 16/16A)",
      "Avoid penalty of ₹10,000 for failure to obtain TAN",
      "Required for depositing TDS through Challan 281",
      "Essential for government and corporate vendor payments"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Requirement Assessment",
        "description": "We identify all TDS sections applicable to your business (salary, rent, professional fees, etc.)."
      },
      {
        "step": 2,
        "title": "Form 49B Preparation",
        "description": "Application is prepared with entity details, category of deductor, and communication address."
      },
      {
        "step": 3,
        "title": "NSDL Portal Filing",
        "description": "Form 49B is filed online on the NSDL TAN portal with government fee payment of ₹65 (including GST)."
      },
      {
        "step": 4,
        "title": "TAN Allotment",
        "description": "NSDL processes the application and allots TAN, communicated via email and postal letter."
      },
      {
        "step": 5,
        "title": "TRACES Registration",
        "description": "We assist with TRACES portal registration for TDS return filing and Form 16/16A generation."
      }
    ],
    "documentsRequired": [
      "PAN card of entity",
      "Certificate of Incorporation / registration proof",
      "Address proof of registered office",
      "Authorized signatory proof (Aadhaar/PAN)",
      "Contact details (email and mobile)",
      "Business activity description"
    ],
    "deliverables": [
      "TAN allotment letter from NSDL",
      "TAN confirmation on IT portal",
      "TRACES portal registration assistance",
      "TDS return filing calendar (24Q/26Q/27Q)",
      "Challan 281 payment guide"
    ],
    "faqs": [
      {
        "question": "Is TAN different from PAN?",
        "answer": "Yes. PAN identifies the entity for income tax purposes. TAN is specifically for tax deduction/collection at source. A business needs both — PAN for its own taxes and TAN for deducting TDS on payments."
      },
      {
        "question": "Can I use PAN instead of TAN for TDS?",
        "answer": "No. Quoting PAN instead of TAN in TDS statements attracts a penalty of ₹10,000 under Section 272BB."
      },
      {
        "question": "How many TANs can one entity have?",
        "answer": "Generally one TAN per entity suffices. However, if a company has branches in different cities doing independent TDS, separate TANs may be required for each branch."
      }
    ]
  },
  {
    "title": "ESI Registration",
    "slug": "esi-registration",
    "description": "Employees' State Insurance (ESI) registration for establishments with 10+ employees — medical and social security coverage for workers.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/esi-registration",
    "order": 19,
    "isActive": true,
    "serviceType": "registration",
    "timeline": "7-12 working days",
    "governmentFee": 0,
    "professionalFee": 2499,
    "detailedOverview": "Employees' State Insurance (ESI) is a self-financing social security scheme providing medical, sickness, maternity, disability, and dependent benefits to employees earning up to ₹21,000/month. Establishments with 10 or more employees (20 in some states) must register with ESIC. Shree Chamunda Associates handles employer registration on the ESIC portal, code number allotment, employee enrollment, and monthly contribution return setup.",
    "eligibility": [
      "Factories and establishments with 10+ employees (Gujarat threshold)",
      "Employees earning gross wages up to ₹21,000/month",
      "Shops, hotels, restaurants, and cinemas",
      "Road transport establishments",
      "Private medical and educational institutions"
    ],
    "keyBenefits": [
      "Medical care for insured employees and dependents",
      "Sickness benefit at 70% of wages for 91 days/year",
      "Maternity benefit for 26 weeks (full wage)",
      "Disability and dependent benefits",
      "Unemployment allowance under Rajiv Gandhi Shramik Kalyan Yojana"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Applicability Review",
        "description": "We verify employee count, wage limits, and whether your establishment falls under ESI-covered areas in Gujarat."
      },
      {
        "step": 2,
        "title": "Employer Registration",
        "description": "Employer registration is filed on esic.in with business details, PAN, bank info, and employee count."
      },
      {
        "step": 3,
        "title": "Code Number Allotment",
        "description": "ESIC allots a 17-digit employer code number upon verification of application."
      },
      {
        "step": 4,
        "title": "Employee Enrollment",
        "description": "Each eligible employee is enrolled with IP number, photograph, and family details on the ESIC portal."
      },
      {
        "step": 5,
        "title": "Monthly Return Setup",
        "description": "We configure monthly contribution returns (MCR) and challan payment schedule — employer contributes 3.25%, employee 0.75%."
      }
    ],
    "documentsRequired": [
      "PAN card of establishment",
      "Certificate of Incorporation / registration proof",
      "Address proof of factory/establishment",
      "Bank account details with cancelled cheque",
      "List of employees with salary and joining dates",
      "Employee Aadhaar and family details",
      "Registration certificate under Shops & Establishment Act"
    ],
    "deliverables": [
      "ESIC employer code number (17-digit)",
      "Employee IP numbers for all enrolled staff",
      "ESIC registration certificate",
      "Monthly contribution return (MCR) filing setup",
      "Pehchan card application for employees"
    ],
    "faqs": [
      {
        "question": "Is ESI mandatory for all businesses?",
        "answer": "ESI applies to non-seasonal factories with 10+ employees and establishments notified by the state government. In Gujarat, the threshold is 10 employees for most covered establishments."
      },
      {
        "question": "What is the ESI contribution rate?",
        "answer": "Employer contributes 3.25% and employee contributes 0.75% of gross wages (up to ₹21,000/month wage ceiling). Total ESI contribution is 4% of wages."
      },
      {
        "question": "What if my employee count drops below 10?",
        "answer": "Once registered, ESI coverage continues even if employee count falls below the threshold. However, new registrations are not required until the threshold is crossed again."
      }
    ]
  },
  {
    "title": "Digital Signature",
    "slug": "digital-signature",
    "description": "Class 3 Digital Signature Certificates (DSC) for MCA filings, GST, e-tendering, income tax, and secure document signing.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/digital-signature",
    "order": 20,
    "isActive": true,
    "serviceType": "registration",
    "timeline": "1-3 working days",
    "governmentFee": 0,
    "professionalFee": 1500,
    "detailedOverview": "A Digital Signature Certificate (DSC) is the electronic equivalent of a physical signature, legally valid under the IT Act 2000. Class 3 DSC is required for MCA company filings, income tax e-filing, GST registration, e-tendering on GeM/CPPP, and DGFT applications. Shree Chamunda Associates facilitates DSC application through licensed Certifying Authorities (eMudhra, Capricorn, Sify) with video verification, USB token delivery, and renewal reminders.",
    "eligibility": [
      "Directors and shareholders for MCA/ROC filings",
      "Authorized signatories for GST registration",
      "Professionals filing income tax returns for clients",
      "Businesses participating in e-tendering (GeM, CPPP)",
      "Import/export businesses for DGFT portal access"
    ],
    "keyBenefits": [
      "Legally valid digital signing of documents and forms",
      "Mandatory for MCA SPICe+ company incorporation",
      "Required for GST, IT, and TDS portal authentication",
      "Enables participation in government e-tenders",
      "Secure, tamper-proof document authentication"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "DSC Type Selection",
        "description": "We recommend Class 3 DSC (individual or organization) based on your usage — MCA, GST, e-tender, or multi-purpose."
      },
      {
        "step": 2,
        "title": "Document Collection",
        "description": "PAN, Aadhaar, and photograph are collected. Organization DSC additionally requires authorization letter and entity proof."
      },
      {
        "step": 3,
        "title": "Online Application & Video KYC",
        "description": "Application is filed with the Certifying Authority. Applicant completes video verification via mobile or laptop."
      },
      {
        "step": 4,
        "title": "Certificate Issuance",
        "description": "Upon successful verification, DSC is issued and downloaded onto the USB e-token (Hyper2003 or mToken)."
      },
      {
        "step": 5,
        "title": "Installation & Testing",
        "description": "We assist with DSC driver installation, token setup, and test signing on the relevant portal (MCA, GST, etc.)."
      }
    ],
    "documentsRequired": [
      "PAN card of applicant",
      "Aadhaar card of applicant",
      "Passport-size photograph",
      "Mobile number and email for OTP/video KYC",
      "Organization proof (for organization DSC)",
      "Board resolution / authorization letter (for company DSC)",
      "GSTIN or COI (for organization verification)"
    ],
    "deliverables": [
      "Class 3 Digital Signature Certificate on USB token",
      "DSC certificate download backup",
      "Token driver installation support",
      "Portal registration assistance (MCA/GST/IT)",
      "Renewal reminder before expiry (1-2 year validity)"
    ],
    "faqs": [
      {
        "question": "What is the difference between Class 2 and Class 3 DSC?",
        "answer": "Class 2 DSC has been discontinued since January 2021. Class 3 is now mandatory for all government portal filings including MCA, GST, income tax, and e-tendering."
      },
      {
        "question": "How long is a DSC valid?",
        "answer": "DSC is typically issued for 1 or 2 years. Renewal requires fresh video KYC. We send reminders 30 days before expiry."
      },
      {
        "question": "Can one DSC be used for multiple portals?",
        "answer": "Yes. A single Class 3 DSC works across MCA, GST, income tax, TDS, DGFT, and e-tendering portals. Organization DSC covers all authorized signatories of the entity."
      }
    ]
  },
  {
    "title": "GST Return Filing",
    "slug": "gst-return-filing",
    "description": "Monthly and quarterly GST return filing (GSTR-1, GSTR-3B) with input tax credit reconciliation.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/gst-return-filing",
    "order": 21,
    "isActive": true,
    "serviceType": "tax",
    "timeline": "2-4 working days",
    "governmentFee": 0,
    "professionalFee": 1499,
    "detailedOverview": "Filing GSTR-1 and GSTR-3B is mandatory for registered taxpayers. Shree Chamunda Associates compiles your monthly sales transactions, double checks the values against actual invoices, and reconciles your purchase ledger with GSTR-2B to maximize input tax credit (ITC). We calculate tax liabilities accurately to prevent automated departmental notices.",
    "eligibility": [
      "Registered taxpayers under regular GST scheme",
      "Composition scheme dealers (quarterly CMP-08 filing)",
      "Any business engaged in interstate sales"
    ],
    "keyBenefits": [
      "Avoid late fees up to ₹50 per day (₹20 for nil returns)",
      "Ensure customers claim input tax credits correctly",
      "Prevent automated GST audits and notices"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Data Compilation",
        "description": "You share your monthly sales and purchase registers with our team."
      },
      {
        "step": 2,
        "title": "ITC Reconciliation",
        "description": "We match your purchase ledger against GSTR-2B to identify missing tax credits."
      },
      {
        "step": 3,
        "title": "Draft Return Review",
        "description": "We compute final tax liability and share draft returns for your approval."
      },
      {
        "step": 4,
        "title": "Portal Filing",
        "description": "Upon approval, we submit the returns on the GST Common Portal."
      },
      {
        "step": 5,
        "title": "Acknowledgment Delivery",
        "description": "We send you filing confirmations and payment receipts."
      }
    ],
    "documentsRequired": [
      "Sales Register (Excel format)",
      "Purchase Register / Input Ledger",
      "Access to GST Portal credentials",
      "Bank statement of the month"
    ],
    "deliverables": [
      "GSTR-1 Filing Acknowledgment",
      "GSTR-3B Filed Return Copy",
      "Input Tax Credit Reconciliation Statement",
      "GST payment challan (if applicable)"
    ],
    "faqs": [
      {
        "question": "What is the due date for monthly GST returns?",
        "answer": "GSTR-1 (sales details) is due by the 11th of the following month. GSTR-3B (tax summary & payment) is due by the 20th of the following month."
      },
      {
        "question": "What happens if I miss a filing due date?",
        "answer": "Late fees of ₹50 per day (₹20 for nil returns) apply, along with 18% interest on any unpaid tax liabilities."
      }
    ]
  },
  {
    "title": "Income Tax Return Filing",
    "slug": "income-tax-return-filing",
    "description": "Annual ITR filing for individuals, salaried employees, professionals, and businesses.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/income-tax-return-filing",
    "order": 22,
    "isActive": true,
    "serviceType": "tax",
    "timeline": "3-5 working days",
    "governmentFee": 0,
    "professionalFee": 999,
    "detailedOverview": "Filing ITR-1 to ITR-6 with precise tax planning. We reconcile your income registers with Form 26AS, TIS, and AIS statements to ensure error-free filing. Our team optimizes your declarations under old and new regimes to reduce tax liabilities.",
    "eligibility": [
      "Salaried individuals with income above ₹2.5 Lakhs (or ₹7 Lakhs in new regime)",
      "Business owners and self-employed professionals",
      "Anyone seeking tax refunds or visa processing documents"
    ],
    "keyBenefits": [
      "Secure loans and visa approvals easily",
      "Carry forward capital losses to offset future gains",
      "Claim legitimate tax refunds on TDS"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Documents Submission",
        "description": "Upload your Form 16, bank statements, and tax-saving investment proofs."
      },
      {
        "step": 2,
        "title": "Tax Optimization",
        "description": "We evaluate benefits under both Old and New Tax Regimes to select the best one."
      },
      {
        "step": 3,
        "title": "Draft Computation",
        "description": "We calculate tax liabilities and share a draft computation summary."
      },
      {
        "step": 4,
        "title": "ITR Filing",
        "description": "We submit the return on the Income Tax e-filing portal."
      },
      {
        "step": 5,
        "title": "e-Verification",
        "description": "We complete the Aadhaar OTP e-verification to finalize processing."
      }
    ],
    "documentsRequired": [
      "Form 16 (for salaried persons)",
      "Bank Statement of the financial year",
      "PAN & Aadhaar card copy",
      "Investment proofs (LIC, PPF, Tuition fees, Health insurance)",
      "Capital Gains statement from broker"
    ],
    "deliverables": [
      "ITR Computation Statement",
      "ITR-V Acknowledgment Copy",
      "Tax Saving recommendation report"
    ],
    "faqs": [
      {
        "question": "What is the last date to file individual ITR?",
        "answer": "The standard deadline is July 31st of the assessment year. Late filing is allowed up to December 31st with penalties."
      }
    ]
  },
  {
    "title": "PF Return",
    "slug": "pf-return",
    "description": "Monthly Provident Fund return filing and Electronic Challan-cum-Return (ECR) generation.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/pf-return",
    "order": 23,
    "isActive": true,
    "serviceType": "accounting",
    "timeline": "2-3 working days",
    "governmentFee": 0,
    "professionalFee": 1200,
    "detailedOverview": "Timely filing of monthly Provident Fund (PF) returns. We process salary books to calculate employee/employer contributions (12% each) and submit files to the EPFO portal, generating your payment ECR challan.",
    "eligibility": [
      "Businesses employing 20 or more staff members",
      "Voluntarily PF registered establishments"
    ],
    "keyBenefits": [
      "Maintain 100% compliance under labour laws",
      "Avoid heavy interest and damages u/s 7Q and 14B",
      "Provide retirement safety benefits to employees"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Salary Sheet collection",
        "description": "You share your monthly salary spreadsheet."
      },
      {
        "step": 2,
        "title": "Contribution Computation",
        "description": "We compute employer and employee shares (12% of basic salary)."
      },
      {
        "step": 3,
        "title": "ECR Upload",
        "description": "We upload the ECR file on the EPFO Unified Portal."
      },
      {
        "step": 4,
        "title": "Challan Generation",
        "description": "We generate the payment challan and share it for payment."
      },
      {
        "step": 5,
        "title": "Filing Receipt",
        "description": "We deliver filing acknowledgments after payment clearance."
      }
    ],
    "documentsRequired": [
      "Monthly payroll register (salary sheets)",
      "New joining employees' details (UAN, Aadhaar)",
      "Exit dates for resigned employees"
    ],
    "deliverables": [
      "Monthly ECR Receipt",
      "PF Challan Confirmation Copy",
      "PF Contribution statement"
    ],
    "faqs": [
      {
        "question": "What is the due date for monthly PF returns?",
        "answer": "PF return and payment must be completed by the 15th of the following month."
      }
    ]
  },
  {
    "title": "TDS Return",
    "slug": "tds-return",
    "description": "Quarterly TDS return filing (Form 24Q, 26Q, 27Q) with FVU file generation.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/tds-return",
    "order": 24,
    "isActive": true,
    "serviceType": "tax",
    "timeline": "3-5 working days",
    "governmentFee": 0,
    "professionalFee": 1999,
    "detailedOverview": "Quarterly filing of Tax Deducted at Source (TDS) returns. We match challan payments (Challan 281) against deductee PANs to ensure correct credit transfers on TRACES, generating Form 16/16A certificates.",
    "eligibility": [
      "Any business or individual holding a TAN who has deducted TDS during the quarter"
    ],
    "keyBenefits": [
      "Avoid late filing fees of ₹200 per day under Section 234E",
      "Enable deductees to claim TDS credits in their Form 26AS",
      "Avoid TDS interest penalties (1.5% per month)"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Data Gathering",
        "description": "We compile details of TDS deductions, deductee PANs, and payment categories."
      },
      {
        "step": 2,
        "title": "Challan Verification",
        "description": "We match Challan 281 details on the NSDL database."
      },
      {
        "step": 3,
        "title": "Return Preparation",
        "description": "We generate the electronic return using government utility software."
      },
      {
        "step": 4,
        "title": "FVU File Validation",
        "description": "The return file is validated through the File Validation Utility (FVU)."
      },
      {
        "step": 5,
        "title": "Return Submission",
        "description": "We submit the validated return on the TIN-FC portal or online."
      }
    ],
    "documentsRequired": [
      "PAN card of deductees",
      "Payment details (contractor fees, rent, salary)",
      "TDS payment challans (Challan 281)"
    ],
    "deliverables": [
      "Form 27A Receipt of Filing",
      "FVU Validation File",
      "TDS Certificates (Form 16A/16)"
    ],
    "faqs": [
      {
        "question": "What are the quarterly TDS return due dates?",
        "answer": "TDS returns are due by July 31st (Q1), October 31st (Q2), January 31st (Q3), and May 31st (Q4)."
      }
    ]
  },
  {
    "title": "E-way Bill",
    "slug": "e-way-bill",
    "description": "Electronic way bill generation for transport of goods exceeding value limits.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/e-way-bill",
    "order": 25,
    "isActive": true,
    "serviceType": "tax",
    "timeline": "1 working day",
    "governmentFee": 0,
    "professionalFee": 499,
    "detailedOverview": "Instant generation of Part-A and Part-B of the E-way bill for movement of goods. Shree Chamunda Associates helps transporters and suppliers comply with road-transit regulations to prevent seizure and heavy fines.",
    "eligibility": [
      "Suppliers transporting goods worth more than ₹50,000 in a vehicle",
      "Transporters moving goods where the supplier has not generated the bill"
    ],
    "keyBenefits": [
      "Legal transport of goods without risk of detention",
      "Avoid heavy fines (equal to 100% of tax value)",
      "Smooth transit across border checks"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Invoice Details Entry",
        "description": "You share the tax invoice details and vehicle number."
      },
      {
        "step": 2,
        "title": "Portal Filing",
        "description": "We enter consignee/consignor details and transporter ID on the portal."
      },
      {
        "step": 3,
        "title": "Part-B Update",
        "description": "We fill out transporter vehicle number or LR details."
      },
      {
        "step": 4,
        "title": "Bill Generation",
        "description": "The 12-digit E-way Bill is generated instantly."
      }
    ],
    "documentsRequired": [
      "Tax Invoice / Bill of Entry / Delivery Challan",
      "Transporter Details (Transporter ID or Vehicle Number)",
      "PIN codes of dispatch and delivery locations"
    ],
    "deliverables": [
      "E-way Bill Certificate (PDF)",
      "E-way Bill Number (EBN)"
    ],
    "faqs": [
      {
        "question": "What is the validity of an E-way Bill?",
        "answer": "An E-way bill is valid for 1 day per 200 km (or 20 km for over-dimensional cargo). It must be updated or extended if transit is delayed."
      }
    ]
  },
  {
    "title": "PF & ESIC Return",
    "slug": "pf-and-esic-return",
    "description": "Combined monthly compliance return filings for Provident Fund and Employee State Insurance.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "/services/pf-and-esic-return",
    "order": 26,
    "isActive": true,
    "serviceType": "accounting",
    "timeline": "3 working days",
    "governmentFee": 0,
    "professionalFee": 1999,
    "detailedOverview": "Dual compliance management for both employee funds (EPFO) and healthcare cover (ESIC). We compile payroll records, compute employer/employee shares, file return sheets, and issue challans simultaneously.",
    "eligibility": [
      "Establishments employing 20 or more staff members (having both PF & ESIC registrations)"
    ],
    "keyBenefits": [
      "Zero late fee risk across two statutory boards",
      "Single-point payroll management and compliance reports",
      "Peace of mind for employee health and retirement safety"
    ],
    "processSteps": [
      {
        "step": 1,
        "title": "Payroll Validation",
        "description": "We audit your payroll register to ensure accurate PF/ESIC deductions."
      },
      {
        "step": 2,
        "title": "EPF ECR Preparation",
        "description": "We generate and upload PF monthly returns."
      },
      {
        "step": 3,
        "title": "ESIC Return Upload",
        "description": "We compute wages and file monthly ESIC contributions."
      },
      {
        "step": 4,
        "title": "Challan generation",
        "description": "We deliver payment challans for both portals."
      }
    ],
    "documentsRequired": [
      "Monthly employee attendance / leave register",
      "Salary sheet containing basic + allowances",
      "New joiner details (KYC documents)"
    ],
    "deliverables": [
      "EPFO ECR acknowledgment",
      "ESIC monthly return filing statement",
      "PF & ESIC payment receipt confirmations"
    ],
    "faqs": [
      {
        "question": "What is the due date for monthly ESI returns?",
        "answer": "Both PF and ESI payments and returns are due by the 15th of the following month."
      }
    ]
  },
  {
    "title": "Accounting System Setup",
    "slug": "accounting-system-setup",
    "description": "Custom accounting systems designed to streamline your financial operations and reporting.",
    "icon": "/assets/accounting-system.svg",
    "link": "#",
    "order": 1,
    "isActive": true,
    "detailedOverview": "Setting up a robust accounting environment is essential for financial transparency and scaling. We configure systems (Tally Prime, Zoho Books, QuickBooks, etc.) tailored to your industry, creating a solid foundation for financial control.",
    "deliverables": [
      "Chart of Accounts Design",
      "Software License & Configuration",
      "Integration with Payment Gateways",
      "Staff Training Guide"
    ],
    "documentsRequired": [
      "PAN Card of Business",
      "GSTIN Certificate (if registered)",
      "Bank Statement / Cancelled Cheque",
      "Existing Balance Sheet (for migration)"
    ],
    "timeline": "5-7 working days",
    "serviceType": "accounting"
  },
  {
    "title": "Personal Tax Return & Accounting",
    "slug": "personal-tax-return-and-accounting",
    "description": "Expert tax planning and compliance services to optimize your financial position.",
    "icon": "/assets/infinite.svg",
    "link": "#",
    "order": 2,
    "isActive": true,
    "detailedOverview": "Expert e-filing of individual Income Tax Returns (ITR-1 to ITR-4) to optimize deductions under 80C, 80D, HRA, and presumptive schemes. We analyze your AIS/26AS tax credits to ensure 100% compliance with zero notices.",
    "deliverables": [
      "ITR Computation Sheet",
      "Aadhaar e-Verified Return ITR-V Receipt",
      "Tax Saving Advisory Report"
    ],
    "documentsRequired": [
      "Form 16 from Employer",
      "Form 26AS & AIS Tax Credit Statements",
      "Bank Interest Certificates",
      "Investment Proofs (80C, 80D, HRA, ELSS, Insurance)"
    ],
    "timeline": "2-3 working days",
    "serviceType": "tax"
  },
  {
    "title": "Bookkeeping Services",
    "slug": "bookkeeping-services",
    "description": "Accurate and timely bookkeeping to maintain clear financial records.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "#",
    "order": 3,
    "isActive": true,
    "detailedOverview": "Ongoing cloud-based ledger entry, bank statement reconciliations, accounts payable/receivable tracking, and expense entries to keep your business financial records accurate and completely audit-ready.",
    "deliverables": [
      "Monthly Profit & Loss Statement",
      "Bank Reconciliation Reports",
      "Accounts Payable/Receivable Ledger",
      "Monthly Expense Analytics"
    ],
    "documentsRequired": [
      "Bank Current Account Statements",
      "Sales Invoices & Purchase Bills",
      "Expense Receipts / Petty Cash logs",
      "Credit Card Statements"
    ],
    "timeline": "Monthly / Ongoing",
    "serviceType": "accounting"
  },
  {
    "title": "Payroll Services",
    "slug": "payroll-services",
    "description": "Comprehensive payroll solutions to ensure timely and compliant employee payments.",
    "icon": "/assets/payroll-2.svg",
    "link": "#",
    "order": 4,
    "isActive": true,
    "detailedOverview": "End-to-end payroll management: salary processing, dynamic payslip generation, TDS deduction on salaries (Form 24Q), and monthly PF & ESIC compliance filings to manage your workforce seamlessly.",
    "deliverables": [
      "Monthly Salary Registers",
      "Digitized Employee Payslips",
      "PF & ESIC Challans",
      "Quarterly Form 24Q TDS Returns"
    ],
    "documentsRequired": [
      "Employee Aadhaar & PAN Details",
      "Bank Accounts for Salary Deposits",
      "Monthly Attendance & Leaves Data",
      "PF & ESIC Registration Credentials"
    ],
    "timeline": "Monthly Cycle (3 working days)",
    "serviceType": "accounting"
  },
  {
    "title": "Business Tax Filing",
    "slug": "business-tax-filing",
    "description": "End-to-end business tax return preparation ensuring compliance and maximizing deductions.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "#",
    "order": 5,
    "isActive": true,
    "detailedOverview": "Comprehensive partnership, LLP, and corporate tax returns (ITR-5 & ITR-6) along with GST return preparation. We cross-verify purchase ledgers with GST input tax credit (GSTR-2B) to maximize tax savings.",
    "deliverables": [
      "Audit & Non-Audit ITR Computation",
      "GST Monthly GSTR-1 & 3B Filings",
      "TDS Return Acknowledgments",
      "GST Input Reconciliation Statement"
    ],
    "documentsRequired": [
      "Audited Balance Sheet & P&L Statements",
      "GST Purchase & Sales Ledgers",
      "TDS Challans and Certificates",
      "Directors' Resolution Copy"
    ],
    "timeline": "5-10 working days",
    "serviceType": "tax"
  },
  {
    "title": "Financial Statement Preparation",
    "slug": "financial-statement-preparation",
    "description": "Preparation of professional financial statements for internal or external reporting.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "#",
    "order": 6,
    "isActive": true,
    "detailedOverview": "Compilation of professional Balance Sheet, Profit & Loss Statements, and Cash Flow Statements conforming to statutory Accounting Standards. Essential for bank loan applications and equity presentations.",
    "deliverables": [
      "Draft Balance Sheet & P&L",
      "Cash Flow Statement",
      "Notes to Accounts Draft",
      "Financial Ratio Analysis Sheet"
    ],
    "documentsRequired": [
      "Trial Balance",
      "Bank statements & loan amortization schedules",
      "Fixed Asset Register",
      "Closing Inventory Valuation Sheet"
    ],
    "timeline": "4-6 working days",
    "serviceType": "accounting"
  },
  {
    "title": "Tax Advisory & Planning",
    "slug": "tax-advisory-and-planning",
    "description": "Strategic advice to minimize tax liability and plan long-term tax strategies.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "#",
    "order": 7,
    "isActive": true,
    "detailedOverview": "Strategic corporate and personal tax planning to structure transactions, optimize taxes legally, and avoid compliance audits. We analyze business contracts and structure investments for low tax outcomes.",
    "deliverables": [
      "Tax Structuring Advisory Report",
      "Advance Tax Estimator Sheet",
      "Capital Gains Optimization Plan"
    ],
    "documentsRequired": [
      "Current year projected financial statements",
      "Details of planned property / asset transactions",
      "Investment portfolios",
      "Past 3 years ITR acknowledgments"
    ],
    "timeline": "5-7 working days",
    "serviceType": "tax"
  },
  {
    "title": "Internal Audit Services",
    "slug": "internal-audit-services",
    "description": "Independent evaluations to improve operations and control effectiveness.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "#",
    "order": 8,
    "isActive": true,
    "detailedOverview": "Independent internal audits to verify accounting control effectiveness, identify leakages or fraud, and streamline operational efficiency. We test purchase controls, cash handlings, and payroll checks.",
    "deliverables": [
      "Internal Audit Report",
      "Risk Assessment & Mitigation Matrix",
      "Management Letter on Control Deficiencies"
    ],
    "documentsRequired": [
      "Internal Accounting Policy manual",
      "Complete Ledger backup",
      "Inventory Register",
      "Vendor & Customer contracts"
    ],
    "timeline": "10-15 working days",
    "serviceType": "general"
  },
  {
    "title": "Business Incorporation Services",
    "slug": "business-incorporation-services",
    "description": "Help with legal entity setup and registration, including tax IDs and documentation.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "#",
    "order": 9,
    "isActive": true,
    "detailedOverview": "Start your business as a Private Limited Company, LLP, OPC, or Partnership. We handle name reservation, digital signatures, PAN/TAN allocation, and SPICe+ Ministry of Corporate Affairs (MCA) filings.",
    "deliverables": [
      "Certificate of Incorporation (COI)",
      "Memorandum & Articles of Association (MOA/AOA)",
      "Company PAN & TAN Cards",
      "Digital Signature Certificates (DSC)"
    ],
    "documentsRequired": [
      "Aadhaar & PAN of all directors/partners",
      "Passport-size photos",
      "Directors' Address Proof (Bank Statement / Utility Bill)",
      "Registered office address proof (Electricity bill + Rent agreement + NOC)"
    ],
    "timeline": "7-10 working days",
    "serviceType": "startup"
  },
  {
    "title": "Non-Profit Accounting",
    "slug": "non-profit-accounting",
    "description": "Specialized accounting services tailored for NGOs and charitable organizations.",
    "icon": "/assets/bookkepping-2.svg",
    "link": "#",
    "order": 10,
    "isActive": true,
    "detailedOverview": "Specialized accounting, bookkeeping, and compliance for NGOs, trusts, and societies under Section 12A, 80G, and FCRA regulations. We handle donation accounts and fund utilization audits.",
    "deliverables": [
      "Fund Utilization Reports",
      "Trust Balance Sheets & Receipts/Payments Statements",
      "ITR-7 Filing & Audit Report"
    ],
    "documentsRequired": [
      "Trust Deed / Society Registration copy",
      "12A & 80G registration certificates",
      "Donation register and receipts",
      "Bank Statements"
    ],
    "timeline": "5-7 working days",
    "serviceType": "general"
  }
];

export const findFallbackService = (param) => {
  if (!param) return null;
  const clean = String(param).trim().toLowerCase();
  const normalizedSlug = clean.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const cleanTitle = clean.replace(/[-_]/g, ' ');

  return FALLBACK_SERVICES.find((s) => {
    const sSlug = (s.slug || '').toLowerCase();
    const sTitle = (s.title || '').toLowerCase();
    return (
      sSlug === clean ||
      sSlug === normalizedSlug ||
      sTitle === cleanTitle ||
      sTitle.includes(cleanTitle) ||
      cleanTitle.includes(sTitle)
    );
  }) || null;
};
