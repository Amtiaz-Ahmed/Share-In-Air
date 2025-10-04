const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const morgan = require('morgan');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import cleanup service
const cleanupService = require('./models/cleanup');

// Morgan logging middleware
morgan.token('real-ip', (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
});

morgan.token('timestamp', () => {
  return new Date().toISOString();
});

// Custom format for detailed logging
const morganFormat = ':timestamp :real-ip :method :url :status :res[content-length] - :response-time ms - :user-agent';

// Filter function to skip favicon and static file requests
const skipStaticFiles = (req, res) => {
  // Skip logging for these static file requests
  const skipPaths = [
    '/favicon.ico',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/apple-touch-icon.png',
    '/site.webmanifest',
    '/images/favicon',
    '/css/',
    '/js/',
    '/images/'
  ];
  
  return skipPaths.some(path => req.url.includes(path));
};

// Use different logging levels based on environment
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { skip: skipStaticFiles }));
} else {
  app.use(morgan(morganFormat, { skip: skipStaticFiles }));
  app.use(morgan('dev', { skip: skipStaticFiles })); // Colored output for development
}

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'shareinair-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: parseInt(process.env.SESSION_TIMEOUT) || 3600000 }
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const uploadRoutes = require('./routes/upload');
const textRoutes = require('./routes/text');
const privateRoutes = require('./routes/private');
const viewRoutes = require('./routes/view');
const homeRoutes = require('./routes/home');

app.use('/', homeRoutes);
app.use('/upload', uploadRoutes);
app.use('/text', textRoutes);
app.use('/private', privateRoutes);
app.use('/view', viewRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Application Error:', error);
  console.error('Stack:', error.stack);
  console.error('Request URL:', req.url);
  console.error('Request method:', req.method);
  
  if (error instanceof multer.MulterError) {
    console.error('Multer error:', error.code);
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).render('error', { 
        title: 'Error - ShareInAir',
        error: 'File too large. Maximum size is 20MB per file.' 
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).render('error', { 
        title: 'Error - ShareInAir',
        error: 'Too many files. Maximum 10 files per upload.' 
      });
    }
  }
  
  // More detailed error message for debugging
  const errorMessage = process.env.NODE_ENV === 'development' 
    ? `Error: ${error.message}` 
    : 'Something went wrong!';
    
  res.status(500).render('error', { 
    title: 'Error - ShareInAir',
    error: errorMessage
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { 
    title: 'Page Not Found - ShareInAir',
    error: 'Page not found' 
  });
});

// Start cleanup service
cleanupService.startCleanup();

// Create uploads directory if it doesn't exist
(async () => {
  try {
    await fs.mkdir(path.join(__dirname, 'public', 'uploads'), { recursive: true });
  } catch (err) {
    console.error('Error creating uploads directory:', err);
  }
})();

app.listen(PORT, () => {
  console.log(`🚀 ShareInAir server running on http://localhost:${PORT}`);
  console.log(`📊 Morgan logging enabled - watching all API requests`);
  console.log(`🧹 Cleanup service active - removes expired content every 5 minutes`);
  console.log(`📁 Upload directory: ${path.join(__dirname, 'public', 'uploads')}`);
  console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
});