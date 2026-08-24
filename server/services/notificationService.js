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

  if (user && pass) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      auth: {
        user: user.trim(),
        pass: pass.trim()
      },
      tls: {
        rejectUnauthorized: false
      }
    });

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
const getSenderEmail = () => `"${SENDER_NAME}" <${process.env.SMTP_USER || 'shubhamadiyecha26@gmail.com'}>`;
const getSecuritySenderEmail = () => `"Shree Chamunda Security" <${process.env.SMTP_USER || 'shubhamadiyecha26@gmail.com'}>`;
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
- Submitted: ${timestamp}

CLIENT MESSAGE / REQUIREMENT:
"${message}"

-----------------------------------------
Reply directly to this email to contact the client.
Shree Chamunda Associates Administrative Dispatch
      `.trim();

      const adminHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Inquiry Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #071324; padding: 28px 30px; text-align: left; border-bottom: 3px solid #f8b400;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h1 style="color: #f8b400; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px;">SHREE CHAMUNDA ASSOCIATES</h1>
                    <p style="color: #94a3b8; margin: 4px 0 0; font-size: 13px;">Enterprise Tax & Compliance Management</p>
                  </td>
                  <td align="right">
                    <span style="background-color: rgba(248, 180, 0, 0.15); color: #f8b400; border: 1px solid rgba(248, 180, 0, 0.3); padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase;">
                      Ref #${refNumber}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 30px;">
              <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
                <p style="margin: 0; color: #166534; font-size: 14px; font-weight: 600;">
                  ⚡ New Client Inquiry Received
                </p>
                <p style="margin: 4px 0 0; color: #15803d; font-size: 12px;">
                  Received on ${timestamp} (IST)
                </p>
              </div>

              <!-- Client Information Table -->
              <h2 style="font-size: 15px; color: #071324; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
                Client Information
              </h2>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 130px; font-weight: 600;">Client Name:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 700;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600;">Email Address:</td>
                  <td style="padding: 8px 0; font-size: 14px;">
                    <a href="mailto:${safeEmail}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${safeEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600;">Phone Number:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">
                    ${phone ? `<a href="tel:${safePhone}" style="color: #0284c7; text-decoration: none;">${safePhone}</a>` : '<span style="color: #94a3b8; font-style: italic;">Not provided</span>'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600;">Service Required:</td>
                  <td style="padding: 8px 0;">
                    <span style="background-color: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 700;">
                      ${safeService}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Client Message -->
              <h2 style="font-size: 15px; color: #071324; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
                Client Inquiry Notes
              </h2>

              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
              </div>

              <!-- Action Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 10px;">
                <tr>
                  <td align="center" style="padding-bottom: 10px;">
                    <a href="mailto:${safeEmail}?subject=Re: Your Inquiry for ${safeService} [Ref %23${refNumber}] - Shree Chamunda Associates" 
                       style="display: inline-block; background-color: #071324; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 14px; font-weight: 700; letter-spacing: 0.3px;">
                      ✉️ Reply Directly to Client
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 18px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                This alert was automatically generated by the Shree Chamunda Associates Portal Gateway.<br>
                Recipient: ${adminTo}
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
- Message: "${message}"

OUR COMMITMENT:
Our senior tax consultants and auditors are reviewing your requirements. We will reach out to you within 24 business hours.

If you have urgent inquiries, please contact our support desk directly:
- Phone: +91 95109 84735
- Email: ${adminTo}
- Office: C-35, Zaveri Estate, Singarva, Kathwada, Ahmedabad, Gujarat

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
  <title>Inquiry Confirmation - Shree Chamunda Associates</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #071324; padding: 28px 30px; text-align: center; border-bottom: 3px solid #f8b400;">
              <h1 style="color: #f8b400; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">SHREE CHAMUNDA ASSOCIATES</h1>
              <p style="color: #cbd5e1; margin: 6px 0 0; font-size: 13px; font-weight: 500;">Premier Tax Consultancy & Financial Advisory Firm</p>
            </td>
          </tr>

          <!-- Confirmation Hero -->
          <tr>
            <td style="padding: 32px 30px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="width: 52px; height: 52px; border-radius: 50%; background-color: #ecfdf5; border: 2px solid #10b981; display: inline-block; text-align: center; line-height: 50px; font-size: 24px; color: #10b981; margin-bottom: 12px;">
                      ✓
                    </div>
                    <h2 style="color: #0f172a; margin: 0 0 8px; font-size: 18px; font-weight: 800;">We Have Received Your Inquiry</h2>
                    <p style="color: #64748b; margin: 0 0 20px; font-size: 14px;">
                      Reference ID: <strong style="color: #0f172a; font-family: monospace; font-size: 15px;">#${refNumber}</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
                Dear <strong>${safeName}</strong>,
              </p>
              <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
                Thank you for contacting <strong>Shree Chamunda Associates</strong>. We have successfully registered your inquiry regarding <strong style="color: #071324;">${safeService}</strong>.
              </p>

              <!-- Inquiry Summary Box -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 10px; font-size: 13px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Your Inquiry Summary</h3>
                <p style="margin: 0 0 8px; font-size: 13.5px; color: #0f172a;"><strong>Service:</strong> ${safeService}</p>
                <p style="margin: 0; font-size: 13.5px; color: #475569; font-style: italic;">"${safeMessage}"</p>
              </div>

              <!-- Next Steps Callout -->
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px 16px; border-radius: 4px; margin-bottom: 24px;">
                <h4 style="margin: 0 0 4px; color: #1e40af; font-size: 14px; font-weight: 700;">What Happens Next?</h4>
                <p style="margin: 0; color: #1e3a8a; font-size: 13px; line-height: 1.5;">
                  Our senior Chartered Accountants and tax consultants are reviewing your details. We will contact you via phone or email within <strong>24 business hours</strong> with personalized recommendations.
                </p>
              </div>

              <!-- Contact Helpline Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #071324; border-radius: 8px; padding: 18px; color: #ffffff; margin-bottom: 20px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px; font-size: 12px; color: #f8b400; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Need Immediate Assistance?</p>
                    <p style="margin: 0; font-size: 16px; font-weight: 800; color: #ffffff;">📞 +91 95109 84735</p>
                    <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">Mon - Sat: 9:00 AM - 7:00 PM IST</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 6px; color: #0f172a; font-size: 13px; font-weight: 700;">
                Shree Chamunda Associates
              </p>
              <p style="margin: 0 0 10px; color: #64748b; font-size: 12px;">
                C-35, Zaveri Estate, Singarva, Kathwada, Ahmedabad, Gujarat 382430
              </p>
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

      // Dispatch Both Emails concurrently with clean error boundaries
      const [adminResult, clientResult] = await Promise.allSettled([
        mailTransporter.sendMail({
          from: senderFrom,
          to: adminTo,
          replyTo: `"${safeName}" <${safeEmail}>`,
          subject: `[New Inquiry] ${safeName} - ${safeService} [#${refNumber}]`,
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
          to: phone
        });
        console.log(`✅ SMS successfully delivered via Twilio to: ${phone}`);
      } catch (err) {
        console.error('❌ Twilio SMS delivery failed:', err);
      }
    } else {
      console.log(`
=========================================
💬 [SIMULATED SMS DISPATCHED]
To: ${phone || 'Proprietor/Admin'}
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
