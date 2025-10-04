const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

// View file by ID
router.get('/file/:id', viewController.viewFile);

// View text by ID
router.get('/text/:id', viewController.viewText);

module.exports = router;