const express = require('express');
const router = express.Router();
const textController = require('../controllers/textController');

// Show text share form
router.get('/', textController.showTextForm);

// Handle text submission
router.post('/', textController.shareText);

module.exports = router;