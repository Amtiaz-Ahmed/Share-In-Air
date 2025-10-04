const storage = require('./storage');
const fs = require('fs').promises;
const path = require('path');

class CleanupService {
  constructor() {
    this.intervalId = null;
  }

  async cleanupFiles() {
    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
    
    try {
      const files = await fs.readdir(uploadsDir);
      const now = Date.now();
      
      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        const stats = await fs.stat(filePath);
        const fileAge = now - stats.atimeMs;
        
        // Delete files older than 60 minutes
        if (fileAge > 3600000) {
          await fs.unlink(filePath);
          console.log(`Deleted expired file: ${file}`);
        }
      }
    } catch (error) {
      console.error('Error during file cleanup:', error);
    }
  }

  startCleanup() {
    // Run cleanup every 5 minutes
    const interval = parseInt(process.env.CLEANUP_INTERVAL) || 300000;
    
    this.intervalId = setInterval(async () => {
      const cleaned = storage.cleanExpiredContent();
      console.log(`Cleaned ${cleaned} expired entries from memory`);
      
      await this.cleanupFiles();
    }, interval);

    console.log('Cleanup service started');
  }

  stopCleanup() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log('Cleanup service stopped');
    }
  }
}

module.exports = new CleanupService();