const storage = require('../models/storage');

const viewController = {
  // View file by ID
  viewFile: async (req, res) => {
    try {
      const { id } = req.params;
      const content = storage.getFile(id);
      
      if (!content) {
        return res.status(404).render('error', { 
          title: 'File Not Found - ShareInAir',
          error: 'Content not found or expired' 
        });
      }

      const shareUrl = `${req.protocol}://${req.get('host')}/view/file/${id}`;
      
      res.render('viewFile', {
        title: 'View Files - ShareInAir',
        content,
        shareUrl,
        isPrivate: false,
        uploaded: req.query.uploaded
      });
    } catch (error) {
      console.error('View file error:', error);
      res.status(500).render('error', { 
        title: 'View Error - ShareInAir',
        error: 'Failed to view content' 
      });
    }
  },

  // View text by ID
  viewText: async (req, res) => {
    try {
      const { id } = req.params;
      const content = storage.getText(id);
      
      if (!content) {
        return res.status(404).render('error', { 
          title: 'Text Not Found - ShareInAir',
          error: 'Content not found or expired' 
        });
      }

      const shareUrl = `${req.protocol}://${req.get('host')}/view/text/${id}`;
      
      res.render('viewText', {
        title: 'View Text - ShareInAir',
        content,
        shareUrl,
        isPrivate: false,
        shared: req.query.shared
      });
    } catch (error) {
      console.error('View text error:', error);
      res.status(500).render('error', { 
        title: 'View Error - ShareInAir',
        error: 'Failed to view content' 
      });
    }
  }
};

module.exports = viewController;