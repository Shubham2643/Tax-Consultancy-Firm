const express = require('express');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const crypto = require('crypto');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const UserDocument = require('../models/UserDocument');
const ContactInquiry = require('../models/ContactInquiry');
const Invoice = require('../models/Invoice');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fsSync.existsSync(UPLOADS_DIR)) {
  fsSync.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Allowed file extensions and MIME types for upload validation
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg', 'image/png',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

/**
 * Validate that a resolved file path stays within the uploads directory (path traversal protection)
 */
const isSafePath = (filePath) => {
  const resolved = path.resolve(filePath);
  const targetDir = path.resolve(UPLOADS_DIR);
  return resolved.startsWith(targetDir + path.sep) || resolved === targetDir;
};

/**
 * Verify file magic bytes against extension
 */
const verifyMagicBytes = (buffer, ext) => {
  if (!buffer || buffer.length < 4) return false;
  if (ext === '.pdf') {
    return buffer.toString('utf8', 0, 4) === '%PDF';
  }
  if (ext === '.png') {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  }
  if (ext === '.jpg' || ext === '.jpeg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (ext === '.docx' || ext === '.xlsx') {
    return buffer[0] === 0x50 && buffer[1] === 0x4b;
  }
  if (ext === '.doc' || ext === '.xls') {
    return buffer[0] === 0xd0 && buffer[1] === 0xcf;
  }
  return true;
};

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

    // Validate file extension
    const ext = path.extname(originalName).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return res.status(400).json({ success: false, message: `File type '${ext}' is not allowed. Accepted: ${ALLOWED_EXTENSIONS.join(', ')}` });
    }

    // Validate MIME type
    const safeMime = mimeType || 'application/pdf';
    if (!ALLOWED_MIME_TYPES.includes(safeMime)) {
      return res.status(400).json({ success: false, message: 'Invalid file MIME type' });
    }

    // Strip base64 prefix if present
    const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Limit file size to 10MB
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'File size must be under 10MB' });
    }

    // Magic bytes verification
    if (!verifyMagicBytes(buffer, ext)) {
      return res.status(400).json({ success: false, message: 'File content signature does not match file extension' });
    }

    const fileName = `${req.user._id}_${crypto.randomBytes(8).toString('hex')}${ext}`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    // Path traversal check
    if (!isSafePath(filePath)) {
      return res.status(400).json({ success: false, message: 'Invalid file path' });
    }

    await fs.writeFile(filePath, buffer);

    const doc = await UserDocument.create({
      userId: req.user._id,
      serviceSlug: serviceSlug || '',
      fileName,
      originalName,
      filePath: `/uploads/${fileName}`,
      fileSize: buffer.length,
      mimeType: safeMime,
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
    const targetFile = path.basename(doc.filePath);
    const fullPath = path.join(UPLOADS_DIR, targetFile);
    if (isSafePath(fullPath)) {
      try { await fs.unlink(fullPath); } catch { /* file may already be gone */ }
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

    // If new file binary content is sent, safely replace the file on disk
    if (fileData) {
      const ext = path.extname(originalName || doc.originalName).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return res.status(400).json({ success: false, message: `File type '${ext}' is not allowed` });
      }

      const safeMime = mimeType || 'application/pdf';
      if (!ALLOWED_MIME_TYPES.includes(safeMime)) {
        return res.status(400).json({ success: false, message: 'Invalid file MIME type' });
      }

      const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Limit file size to 10MB
      if (buffer.length > 10 * 1024 * 1024) {
        return res.status(400).json({ success: false, message: 'File size must be under 10MB' });
      }

      // Magic bytes verification
      if (!verifyMagicBytes(buffer, ext)) {
        return res.status(400).json({ success: false, message: 'File content signature does not match file extension' });
      }

      // Save new file to disk FIRST
      const fileName = `${req.user._id}_${crypto.randomBytes(8).toString('hex')}${ext}`;
      const newFilePath = path.join(UPLOADS_DIR, fileName);

      if (!isSafePath(newFilePath)) {
        return res.status(400).json({ success: false, message: 'Invalid file path' });
      }

      await fs.writeFile(newFilePath, buffer);

      // Now that new file write succeeded, safely unlink the old file
      const oldFileName = path.basename(doc.filePath);
      const oldFullPath = path.join(UPLOADS_DIR, oldFileName);
      if (isSafePath(oldFullPath) && oldFileName !== fileName) {
        try { await fs.unlink(oldFullPath); } catch { /* file may already be gone */ }
      }

      doc.fileName = fileName;
      doc.filePath = `/uploads/${fileName}`;
      doc.fileSize = buffer.length;
      doc.mimeType = safeMime;
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

    const targetFile = path.basename(doc.filePath);
    const fullPath = path.join(UPLOADS_DIR, targetFile);
    if (!isSafePath(fullPath)) {
      return res.status(400).json({ success: false, message: 'Invalid file path' });
    }

    try {
      await fs.access(fullPath);
    } catch {
      return res.status(404).json({ success: false, message: 'File not found on server disk' });
    }

    res.setHeader('Content-Type', doc.mimeType || 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(doc.originalName)}"`);

    const { createReadStream } = require('fs');
    const fileStream = createReadStream(fullPath);
    fileStream.on('error', (err) => {
      if (!res.headersSent) {
        next(err);
      }
    });
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

    // Emit to admin room and user room
    if (req.io) {
      req.io.to('admin').emit('inquiry_comment_added', { inquiryId: inquiry._id, comment: newComment });
      req.io.to(`user:${req.user._id}`).emit('inquiry_comment_added', { inquiryId: inquiry._id, comment: newComment });
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

module.exports = router;
