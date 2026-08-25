const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const BlogPost = require('../models/BlogPost');

const run = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB.');

    const newBlogs = [
      {
        title: 'How to Handle GST Scrutiny Notices & Avoid Heavy Penalties: Step-by-Step CA Guide',
        summary: 'Received a GST notice (ASMT-10, DRC-01A, or GSTR-2B mismatch)? Learn the exact steps, timelines, and reconciliation strategies to reply legally without inviting fines.',
        content: 'Receiving a GST notice from the tax department can be stressful for any business owner. However, most notices in 2026 are system-generated algorithmic discrepancies between your GSTR-1, GSTR-3B, and supplier filings in GSTR-2B.\n\n### Common Types of GST Notices:\n1. **Form GST ASMT-10 (Scrutiny Notice)**: Discrepancies between output tax declared in GSTR-1 vs tax paid in GSTR-3B, or excess Input Tax Credit (ITC) claimed.\n2. **Form DRC-01A (Intimation of Tax Liability)**: Advance intimation before a formal show-cause notice is issued under Section 73 or 74.\n3. **GSTR-3A (Default Notice)**: Issued if you fail to file returns within the due date.\n\n### Immediate Steps to Take Upon Receiving a Notice:\n1. **Check the DIN (Document Identification Number)**: Ensure the notice is authentic. Any official communication without a valid DIN is invalid under CBIC guidelines.\n2. **Verify the Deadline**: Most scrutiny notices provide a 30-day window to respond in Form GST ASMT-11.\n3. **Perform Invoice-by-Invoice Reconciliation**: Match your purchase invoices with GSTR-2B records on the GST portal to identify missing vendor uploads or credit note adjustments.\n4. **Draft a Clear Factual Reply**: Provide invoice numbers, proof of payment (banking challans), and E-Way bills if applicable. If tax is genuinely owed, pay via DRC-03 immediately with interest under Section 50 to minimize penalties.\n\n### How Shree Chamunda Associates Can Help\nOur team assists you in drafting legal responses, appearing before GST appellate officers, and resolving assessment disputes efficiently.',
        category: 'GST',
        author: 'Pragnesh Adiyecha, Principal Tax Consultant',
        readTime: '6 min read',
        tags: ['GST Notice', 'Scrutiny', 'ASMT-10', 'ITC Reconciliation', 'Penalties'],
        image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
        isActive: true,
      },
      {
        title: 'Top Tax-Saving Strategies for Freelancers & Consultants under Section 44ADA',
        summary: 'Are you a software engineer, designer, legal consultant, or doctor earning professional income? Discover how Section 44ADA allows you to pay tax on only 50% of your gross receipts.',
        content: 'Freelancing, remote consulting, and professional contracting have surged across India. If you are a specified professional earning gross receipts up to ₹75 Lakhs per year (increased from ₹50 Lakhs provided cash receipts don\'t exceed 5%), Section 44ADA of the Income Tax Act offers immense tax savings.\n\n### What is Section 44ADA (Presumptive Taxation)?\nUnder this scheme, professionals do not need to maintain tedious books of accounts, balance sheets, or get their accounts audited. Instead, the government presumes that 50% of your gross professional receipts is your net profit, and you pay tax only on this 50% amount.\n\n### Who is Eligible for Section 44ADA?\n- Technical and Software Consultants, Freelance Coders\n- Chartered Accountants, Company Secretaries, Legal Advocates\n- Medical Practitioners, Architects, Engineers, Interior Decorators\n- Film Artists, Designers, and Content Creators\n\n### Practical Example:\nIf you earn ₹40 Lakhs consulting for international and domestic clients in a financial year:\n- **Presumed Net Income (50%)**: ₹20,00,000\n- **Eligible Deductions under Old/New Regime**: Applied on this ₹20 Lakhs base\n- **Effective Tax Savings**: Thousands saved compared to normal bookkeeping with disallowed personal expenses.\n\n### Key Compliance Reminders:\n1. Advance tax must be paid in a single installment by March 15th (or quarterly to avoid Section 234C interest).\n2. File **Form ITR-4 (Sugam)** before the July 31st deadline.\n3. Keep bank statements and TDS certificates (Form 16A) handy for seamless e-verification.',
        category: 'Income Tax',
        author: 'CA Rajesh Sharma, Senior Partner',
        readTime: '7 min read',
        tags: ['Freelancer Tax', 'Section 44ADA', 'Presumptive Taxation', 'ITR-4', 'Tax Planning'],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        isActive: true,
      },
    ];

    for (const blog of newBlogs) {
      const exists = await BlogPost.findOne({ title: blog.title });
      if (!exists) {
        await BlogPost.create(blog);
        console.log(`✅ Added: ${blog.title}`);
      } else {
        console.log(`ℹ️ Already exists: ${blog.title}`);
      }
    }

    const total = await BlogPost.countDocuments();
    console.log(`Total blogs in database: ${total}`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding blogs:', err);
    process.exit(1);
  }
};

run();
