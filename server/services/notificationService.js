const nodemailer = require('nodemailer');
const webPush = require('web-push');
const PushSubscription = require('../models/PushSubscription');

/**
 * Escape HTML special characters to prevent XSS in email templates
 */
const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Configure Web Push VAPID keys
let vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
};

// Auto-generate VAPID keys dynamically if not provided in .env
if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
  const keys = webPush.generateVAPIDKeys();
  vapidKeys = {
    publicKey: keys.publicKey,
    privateKey: keys.privateKey
  };
}

webPush.setVapidDetails(
  'mailto:shreechamundaassociates0905@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

/**
 * Configure Nodemailer SMTP Transporter with production-grade pooling & retry
 */
const configureTransporter = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT, 10) || 587;

  if (user && pass) {
    const transportConfig = (host && host !== 'smtp.gmail.com')
      ? {
          host,
          port,
          secure: port === 465,
          pool: true,
          maxConnections: 5,
          maxMessages: 100,
          auth: {
            user: user.trim(),
            pass: pass.replace(/\s+/g, '')
          },
          tls: {
            rejectUnauthorized: process.env.NODE_ENV === 'production'
          }
        }
      : {
          service: 'gmail',
          pool: true,
          maxConnections: 5,
          maxMessages: 100,
          auth: {
            user: user.trim(),
            pass: pass.replace(/\s+/g, '')
          },
          tls: {
            rejectUnauthorized: process.env.NODE_ENV === 'production'
          }
        };

    const transporter = nodemailer.createTransport(transportConfig);

    transporter.verify((error) => {
      if (error) {
        console.error('⚠️  SMTP Transporter Verification Failed:', error.message);
      } else {
        console.log('✅ SMTP Mail Transporter verified & active');
      }
    });

    return transporter;
  }

  // Fallback: Console Logger for offline development
  return {
    sendMail: async (options) => {
      console.log(`
=========================================
📩 [SIMULATED EMAIL DISPATCHED]
To: ${options.to}
From: ${options.from}
Reply-To: ${options.replyTo}
Subject: ${options.subject}
Message Body:
-----------------------------------------
${options.text || options.html}
=========================================
      `);
      return { messageId: 'mock-id-' + Date.now() };
    }
  };
};

const mailTransporter = configureTransporter();

// Sender Identity
const SENDER_NAME = 'Shree Chamunda Associates';
const getSenderEmail = () => `"${SENDER_NAME}" <${process.env.SENDER_EMAIL || process.env.ADMIN_EMAIL || 'shreechamundaassociates0905@gmail.com'}>`;
const getSecuritySenderEmail = () => `"Shree Chamunda Security" <${process.env.SENDER_EMAIL || process.env.ADMIN_EMAIL || 'shreechamundaassociates0905@gmail.com'}>`;
const getAdminEmail = () => process.env.ADMIN_EMAIL || 'shreechamundaassociates0905@gmail.com';

/**
 * Unified Notification Service
 */
const notificationService = {
  getVapidPublicKey: () => vapidKeys.publicKey,

  /**
   * Broadcast a real-time event to connected clients (or specific room) via Socket.io
   */
  sendRealTimeMessage: (io, event, data, room = null) => {
    if (io) {
      if (room) {
        io.to(room).emit(event, data);
      } else {
        io.emit(event, data);
      }
    }
  },

  /**
   * Industry-Level Inquiry Email Delivery:
   * 1. High-Priority Alert to Admin with direct "Reply-To: Client Email" and quick action buttons.
   * 2. Branded Confirmation Receipt to the Client with company contact details and inquiry reference.
   */
  sendEmails: async ({ _id, name, email, phone, message, service, createdAt }) => {
    try {
      const safeName = escapeHtml(name || 'Valued Client');
      const safeEmail = escapeHtml(email || '');
      const safePhone = escapeHtml(phone || 'Not provided');
      const safeMessage = escapeHtml(message || 'No message details provided');
      const safeService = escapeHtml(service || 'General Tax & Compliance Consultation');
      const refNumber = _id ? _id.toString().slice(-6).toUpperCase() : Date.now().toString().slice(-6);
      const timestamp = (createdAt ? new Date(createdAt) : new Date()).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
        timeStyle: 'short'
      });

      const senderFrom = getSenderEmail();
      const adminTo = getAdminEmail();

      // Client details and quick-action helpers
      const clientInitial = (name || 'C').trim().charAt(0).toUpperCase();
      const phoneDigits = (phone || '').replace(/[^0-9]/g, '');
      const cleanWhatsAppPhone = phoneDigits.length === 10 ? '91' + phoneDigits : phoneDigits;
      const whatsAppUrl = phoneDigits ? `https://wa.me/${cleanWhatsAppPhone}?text=${encodeURIComponent(`Hello ${name || 'Client'}, this is Shree Chamunda Associates regarding your tax consultation inquiry for ${service || 'our services'}.`)}` : '';
      const portalAdminUrl = `${process.env.FRONTEND_URL || 'https://shreechamundaassociates.onrender.com'}/admin`;
      const replyMailto = `mailto:${safeEmail}?subject=Re:%20Inquiry%20for%20${encodeURIComponent(service || 'Tax Consultation')}%20[Ref%20%23${refNumber}]%20-%20Shree%20Chamunda%20Associates`;
      const callTel = phone ? `tel:${phone}` : '';

      // ==========================================
      // 1. ADMIN NOTIFICATION EMAIL
      // ==========================================
      const adminText = `
NEW SERVICE INQUIRY [Ref #${refNumber}]
-----------------------------------------
A new client inquiry has been submitted on the Shree Chamunda Associates portal.

CLIENT DETAILS:
- Name: ${name}
- Email: ${email}
- Phone: ${phone || 'Not provided'}
- Service: ${service || 'General Consultation'}
- Submitted: ${timestamp} (IST)

CLIENT MESSAGE / REQUIREMENT:
"${message}"

-----------------------------------------
Reply directly to this email or use WhatsApp to contact the client.
Shree Chamunda Associates Administrative Dispatch
      `.trim();

      const adminHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Client Inquiry • ${safeName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1329; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">

  <!-- Hidden Gmail Inbox Preheader -->
  <div style="display: none; font-size: 1px; color: #0b1329; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ⚡ Action Required: New inquiry received from ${safeName} for ${safeService} • Ref #${refNumber} • Mobile: ${safePhone}&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0b1329; padding: 32px 12px;">
    <tr>
      <td align="center">
        
        <!-- Main Email Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.35); border: 1px solid #1e293b;">
          
          <!-- Top Executive Header -->
          <tr>
            <td style="background-color: #071324; padding: 30px 32px 26px; border-bottom: 3px solid #f8b400;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width: 44px; height: 44px; background-color: #f8b400; border-radius: 10px; text-align: center; vertical-align: middle; font-size: 22px; font-weight: 900; color: #071324;">
                          🏛️
                        </td>
                        <td style="padding-left: 14px;">
                          <h1 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 800; letter-spacing: 0.5px; line-height: 1.2;">
                            SHREE CHAMUNDA ASSOCIATES
                          </h1>
                          <p style="color: #f8b400; margin: 3px 0 0; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">
                            Chartered Tax Consultancy &amp; Financial Advisory
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" valign="middle">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color: rgba(248, 180, 0, 0.15); border: 1px solid rgba(248, 180, 0, 0.4); padding: 5px 12px; border-radius: 20px; text-align: center;">
                          <span style="color: #f8b400; font-size: 11px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; font-family: monospace;">
                            #${refNumber}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Priority Alert Banner -->
          <tr>
            <td style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 14px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="font-size: 13px; color: #0f172a; font-weight: 600;">
                    <span style="display: inline-block; width: 8px; height: 8px; background-color: #10b981; border-radius: 50%; margin-right: 8px;"></span>
                    New Lead Dispatch &bull; <span style="color: #64748b; font-weight: 500;">${timestamp} (IST)</span>
                  </td>
                  <td align="right" valign="middle">
                    <span style="background-color: #e0f2fe; color: #0369a1; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; text-transform: uppercase;">
                      Awaiting Response
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Primary Body -->
          <tr>
            <td style="padding: 30px 32px 24px;">

              <!-- Client Dossier Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 24px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <tr>
                  <td style="background-color: #f8fafc; padding: 12px 20px; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #475569;">
                      👤 Client Dossier
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      
                      <!-- Name Row -->
                      <tr>
                        <td style="width: 48px; padding-right: 14px;" valign="top">
                          <div style="width: 44px; height: 44px; border-radius: 50%; background-color: #071324; color: #f8b400; font-size: 18px; font-weight: 800; text-align: center; line-height: 44px; border: 2px solid #e2e8f0;">
                            ${clientInitial}
                          </div>
                        </td>
                        <td valign="middle">
                          <div style="font-size: 17px; font-weight: 800; color: #0f172a;">${safeName}</div>
                          <div style="font-size: 12.5px; color: #64748b; margin-top: 2px;">Prospective Client / Tax Filer</div>
                        </td>
                      </tr>

                      <tr>
                        <td colspan="2" style="padding-top: 18px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #f1f5f9; padding-top: 14px;">
                            
                            <!-- Email -->
                            <tr>
                              <td style="padding: 7px 0; color: #64748b; font-size: 13px; font-weight: 600; width: 130px;">
                                ✉️ Email Address:
                              </td>
                              <td style="padding: 7px 0; font-size: 14px; font-weight: 600;">
                                <a href="mailto:${safeEmail}" style="color: #0284c7; text-decoration: none;">${safeEmail}</a>
                              </td>
                            </tr>

                            <!-- Phone -->
                            <tr>
                              <td style="padding: 7px 0; color: #64748b; font-size: 13px; font-weight: 600;">
                                📞 Mobile Phone:
                              </td>
                              <td style="padding: 7px 0; font-size: 14px; font-weight: 700; color: #0f172a;">
                                ${phone ? `<a href="tel:${safePhone}" style="color: #0f172a; text-decoration: none;">${safePhone}</a>` : '<span style="color: #94a3b8; font-style: italic;">Not provided</span>'}
                              </td>
                            </tr>

                            <!-- Service -->
                            <tr>
                              <td style="padding: 7px 0; color: #64748b; font-size: 13px; font-weight: 600;">
                                💼 Requested Service:
                              </td>
                              <td style="padding: 7px 0;">
                                <span style="background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; padding: 4px 10px; border-radius: 6px; font-size: 12.5px; font-weight: 700; display: inline-block;">
                                  ${safeService}
                                </span>
                              </td>
                            </tr>

                          </table>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>

              <!-- Client Message Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 26px;">
                <tr>
                  <td style="padding-bottom: 8px;">
                    <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #475569;">
                      📝 Client Inquiry Notes / Requirements
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #071324; border-radius: 8px; padding: 18px 20px;">
                    <p style="margin: 0; color: #1e293b; font-size: 14.5px; line-height: 1.65; white-space: pre-wrap;">${safeMessage}</p>
                  </td>
                </tr>
              </table>

              <!-- Instant Executive Action Hub -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                <tr>
                  <td style="padding-bottom: 14px; text-align: center;">
                    <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #071324;">
                      ⚡ Fast Action Center
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <!-- Reply via Email Button -->
                        <td style="padding: 4px;">
                          <a href="${replyMailto}" 
                             style="display: inline-block; background-color: #071324; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; border: 1px solid #071324;">
                            ✉️ Reply Email
                          </a>
                        </td>

                        <!-- WhatsApp Direct Button -->
                        ${whatsAppUrl ? `
                        <td style="padding: 4px;">
                          <a href="${whatsAppUrl}" target="_blank"
                             style="display: inline-block; background-color: #25d366; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; border: 1px solid #22c55e;">
                            💬 WhatsApp Client
                          </a>
                        </td>
                        ` : ''}

                        <!-- Call Client Button -->
                        ${callTel ? `
                        <td style="padding: 4px;">
                          <a href="${callTel}" 
                             style="display: inline-block; background-color: #ffffff; color: #071324; text-decoration: none; padding: 12px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; border: 1px solid #cbd5e1;">
                            📞 Call Client
                          </a>
                        </td>
                        ` : ''}

                        <!-- Open Admin Portal Button -->
                        <td style="padding: 4px;">
                          <a href="${portalAdminUrl}" target="_blank"
                             style="display: inline-block; background-color: #ffffff; color: #071324; text-decoration: none; padding: 12px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; border: 1px solid #cbd5e1;">
                            📊 Open Portal
                          </a>
                        </td>

                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Compliance & Confidentiality Footer -->
          <tr>
            <td style="background-color: #071324; padding: 24px 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); color: #94a3b8;">
              <p style="margin: 0 0 6px; font-size: 12px; font-weight: 700; color: #f8b400; letter-spacing: 0.5px;">
                SHREE CHAMUNDA ASSOCIATES &bull; INTERNAL AUDIT DISPATCH
              </p>
              <p style="margin: 0 0 8px; font-size: 11px; line-height: 1.5; color: #cbd5e1;">
                612, Hill Town Square, MG Road, near Ganesh Opera, Nikol, Ahmedabad, Gujarat - 380049<br>
                Helpline: +91 95109 84735 &bull; Direct: ${adminTo}
              </p>
              <p style="margin: 0; font-size: 10px; color: #64748b; line-height: 1.4;">
                PRIVILEGED &amp; CONFIDENTIAL. This automated message is generated by the Shree Chamunda Associates Client Portal Gateway and intended exclusively for designated administrative officers.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
      `.trim();

      // ==========================================
      // 2. CLIENT CONFIRMATION RECEIPT EMAIL
      // ==========================================
      const clientText = `
Dear ${name},

Thank you for reaching out to Shree Chamunda Associates.

We have successfully received your inquiry regarding "${service || 'Tax & Financial Consultation'}". Your reference number is #${refNumber}.

SUMMARY OF YOUR INQUIRY:
- Service: ${service || 'General Consultation'}
- Submitted: ${timestamp} (IST)
- Message: "${message}"

OUR COMMITMENT:
Our senior Chartered Accountants and tax advisors are reviewing your requirements. We will contact you via phone or email within 24 business hours.

If you have urgent inquiries, please contact our support desk directly:
- Phone: +91 95109 84735
- Email: ${adminTo}
- Office: 612, Hill Town Square, MG Road, near Ganesh Opera, Nikol, Ahmedabad, Gujarat - 380049

Best Regards,
Shree Chamunda Associates
Tax & Financial Consultancy Firm
      `.trim();

      const clientHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Confirmation &bull; Shree Chamunda Associates</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1329; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">

  <!-- Hidden Gmail Inbox Preheader -->
  <div style="display: none; font-size: 1px; color: #0b1329; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    We have received your tax consultation inquiry [Ref #${refNumber}]. Our senior CA team is reviewing your requirements.&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0b1329; padding: 32px 12px;">
    <tr>
      <td align="center">
        
        <!-- Main Email Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.35); border: 1px solid #1e293b;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #071324; padding: 32px 32px 28px; text-align: center; border-bottom: 3px solid #f8b400;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <div style="width: 48px; height: 48px; background-color: #f8b400; border-radius: 12px; line-height: 48px; font-size: 24px; display: inline-block; margin-bottom: 12px;">
                      🏛️
                    </div>
                    <h1 style="color: #ffffff; margin: 0 0 6px; font-size: 21px; font-weight: 800; letter-spacing: 0.5px;">
                      SHREE CHAMUNDA ASSOCIATES
                    </h1>
                    <p style="color: #f8b400; margin: 0; font-size: 12.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                      Tax Consultancy &amp; Financial Advisory Firm
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Confirmation Hero Badge -->
          <tr>
            <td style="padding: 34px 32px 24px; text-align: center;">
              
              <!-- Checkmark circle -->
              <div style="width: 58px; height: 58px; border-radius: 50%; background-color: #ecfdf5; border: 2px solid #10b981; display: inline-block; text-align: center; line-height: 56px; font-size: 28px; color: #10b981; margin-bottom: 16px;">
                ✓
              </div>

              <h2 style="color: #0f172a; margin: 0 0 8px; font-size: 20px; font-weight: 800;">
                Inquiry Received Successfully
              </h2>

              <p style="color: #64748b; margin: 0 0 22px; font-size: 14px;">
                Reference Tracking Code: <strong style="color: #071324; font-family: monospace; font-size: 16px; background-color: #f1f5f9; padding: 3px 8px; border-radius: 4px; border: 1px solid #cbd5e1;">#${refNumber}</strong>
              </p>

              <div style="text-align: left; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 26px;">
                <p style="margin: 0 0 10px; color: #0f172a; font-size: 15px; font-weight: 700;">
                  Dear ${safeName},
                </p>
                <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.65;">
                  Thank you for placing your trust in <strong>Shree Chamunda Associates</strong>. We have logged your request regarding <strong style="color: #071324;">${safeService}</strong>. Our senior tax consultants and chartered auditors are currently examining your specifications.
                </p>
              </div>

              <!-- 3-Stage Progress Tracker -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
                <tr>
                  <td style="padding-bottom: 12px; text-align: left;">
                    <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #475569;">
                      📌 Next Steps &amp; Fulfillment Tracker
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
                      
                      <!-- Step 1 -->
                      <tr>
                        <td style="background-color: #f0fdf4; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; width: 34px;" valign="top">
                          <span style="display: inline-block; width: 22px; height: 22px; background-color: #10b981; color: #ffffff; border-radius: 50%; text-align: center; line-height: 22px; font-size: 12px; font-weight: 800;">✓</span>
                        </td>
                        <td style="background-color: #f0fdf4; padding: 12px 16px; border-bottom: 1px solid #e2e8f0;" valign="middle">
                          <div style="font-size: 13.5px; font-weight: 700; color: #166534;">1. Inquiry Logged &amp; Verified</div>
                          <div style="font-size: 12px; color: #15803d; margin-top: 2px;">Your submission was captured into our secure client portal.</div>
                        </td>
                      </tr>

                      <!-- Step 2 -->
                      <tr>
                        <td style="background-color: #fffbeb; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; width: 34px;" valign="top">
                          <span style="display: inline-block; width: 22px; height: 22px; background-color: #f59e0b; color: #ffffff; border-radius: 50%; text-align: center; line-height: 22px; font-size: 12px; font-weight: 800;">⏳</span>
                        </td>
                        <td style="background-color: #fffbeb; padding: 12px 16px; border-bottom: 1px solid #e2e8f0;" valign="middle">
                          <div style="font-size: 13.5px; font-weight: 700; color: #92400e;">2. CA Assessment &amp; Feasibility (Current)</div>
                          <div style="font-size: 12px; color: #b45309; margin-top: 2px;">A designated auditor is analyzing your filing criteria.</div>
                        </td>
                      </tr>

                      <!-- Step 3 -->
                      <tr>
                        <td style="background-color: #ffffff; padding: 12px 16px; width: 34px;" valign="top">
                          <span style="display: inline-block; width: 22px; height: 22px; background-color: #e2e8f0; color: #64748b; border-radius: 50%; text-align: center; line-height: 22px; font-size: 12px; font-weight: 800;">3</span>
                        </td>
                        <td style="background-color: #ffffff; padding: 12px 16px;" valign="middle">
                          <div style="font-size: 13.5px; font-weight: 700; color: #64748b;">3. Consultation &amp; Execution Plan</div>
                          <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">We reach out with personalized guidance within 24 business hours.</div>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>

              <!-- What to Prepare Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px; margin-bottom: 26px;">
                <tr>
                  <td style="padding: 16px 20px; text-align: left;">
                    <div style="font-size: 13.5px; font-weight: 800; color: #1e40af; margin-bottom: 4px;">
                      💡 Documents to Keep Handy
                    </div>
                    <p style="margin: 0; color: #1e3a8a; font-size: 12.5px; line-height: 1.55;">
                      To expedite your filing or advisory, please have your <strong>PAN card, Aadhaar, Bank statements, and relevant invoices / Form 16</strong> accessible when our team connects with you.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Helpline & Fast WhatsApp Connect Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #071324; border-radius: 12px; padding: 22px; color: #ffffff; margin-bottom: 20px;">
                <tr>
                  <td valign="middle" style="text-align: left;">
                    <div style="font-size: 11px; color: #f8b400; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px;">
                      Direct Advisory Helpline
                    </div>
                    <div style="font-size: 18px; font-weight: 800; color: #ffffff; margin-bottom: 2px;">
                      📞 +91 95109 84735
                    </div>
                    <div style="font-size: 12px; color: #94a3b8;">
                      Mon - Sat: 9:00 AM - 7:00 PM IST &bull; Ahmedabad, Gujarat
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <a href="https://wa.me/919510984735?text=Hello%20Shree%20Chamunda%20Associates%2C%20I%20have%20submitted%20an%20inquiry%20Ref%20%23${refNumber}" 
                       target="_blank"
                       style="display: inline-block; background-color: #25d366; color: #ffffff; text-decoration: none; padding: 11px 18px; border-radius: 8px; font-size: 13px; font-weight: 700;">
                      💬 Chat on WhatsApp
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 6px; color: #071324; font-size: 13px; font-weight: 700;">
                Shree Chamunda Associates
              </p>
              <p style="margin: 0 0 8px; color: #64748b; font-size: 11.5px; line-height: 1.4;">
                612, Hill Town Square, MG Road, near Ganesh Opera, Nikol, Ahmedabad, Gujarat - 380049<br>
                Official Desk: ${adminTo}
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 10.5px;">
                &copy; ${new Date().getFullYear()} Shree Chamunda Associates. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
      `.trim();

      // Dispatch Both Emails concurrently with clean error boundaries
      const [adminResult, clientResult] = await Promise.allSettled([
        mailTransporter.sendMail({
          from: `"${safeName} [Client Lead]" <${process.env.SMTP_USER || 'shreechamundaassociates0905@gmail.com'}>`,
          to: adminTo,
          replyTo: `"${safeName}" <${safeEmail}>`,
          subject: `[New Lead: ${safeName}] ${safeService} [#${refNumber}]`,
          text: adminText,
          html: adminHtml,
        }),
        mailTransporter.sendMail({
          from: senderFrom,
          to: email,
          replyTo: adminTo,
          subject: `Inquiry Confirmation - Shree Chamunda Associates [#${refNumber}]`,
          text: clientText,
          html: clientHtml,
        })
      ]);

      if (adminResult.status === 'fulfilled') {
        console.log(`✅ Admin inquiry alert delivered to: ${adminTo}`);
      } else {
        console.error(`❌ Admin inquiry alert failed:`, adminResult.reason?.message || adminResult.reason);
      }

      if (clientResult.status === 'fulfilled') {
        console.log(`✅ Client confirmation receipt delivered to: ${email}`);
      } else {
        console.error(`❌ Client confirmation receipt failed:`, clientResult.reason?.message || clientResult.reason);
      }

    } catch (err) {
      console.error('❌ Critical failure in sendEmails notification service:', err);
    }
  },

  /**
   * Dispatch OTP verification codes via Email or SMS
   */
  sendOTP: async (target, otpCode) => {
    try {
      const isEmail = target.includes('@');
      if (isEmail) {
        const senderFrom = getSecuritySenderEmail();
        const adminEmail = getAdminEmail();

        const text = `
Your Verification Passcode: ${otpCode}

Use this 6-digit code to complete your security verification with Shree Chamunda Associates.
This code is valid for 5 minutes. Do not share this code with anyone.

Shree Chamunda Associates Security Team
        `.trim();

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Security Passcode</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background-color: #071324; padding: 24px 30px; text-align: center; border-bottom: 3px solid #f8b400;">
              <h1 style="color: #f8b400; margin: 0; font-size: 18px; font-weight: 800; letter-spacing: 0.5px;">SHREE CHAMUNDA ASSOCIATES</h1>
              <p style="color: #94a3b8; margin: 4px 0 0; font-size: 12px;">Security Verification Center</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #0f172a; margin: 0 0 10px; font-size: 18px; font-weight: 700; text-align: center;">One-Time Passcode (OTP)</h2>
              <p style="color: #64748b; font-size: 14px; line-height: 1.5; text-align: center; margin: 0 0 24px;">
                Enter this 6-digit code in your browser to verify your identity. This code is valid for <strong>5 minutes</strong>.
              </p>

              <!-- OTP Code Display -->
              <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 18px; text-align: center; margin-bottom: 24px;">
                <span style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #071324; font-family: monospace; padding-left: 10px;">${otpCode}</span>
              </div>

              <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; text-align: center; margin: 0;">
                If you did not request this verification code, please disregard this message or contact support.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 14px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                &copy; ${new Date().getFullYear()} Shree Chamunda Associates Security Team
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `.trim();

        await mailTransporter.sendMail({
          from: senderFrom,
          to: target,
          replyTo: adminEmail,
          subject: `${otpCode} is your verification code - Shree Chamunda Associates`,
          text,
          html,
        });

        console.log(`✅ Security OTP email successfully dispatched to: ${target}`);
      } else {
        const smsMessage = `Verification Code: ${otpCode}. Your Shree Chamunda Associates verification passcode is valid for 5 minutes. Do not share this code.`;
        await notificationService.sendSMS(target, smsMessage);
      }
    } catch (err) {
      console.error('❌ Failed to dispatch security OTP:', err);
      throw err;
    }
  },

  /**
   * Send welcome/registration confirmation alert to email and SMS
   */
  sendRegistrationAlert: async (email, phone, name) => {
    try {
      if (email) {
        const safeName = escapeHtml(name || 'Client');
        const portalUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const senderFrom = getSenderEmail();
        const adminEmail = getAdminEmail();

        const text = `
Welcome to Shree Chamunda Associates!

Dear ${name},
Your client portal account has been successfully created. You can now securely manage your tax filings, track consultations, and upload financial documents.

Log in to your workspace: ${portalUrl}/login

Best Regards,
Shree Chamunda Associates
        `.trim();

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to Shree Chamunda Associates</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background-color: #071324; padding: 28px 30px; text-align: center; border-bottom: 3px solid #f8b400;">
              <h1 style="color: #f8b400; margin: 0; font-size: 22px; font-weight: 800;">SHREE CHAMUNDA ASSOCIATES</h1>
              <p style="color: #cbd5e1; margin: 6px 0 0; font-size: 13px;">Welcome to Your Client Workspace</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #0f172a; margin: 0 0 12px; font-size: 18px;">Welcome, ${safeName}!</h2>
              <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
                Your client profile has been registered. You now have full access to our digital document vaults, real-time filing trackers, and dedicated tax advisory consultations.
              </p>
              
              <div style="text-align: center; margin: 28px 0;">
                <a href="${portalUrl}/login" style="background-color: #071324; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 14px; font-weight: 700; display: inline-block;">
                  🚀 Access Client Portal
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                &copy; ${new Date().getFullYear()} Shree Chamunda Associates. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `.trim();

        await mailTransporter.sendMail({
          from: senderFrom,
          to: email,
          replyTo: adminEmail,
          subject: 'Welcome to Shree Chamunda Associates - Account Created Successfully',
          text,
          html,
        });

        console.log(`✅ Welcome registration email sent to: ${email}`);
      }

      if (phone) {
        const portalUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const smsMessage = `Welcome to Shree Chamunda Associates! Dear ${name}, your client portal account has been successfully created. Log in at: ${portalUrl}/login`;
        await notificationService.sendSMS(phone, smsMessage);
      }
    } catch (err) {
      console.error('❌ Failed to dispatch registration confirmation alerts:', err);
    }
  },

  /**
   * Send security alert on account login to email and SMS
   */
  sendLoginAlert: async (email, phone, name) => {
    try {
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      if (email) {
        const safeName = escapeHtml(name || 'Client');
        const senderFrom = getSecuritySenderEmail();
        const adminEmail = getAdminEmail();

        const text = `
Security Alert: New Account Login Detected

Dear ${name},
A new login session was detected on your Shree Chamunda Associates workspace account at ${timestamp} (IST).

If this was you, no action is required. If you did not authorize this session, please log in immediately and update your password.

Shree Chamunda Associates Security Team
        `.trim();

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Security Alert</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background-color: #ef4444; padding: 20px 24px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 700;">🔒 New Account Login Detected</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 30px;">
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin: 0 0 16px;">
                Dear <strong>${safeName}</strong>,
              </p>
              <p style="color: #475569; font-size: 13.5px; line-height: 1.5; margin: 0 0 16px;">
                A new login session was established on your Shree Chamunda Associates workspace account:
              </p>
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px;">
                <p style="margin: 0 0 6px;"><strong>Time:</strong> ${timestamp} (IST)</p>
                <p style="margin: 0;"><strong>Account:</strong> ${email}</p>
              </div>
              <p style="color: #b45309; background-color: #fffbeb; border-left: 3px solid #f59e0b; padding: 10px 12px; font-size: 12px; margin: 0; border-radius: 4px;">
                If you did not authorize this login, please reset your password immediately.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 12px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                &copy; ${new Date().getFullYear()} Shree Chamunda Associates Security Team
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `.trim();

        await mailTransporter.sendMail({
          from: senderFrom,
          to: email,
          replyTo: adminEmail,
          subject: 'Security Alert: New Login Session Detected - Shree Chamunda Associates',
          text,
          html,
        });

        console.log(`✅ Security login alert email sent to: ${email}`);
      }

      if (phone) {
        const smsMessage = `Security Alert: New login detected on your Shree Chamunda Associates account at ${timestamp}. If this wasn't you, reset your password.`;
        await notificationService.sendSMS(phone, smsMessage);
      }
    } catch (err) {
      console.error('❌ Failed to dispatch login security alerts:', err);
    }
  },

  /**
   * Dispatch SMS alerts via Twilio (fallback to logging)
   */
  sendSMS: async (phone, textMessage) => {
    let toPhone = (phone || '').toString().trim();
    if (toPhone) {
      const digitsOnly = toPhone.replace(/[^0-9]/g, '');
      if (digitsOnly.length === 10) {
        toPhone = `+91${digitsOnly}`;
      } else if (digitsOnly.length > 10 && !toPhone.startsWith('+')) {
        toPhone = `+${digitsOnly}`;
      }
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken && fromPhone) {
      try {
        let twilio;
        try { twilio = require('twilio'); } catch { 
          console.error('❌ Twilio package not installed. Run: npm install twilio');
          return;
        }
        const client = twilio(accountSid, authToken);
        await client.messages.create({
          body: textMessage,
          from: fromPhone,
          to: toPhone
        });
        console.log(`✅ SMS successfully delivered via Twilio to: ${toPhone}`);
      } catch (err) {
        console.error('❌ Twilio SMS delivery failed:', err);
      }
    } else {
      console.log(`
=========================================
💬 [SIMULATED SMS DISPATCHED]
To: ${toPhone || 'Proprietor/Admin'}
Message Content:
-----------------------------------------
${textMessage}
=========================================
      `);
    }
  },

  /**
   * Dispatch push notifications to all subscribed browsers
   */
  sendPushNotification: async (title, body, options = {}) => {
    try {
      const subscriptions = await PushSubscription.find({});
      if (subscriptions.length === 0) return;

      const payload = JSON.stringify({
        title,
        body,
        icon: options.icon || '/assets/logo_new.png',
        badge: options.badge || '/assets/logo_new.png',
        data: options.data || { url: '/' }
      });

      const pushPromises = subscriptions.map((sub) => {
        const pushConfig = {
          endpoint: sub.endpoint,
          keys: {
            auth: sub.keys.auth,
            p256dh: sub.keys.p256dh
          }
        };

        return webPush.sendNotification(pushConfig, payload)
          .catch(async (err) => {
            if (err.statusCode === 410 || err.statusCode === 404) {
              await PushSubscription.findByIdAndDelete(sub._id);
            }
          });
      });

      await Promise.all(pushPromises);
      console.log(`✅ Sent push notification: "${title}" to ${subscriptions.length} clients`);
    } catch (err) {
      console.error('❌ Failed to dispatch push notifications:', err);
    }
  }
};

module.exports = notificationService;
