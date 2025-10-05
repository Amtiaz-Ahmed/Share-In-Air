const storage = require('../models/storage');
const getClientIp = require('../utils/getClientIp');

const textController = {
  // Show text share form
  showTextForm: (req, res) => {
    const viewerIp = getClientIp(req);
    const publicTexts = storage.getAllPublicTexts(viewerIp);
    res.render('text', { 
      title: 'Share Text - ShareInAir',
      publicTexts,
      success: req.query.success 
    });
  },

  // Handle text submission
  shareText: async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text || text.trim().length === 0) {
        return res.status(400).render('error', { 
          title: 'Text Share Error - ShareInAir',
          error: 'Please provide some text to share' 
        });
      }

      const uploaderIp = getClientIp(req);
      console.log('Text share from IP:', uploaderIp); // Debug log
      
      const result = storage.addText(text.trim(), false, null, uploaderIp);
      
      res.redirect(`/view/text/${result.id}?shared=true`);
    } catch (error) {
      console.error('Text share error:', error);
      res.status(500).render('error', { 
        title: 'Text Share Error - ShareInAir',
        error: 'Failed to share text' 
      });
    }
  }
};

module.exports = textController;