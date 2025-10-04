const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Show upload form
router.get('/', uploadController.showUploadForm);

// Handle file upload
router.post('/', 
  uploadController.uploadMiddleware,
  uploadController.uploadFiles
);

module.exports = router;