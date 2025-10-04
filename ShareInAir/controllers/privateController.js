const storage = require('../models/storage');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure multer for private uploads
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
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 20971520,
    files: parseInt(process.env.MAX_FILES) || 10
  }
});

const privateController = {
  // Show private upload form
  showPrivateForm: (req, res) => {
    try {
      console.log('Accessing private form...');
      res.render('private', { 
        title: 'Private Share - ShareInAir',
        success: req.query.success 
      });
    } catch (error) {
      console.error('Error rendering private form:', error);
      res.status(500).render('error', {
        title: 'Private Form Error - ShareInAir',
        error: `Failed to load private form: ${error.message}`
      });
    }
  },

  // Show test private form (for debugging)
  showTestPrivateForm: (req, res) => {
    try {
      console.log('Accessing test private form...');
      res.render('private-test', { 
        title: 'Private Share - ShareInAir',
        success: req.query.success 
      });
    } catch (error) {
      console.error('Error rendering test private form:', error);
      res.status(500).render('error', {
        title: 'Private Form Error - ShareInAir',
        error: `Failed to load test form: ${error.message}`
      });
    }
  },

  // Handle private file upload
  uploadPrivateFiles: async (req, res) => {
    try {
      const { secretKey } = req.body;
      
      if (!secretKey || secretKey.trim().length === 0) {
        return res.status(400).render('error', { 
          title: 'Private Upload Error - ShareInAir',
          error: 'Please provide a secret key' 
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).render('error', { 
          title: 'Private Upload Error - ShareInAir',
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

      const result = storage.addFile(fileData, true, secretKey.trim());
      
      res.render('privateSuccess', {
        title: 'Upload Success - ShareInAir',
        secretKey: result.secretKey
      });
    } catch (error) {
      console.error('Private upload error:', error);
      res.status(500).render('error', { 
        title: 'Private Upload Error - ShareInAir',
        error: 'Failed to upload files' 
      });
    }
  },

  // Handle private text share
  sharePrivateText: async (req, res) => {
    try {
      const { text, secretKey } = req.body;
      
      if (!text || text.trim().length === 0) {
        return res.status(400).render('error', { 
          title: 'Private Text Share Error - ShareInAir',
          error: 'Please provide some text to share' 
        });
      }

      if (!secretKey || secretKey.trim().length === 0) {
        return res.status(400).render('error', { 
          title: 'Private Text Share Error - ShareInAir',
          error: 'Please provide a secret key' 
        });
      }

      const result = storage.addText(text.trim(), true, secretKey.trim());
      
      res.render('privateSuccess', {
        title: 'Share Success - ShareInAir',
        secretKey: result.secretKey
      });
    } catch (error) {
      console.error('Private text share error:', error);
      res.status(500).render('error', { 
        title: 'Private Text Share Error - ShareInAir',
        error: 'Failed to share text' 
      });
    }
  },

  // Show private access form
  showAccessForm: (req, res) => {
    res.render('privateAccess', { 
      title: 'Access Private Content - ShareInAir',
      error: req.query.error 
    });
  },

  // Handle private content access
  accessPrivateContent: async (req, res) => {
    try {
      const { key } = req.params;
      const content = storage.getPrivateContent(key);
      
      if (!content) {
        return res.redirect('/private/access?error=invalid');
      }

      if (content.files) {
        res.render('viewFile', {
          title: 'Private Files - ShareInAir',
          content,
          shareUrl: null,
          isPrivate: true,
          uploaded: false
        });
      } else if (content.text) {
        res.render('viewText', {
          title: 'Private Text - ShareInAir',
          content,
          shareUrl: null,
          isPrivate: true,
          shared: false
        });
      }
    } catch (error) {
      console.error('Private access error:', error);
      res.status(500).render('error', { 
        title: 'Private Access Error - ShareInAir',
        error: 'Failed to access content' 
      });
    }
  },

  // Multer middleware
  uploadMiddleware: upload.array('files', parseInt(process.env.MAX_FILES) || 10)
};

module.exports = privateController;