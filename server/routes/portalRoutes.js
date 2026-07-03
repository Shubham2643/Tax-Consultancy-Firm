const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const UserDocument = require('../models/UserDocument');
const ContactInquiry = require('../models/ContactInquiry');
const Invoice = require('../models/Invoice');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// GET /api/portal/documents — Get logged-in user's uploaded documents
router.get('/documents', authenticate, async (req, res, next) => {
  try {
    const docs = await UserDocument.find({ userId: req.user._id }).sort({ uploadedAt: -1 });
    res.json({ success: true, data: docs });
  } catch (err) {
    next(err);
  }
});

// POST /api/portal/upload — Upload document as base64
router.post('/upload', authenticate, async (req, res, next) => {
  try {
    const { fileData, originalName, mimeType, serviceSlug } = req.body;

    if (!fileData || !originalName) {
      return res.status(400).json({ success: false, message: 'File data and original name are required' });
    }

    // Strip base64 prefix if present
    const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Limit file size to 10MB
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'File size must be under 10MB' });
    }

    const ext = path.extname(originalName) || '.pdf';
    const fileName = `${req.user._id}_${crypto.randomBytes(8).toString('hex')}${ext}`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    fs.writeFileSync(filePath, buffer);

    const doc = await UserDocument.create({
      userId: req.user._id,
      serviceSlug: serviceSlug || '',
      fileName,
      originalName,
      filePath: `/uploads/${fileName}`,
      fileSize: buffer.length,
      mimeType: mimeType || 'application/pdf',
    });

    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/portal/documents/:id — Delete own document
router.delete('/documents/:id', authenticate, async (req, res, next) => {
  try {
    const doc = await UserDocument.findOne({ _id: req.params.id, userId: req.user._id });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Remove file from disk
    const fullPath = path.join(__dirname, '..', doc.filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await UserDocument.deleteOne({ _id: doc._id });
    res.json({ success: true, message: 'Document deleted' });
  } catch (err) {
    next(err);
  }
});

// PUT /api/portal/documents/:id — Update own document metadata or replace content
router.put('/documents/:id', authenticate, async (req, res, next) => {
  try {
    const doc = await UserDocument.findOne({ _id: req.params.id, userId: req.user._id });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const { originalName, serviceSlug, fileData, mimeType } = req.body;

    if (originalName) doc.originalName = originalName;
    if (serviceSlug !== undefined) doc.serviceSlug = serviceSlug;

    // If new file binary content is sent, replace the file on disk
    if (fileData) {
      const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Limit file size to 10MB
      if (buffer.length > 10 * 1024 * 1024) {
        return res.status(400).json({ success: false, message: 'File size must be under 10MB' });
      }

      // Delete old file from disk
      const oldFullPath = path.join(__dirname, '..', doc.filePath);
      if (fs.existsSync(oldFullPath)) {
        fs.unlinkSync(oldFullPath);
      }

      // Save new file to disk
      const ext = path.extname(originalName || doc.originalName) || '.pdf';
      const fileName = `${req.user._id}_${crypto.randomBytes(8).toString('hex')}${ext}`;
      const filePath = path.join(UPLOADS_DIR, fileName);
      fs.writeFileSync(filePath, buffer);

      doc.fileName = fileName;
      doc.filePath = `/uploads/${fileName}`;
      doc.fileSize = buffer.length;
      doc.mimeType = mimeType || 'application/pdf';
    }

    await doc.save();
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

// GET /api/portal/documents/download/:id — Secure authenticated document download
router.get('/documents/download/:id', authenticate, async (req, res, next) => {
  try {
    const doc = await UserDocument.findOne({ _id: req.params.id, userId: req.user._id });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

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

// GET /api/portal/inquiries — Get logged-in user's contact inquiries
router.get('/inquiries', authenticate, async (req, res, next) => {
  try {
    const inquiries = await ContactInquiry.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json({ success: true, data: inquiries });
  } catch (err) {
    next(err);
  }
});

// POST /api/portal/inquiries/:id/comment — Add client comment to discussion thread
router.post('/inquiries/:id/comment', authenticate, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const inquiry = await ContactInquiry.findOne({
      _id: req.params.id,
      email: req.user.email,
    });

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    const newComment = {
      senderName: req.user.name,
      senderRole: 'client',
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

// GET /api/portal/invoices — Get logged-in user's invoices
router.get('/invoices', authenticate, async (req, res, next) => {
  try {
    const invoices = await Invoice.find({ client: req.user._id }).sort({ dueDate: 1 });
    res.json({ success: true, data: invoices });
  } catch (err) {
    next(err);
  }
});

// PUT /api/portal/invoices/:id/pay — Pay invoice (mock payment)
router.put('/invoices/:id/pay', authenticate, async (req, res, next) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, client: req.user._id },
      { status: 'paid', paidAt: new Date() },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    // Broadcast Socket Update
    if (req.io) {
      req.io.emit('invoice_paid', invoice);
    }

    res.json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
