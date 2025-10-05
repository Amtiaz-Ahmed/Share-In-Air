const express = require('express');
const router = express.Router();
const storage = require('../models/storage');
const getClientIp = require('../utils/getClientIp');

// Home page
router.get('/', (req, res) => {
  const viewerIp = getClientIp(req);
  console.log('Viewer IP:', viewerIp); // Debug log
  
  const recentTexts = storage.getAllPublicTexts(viewerIp);
  const recentFiles = storage.getAllPublicFiles(viewerIp);
  
  res.render('index', {
    title: 'ShareInAir - Quick & Easy File Sharing',
    recentTexts,
    recentFiles,
    viewerIp // Pass to view for debugging
  });
});

// How it works page
router.get('/how-it-works', (req, res) => {
  res.render('how-it-works', {
    title: 'How It Works - ShareInAir'
  });
});

// Feedback page
router.get('/feedback', (req, res) => {
  res.render('feedback', {
    title: 'Feedback - ShareInAir',
    success: req.query.success
  });
});

// Handle feedback submission
router.post('/feedback', (req, res) => {
  // In a real app, you would save this feedback
  console.log('Feedback received:', req.body);
  res.redirect('/feedback?success=true');
});

module.exports = router;