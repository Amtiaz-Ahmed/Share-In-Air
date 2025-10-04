const express = require('express');
const router = express.Router();
const privateController = require('../controllers/privateController');

// Show private share form
router.get('/', privateController.showPrivateForm);

// Show test private form (for debugging)
router.get('/test', privateController.showTestPrivateForm);

// Handle private file upload
router.post('/files', 
  privateController.uploadMiddleware,
  privateController.uploadPrivateFiles
);

// Handle private text share
router.post('/text', privateController.sharePrivateText);

// Show access form
router.get('/access', privateController.showAccessForm);

// Access private content with key
router.get('/:key', privateController.accessPrivateContent);

module.exports = router;