const { v4: uuidv4 } = require('uuid');

class Storage {
  constructor() {
    this.files = new Map();
    this.texts = new Map();
    this.privateContent = new Map();
  }

  // File operations
  addFile(fileData, isPrivate = false, secretKey = null) {
    const id = uuidv4();
    const entry = {
      id,
      files: fileData,
      uploadTime: new Date(),
      lastAccess: new Date(),
      isPrivate,
      secretKey,
      expiresAt: new Date(Date.now() + 3600000) // 60 minutes
    };

    if (isPrivate && secretKey) {
      this.privateContent.set(secretKey, entry);
    } else {
      this.files.set(id, entry);
    }

    return { id, secretKey };
  }

  getFile(id) {
    const file = this.files.get(id);
    if (file) {
      file.lastAccess = new Date();
      file.expiresAt = new Date(Date.now() + 3600000);
    }
    return file;
  }

  // Text operations
  addText(text, isPrivate = false, secretKey = null) {
    const id = uuidv4();
    const entry = {
      id,
      text,
      uploadTime: new Date(),
      lastAccess: new Date(),
      isPrivate,
      secretKey,
      expiresAt: new Date(Date.now() + 3600000)
    };

    if (isPrivate && secretKey) {
      this.privateContent.set(secretKey, entry);
    } else {
      this.texts.set(id, entry);
    }

    return { id, secretKey };
  }

  getText(id) {
    const text = this.texts.get(id);
    if (text) {
      text.lastAccess = new Date();
      text.expiresAt = new Date(Date.now() + 3600000);
    }
    return text;
  }

  // Private content operations
  getPrivateContent(secretKey) {
    const content = this.privateContent.get(secretKey);
    if (content) {
      content.lastAccess = new Date();
      content.expiresAt = new Date(Date.now() + 3600000);
    }
    return content;
  }

  // Cleanup operations
  cleanExpiredContent() {
    const now = new Date();
    let cleaned = 0;

    // Clean files
    for (const [id, file] of this.files.entries()) {
      if (file.expiresAt < now) {
        this.files.delete(id);
        cleaned++;
      }
    }

    // Clean texts
    for (const [id, text] of this.texts.entries()) {
      if (text.expiresAt < now) {
        this.texts.delete(id);
        cleaned++;
      }
    }

    // Clean private content
    for (const [key, content] of this.privateContent.entries()) {
      if (content.expiresAt < now) {
        this.privateContent.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }

  // Get all public texts (for display on home)
  getAllPublicTexts() {
    const texts = [];
    for (const [id, text] of this.texts.entries()) {
      if (!text.isPrivate) {
        texts.push({
          id: text.id,
          text: text.text.substring(0, 200) + (text.text.length > 200 ? '...' : ''),
          uploadTime: text.uploadTime
        });
      }
    }
    return texts.sort((a, b) => b.uploadTime - a.uploadTime).slice(0, 10);
  }

  // Get all public files (for display on home)
  getAllPublicFiles() {
    const files = [];
    for (const [id, fileData] of this.files.entries()) {
      if (!fileData.isPrivate) {
        files.push({
          id: fileData.id,
          files: fileData.files,
          uploadTime: fileData.uploadTime,
          fileCount: fileData.files.length
        });
      }
    }
    return files.sort((a, b) => b.uploadTime - a.uploadTime).slice(0, 10);
  }
}

// Singleton instance
const storage = new Storage();
module.exports = storage;