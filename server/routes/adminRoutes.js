const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const ContactInquiry = require('../models/ContactInquiry');
const UserDocument = require('../models/UserDocument');
const BlogPost = require('../models/BlogPost');
const User = require('../models/User');
const Service = require('../models/Service');
const FAQ = require('../models/FAQ');
const PricingPlan = require('../models/PricingPlan');
const SiteSettings = require('../models/SiteSettings');
const Invoice = require('../models/Invoice');

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

// GET /api/admin/inquiries — List all contact inquiries
router.get('/inquiries', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;

    const total = await ContactInquiry.countDocuments(filter);
    const inquiries = await ContactInquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: inquiries, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/inquiries/:id — Update inquiry status
router.put('/inquiries/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['new', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const inquiry = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    // Broadcast Socket Event
    if (req.io) {
      req.io.emit('inquiry_status_changed', inquiry);
    }

    res.json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/documents — List all user-uploaded documents
router.get('/documents', async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;

    const docs = await UserDocument.find(filter)
      .populate('userId', 'name email phone')
      .sort({ uploadedAt: -1 });

    res.json({ success: true, data: docs });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/documents/download/:id — Secure authenticated admin document download
router.get('/documents/download/:id', async (req, res, next) => {
  try {
    const doc = await UserDocument.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const fs = require('fs');
    const path = require('path');
    const fullPath = path.join(__dirname, '..', doc.filePath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ success: false, message: 'File not found on server disk' });
    }

    res.setHeader('Content-Type', doc.mimeType || 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(doc.originalName)}"`);

    const fileStream = fs.createReadStream(fullPath);
    fileStream.pipe(res);
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/documents/:id — Approve or reject a document
router.put('/documents/:id', async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const doc = await UserDocument.findByIdAndUpdate(
      req.params.id,
      { status, adminNote: adminNote || '' },
      { new: true }
    ).populate('userId', 'name email phone');

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/users — List all registered users
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/blogs - Create a new blog post
router.post('/blogs', async (req, res, next) => {
  try {
    const { title, slug, category, excerpt, summary, content, bannerImage, image, author } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const blog = await BlogPost.create({
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
      category: category || 'General',
      summary: summary || excerpt || 'Summary of the article.',
      content,
      image: image || bannerImage || '/assets/banner_screenshot.png',
      author: author || 'Admin',
      isActive: true,
    });

    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/blogs/:id - Update a blog post
router.put('/blogs/:id', async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (updateData.excerpt) updateData.summary = updateData.excerpt;
    if (updateData.bannerImage) updateData.image = updateData.bannerImage;
    if (updateData.isActive === undefined && updateData.isPublished !== undefined) {
      updateData.isActive = updateData.isPublished;
    }

    const blog = await BlogPost.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/blogs/:id — Delete a blog post
router.delete('/blogs/:id', async (req, res, next) => {
  try {
    const blog = await BlogPost.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.json({ success: true, message: 'Blog post deleted' });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/stats — Dashboard statistics
router.get('/stats', async (req, res, next) => {
  try {
    const [totalInquiries, newInquiries, totalDocs, pendingDocs, totalUsers] = await Promise.all([
      ContactInquiry.countDocuments(),
      ContactInquiry.countDocuments({ status: 'new' }),
      UserDocument.countDocuments(),
      UserDocument.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'client' }),
    ]);

    res.json({
      success: true,
      data: { totalInquiries, newInquiries, totalDocs, pendingDocs, totalUsers },
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/inquiries/:id — Delete inquiry
router.delete('/inquiries/:id', async (req, res, next) => {
  try {
    const inq = await ContactInquiry.findByIdAndDelete(req.params.id);
    if (!inq) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/documents/:id — Delete document
router.delete('/documents/:id', async (req, res, next) => {
  try {
    const doc = await UserDocument.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/users/:id/role — Change user role
router.put('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['admin', 'client'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/users/:id — Delete user
router.delete('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// --- SERVICES CRUD ---
router.get('/services', async (req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json({ success: true, data: services });
  } catch (err) {
    next(err);
  }
});

router.post('/services', async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
});

router.put('/services/:id', async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
});

router.delete('/services/:id', async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// --- FAQS CRUD ---
router.get('/faqs', async (req, res, next) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1 });
    res.json({ success: true, data: faqs });
  } catch (err) {
    next(err);
  }
});

router.post('/faqs', async (req, res, next) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({ success: true, data: faq });
  } catch (err) {
    next(err);
  }
});

router.put('/faqs/:id', async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, data: faq });
  } catch (err) {
    next(err);
  }
});

router.delete('/faqs/:id', async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// --- PRICING PLANS CRUD ---
router.get('/pricing', async (req, res, next) => {
  try {
    const plans = await PricingPlan.find().sort({ order: 1 });
    res.json({ success: true, data: plans });
  } catch (err) {
    next(err);
  }
});

router.post('/pricing', async (req, res, next) => {
  try {
    const plan = await PricingPlan.create(req.body);
    res.status(201).json({ success: true, data: plan });
  } catch (err) {
    next(err);
  }
});

router.put('/pricing/:id', async (req, res, next) => {
  try {
    const plan = await PricingPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.json({ success: true, data: plan });
  } catch (err) {
    next(err);
  }
});

router.delete('/pricing/:id', async (req, res, next) => {
  try {
    const plan = await PricingPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.json({ success: true, message: 'Plan deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// --- SITE SETTINGS CRUD ---
router.get('/settings', async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
});

router.put('/settings', async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/inquiries/:id/comment — Add CA comment to discussion thread
router.post('/inquiries/:id/comment', async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const inquiry = await ContactInquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    const newComment = {
      senderName: req.user.name || 'Auditor',
      senderRole: 'admin',
      text,
      createdAt: new Date(),
    };

    inquiry.comments.push(newComment);
    await inquiry.save();

    // Broadcast Socket Update
    if (req.io) {
      req.io.emit('inquiry_comment_added', { inquiryId: inquiry._id, comment: newComment });
    }

    res.json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/invoices — Create invoice for a client
router.post('/invoices', async (req, res, next) => {
  try {
    const { client, amount, serviceName, description, dueDate } = req.body;
    if (!client || !amount || !serviceName || !dueDate) {
      return res.status(400).json({ success: false, message: 'Required parameters missing' });
    }

    const user = await User.findById(client);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const invoiceNumber = 'INV-' + Date.now() + Math.floor(Math.random() * 1000);

    const invoice = await Invoice.create({
      client,
      invoiceNumber,
      amount,
      serviceName,
      description,
      dueDate,
      status: 'unpaid',
    });

    // Broadcast Socket Update
    if (req.io) {
      req.io.emit('invoice_created', invoice);
    }

    res.json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/invoices — List all invoices
router.get('/invoices', async (req, res, next) => {
  try {
    const invoices = await Invoice.find({})
      .populate('client', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: invoices });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/invoices/:id — Delete invoice
router.delete('/invoices/:id', async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    // Broadcast Socket Update
    if (req.io) {
      req.io.emit('invoice_deleted', { invoiceId: invoice._id });
    }

    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
