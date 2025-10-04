const express = require('express');
const router = express.Router();
const storage = require('../models/storage');

// Home page
router.get('/', (req, res) => {
  const recentTexts = storage.getAllPublicTexts();
  const recentFiles = storage.getAllPublicFiles();
  
  res.render('index', {
    title: 'ShareInAir - Quick & Easy File Sharing',
    recentTexts,
    recentFiles
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