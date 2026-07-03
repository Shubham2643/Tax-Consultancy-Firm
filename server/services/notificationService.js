const nodemailer = require('nodemailer');
const webPush = require('web-push');
const PushSubscription = require('../models/PushSubscription');

// Configure Web Push VAPID keys
let vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
};

// Auto-generate VAPID keys dynamically if not provided in .env to ease local testing
if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
  console.log('⚠️  VAPID keys not configured in .env. Generating temporary VAPID keys for local testing...');
  const keys = webPush.generateVAPIDKeys();
  vapidKeys = {
    publicKey: keys.publicKey,
    privateKey: keys.privateKey
  };
  console.log(`🔑 VAPID Public Key: ${vapidKeys.publicKey}`);
}

webPush.setVapidDetails(
  'mailto:shreechamundaassociates0905@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

/**
 * Configure Nodemailer SMTP Transporter
 */
const configureTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }
  
  // Fallback: Mock Transporter that prints to console log
  return {
    sendMail: async (options) => {
      console.log(`
=========================================
📩 [SIMULATED EMAIL DISPATCHED]
To: ${options.to}
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

/**
 * Unified Notification Service
 */
const notificationService = {
  // Expose the active VAPID Public Key for the frontend
  getVapidPublicKey: () => vapidKeys.publicKey,

  /**
   * Broadcast a real-time event to all connected clients via Socket.io
   */
  sendRealTimeMessage: (io, event, data) => {
    if (io) {
      console.log(`🌐 [SOCKET.IO BROADCAST] Event: "${event}"`);
      io.emit(event, data);
    } else {
      console.log('⚠️ [SOCKET.IO] Cannot emit: Socket.io server not initialized');
    }
  },

  /**
   * Dispatch notification emails (one to admin, one copy to customer)
   */
  sendEmails: async ({ name, email, phone, message, service }) => {
    try {
      // 1. Send inquiry receipt alert to Admin
      await mailTransporter.sendMail({
        from: '"Shree Chamunda System Alerts" <alerts@shreechamunda.com>',
        to: process.env.ADMIN_EMAIL || 'shreechamundaassociates0905@gmail.com',
        subject: `New Inquiry Received: ${service || 'General Consultation'}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
            <h2 style="color: #0b1c34; border-bottom: 2px solid #f8b400; padding-bottom: 8px;">New Service Inquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Service Requested:</strong> ${service || 'General'}</p>
            <p><strong>Message / Notes:</strong></p>
            <blockquote style="background: #f9f9f9; border-left: 4px solid #0b1c34; padding: 10px 15px; margin: 10px 0;">
              ${message}
            </blockquote>
            <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
            <p style="font-size: 11px; color: #888;">Shree Chamunda Associates Administrative Alerts.</p>
          </div>
        `
      });

      // 2. Send thank you confirmation to the client
      await mailTransporter.sendMail({
        from: '"Shree Chamunda Associates" <info@shreechamunda.com>',
        to: email,
        subject: `Inquiry Confirmation - ${service || 'Tax Consultation'}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
            <h2 style="color: #0b1c34; border-bottom: 2px solid #f8b400; padding-bottom: 8px;">Inquiry Received</h2>
            <p>Dear ${name},</p>
            <p>Thank you for reaching out to <strong>Shree Chamunda Associates</strong>.</p>
            <p>We have successfully received your request regarding <strong>${service || 'our Tax Consultation services'}</strong>. Our expert team is reviewing your requirements and will contact you within 24 hours.</p>
            <p>Here is a summary of the message we received:</p>
            <blockquote style="background: #f9f9f9; border-left: 4px solid #f8b400; padding: 10px 15px; margin: 10px 0; color: #555;">
              ${message}
            </blockquote>
            <p>If you have any urgent queries, feel free to call us directly at <strong>+91 95109 84735</strong>.</p>
            <br />
            <p>Best Regards,</p>
            <strong>Shree Chamunda Associates</strong>
            <p style="font-size: 11.5px; color: #666; margin-top: 15px;">C-35, Zaveri Estate, Singarva, Kathwada, Ahmedabad, Gujarat</p>
          </div>
        `
      });

      console.log('✅ Email alerts successfully processed');
    } catch (err) {
      console.error('❌ Failed to process email alerts:', err);
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
        const twilio = require('twilio');
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
      // Mock logger
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
      if (subscriptions.length === 0) {
        console.log('ℹ️ No push notification subscriptions found in database');
        return;
      }

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
            // Delete subscription from database if expired/unsubscribed
            if (err.statusCode === 410 || err.statusCode === 404) {
              console.log(`🧹 Removing expired push subscription: ${sub._id}`);
              await PushSubscription.findByIdAndDelete(sub._id);
            } else {
              console.error(`❌ Push notification delivery failed for sub ${sub._id}:`, err.message);
            }
          });
      });

      await Promise.all(pushPromises);
      console.log(`✅ Sent push notification: "${title}" to ${subscriptions.length} clients`);
    } catch (err) {
      console.error('❌ Failed to dispatch push notifications:', err);
    }
  },

  /**
   * Dispatch OTP verification codes via Email or SMS
   */
  sendOTP: async (target, otpCode) => {
    try {
      const isEmail = target.includes('@');
      if (isEmail) {
        await mailTransporter.sendMail({
          from: '"Shree Chamunda Security" <security@shreechamunda.com>',
          to: target,
          subject: `Verification Code: ${otpCode} - Shree Chamunda Associates`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 500px; border: 1px solid #eee; padding: 25px; border-radius: 8px;">
              <h2 style="color: #0b1c34; border-bottom: 2px solid #f8b400; padding-bottom: 8px; margin-top: 0;">Verification Passcode</h2>
              <p>Dear Client,</p>
              <p>Use the following secure one-time passcode (OTP) to complete your verification. This code is valid for <strong>5 minutes</strong> and can only be used once.</p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px 0; text-align: center; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0b1c34; font-family: monospace;">${otpCode}</span>
              </div>
              <p>If you did not request this verification, you can safely ignore this email or contact support if you suspect unauthorized access.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin-top: 24px;" />
              <p style="font-size: 11px; color: #888; text-align: center;">Shree Chamunda Associates Security Team.</p>
            </div>
          `
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
      // 1. Email Alert
      if (email) {
        await mailTransporter.sendMail({
          from: '"Shree Chamunda Associates" <info@shreechamunda.com>',
          to: email,
          subject: 'Welcome to Shree Chamunda Associates - Account Created Successfully',
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; border: 1px solid #eee; padding: 25px; border-radius: 8px;">
              <h2 style="color: #0b1c34; border-bottom: 2px solid #f8b400; padding-bottom: 8px; margin-top: 0;">Welcome to Shree Chamunda Associates!</h2>
              <p>Dear ${name},</p>
              <p>Your client workspace profile has been successfully registered. You now have secure access to our digital document vaults, active tax trackers, and expert filing advisors.</p>
              <p><strong>Registered Email:</strong> ${email}</p>
              ${phone ? `<p><strong>Registered Phone:</strong> ${phone}</p>` : ''}
              <p>To start uploading tax invoices, business bills, or audit requests, please log in to your secure client portal:</p>
              <div style="text-align: center; margin: 24px 0;">
                <a href="http://localhost:5173/login" style="background-color: #0b1c34; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Access Client Portal</a>
              </div>
              <p>If you have any questions or require support, please contact us directly.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin-top: 24px;" />
              <p style="font-size: 11px; color: #888; text-align: center;">Shree Chamunda Associates Support Desk.</p>
            </div>
          `
        });
        console.log(`✅ Welcome registration email sent to: ${email}`);
      }

      // 2. SMS Alert
      if (phone) {
        const smsMessage = `Welcome to Shree Chamunda Associates! Dear ${name}, your client portal account has been successfully created. Log in at: http://localhost:5173/login`;
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

      // 1. Email Alert
      if (email) {
        await mailTransporter.sendMail({
          from: '"Shree Chamunda Security" <security@shreechamunda.com>',
          to: email,
          subject: 'Security Alert: New Account Login Detected',
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; border: 1px solid #eee; padding: 25px; border-radius: 8px;">
              <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 8px; margin-top: 0;">New Account Login</h2>
              <p>Dear ${name},</p>
              <p>We detected a new login session on your Shree Chamunda Associates workspace account.</p>
              <table style="width: 100%; font-size: 14px; margin: 20px 0; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Time (IST):</td>
                  <td style="padding: 8px 0; color: #0f172a;">${timestamp}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Registered Email:</td>
                  <td style="padding: 8px 0; color: #0f172a;">${email}</td>
                </tr>
              </table>
              <p style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px; font-size: 13.5px; color: #b45309; border-radius: 4px;">
                <strong>Important:</strong> If this login was authorized by you, no further action is required. If you did NOT authorize this session, please log in immediately and update your password under your settings panel.
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin-top: 24px;" />
              <p style="font-size: 11px; color: #888; text-align: center;">Shree Chamunda Associates Security Team.</p>
            </div>
          `
        });
        console.log(`✅ Security login alert email sent to: ${email}`);
      }

      // 2. SMS Alert
      if (phone) {
        const smsMessage = `Security Alert: New login detected on your Shree Chamunda Associates account at ${timestamp}. If this wasn't you, reset your password.`;
        await notificationService.sendSMS(phone, smsMessage);
      }
    } catch (err) {
      console.error('❌ Failed to dispatch login security alerts:', err);
    }
  }
};

module.exports = notificationService;
