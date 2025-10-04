const storage = require('../models/storage');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure multer for file uploads
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storageConfig,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 20971520, // 20MB
    files: parseInt(process.env.MAX_FILES) || 10
  },
  fileFilter: (req, file, cb) => {
    cb(null, true); // Accept all file types
  }
});

const uploadController = {
  // Show upload form
  showUploadForm: (req, res) => {
    res.render('upload', { 
      title: 'Upload Files - ShareInAir',
      success: req.query.success 
    });
  },

  // Handle file upload
  uploadFiles: async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).render('error', { 
          title: 'Upload Error - ShareInAir',
          error: 'No files uploaded' 
        });
      }

      const fileData = req.files.map(file => ({
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        path: `/uploads/${file.filename}`
      }));

      const result = storage.addFile(fileData, false);
      
      res.redirect(`/view/file/${result.id}?uploaded=true`);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).render('error', { 
        title: 'Upload Error - ShareInAir',
        error: 'Failed to upload files' 
      });
    }
  },

  // Multer middleware
  uploadMiddleware: upload.array('files', parseInt(process.env.MAX_FILES) || 10)
};

module.exports = uploadController;