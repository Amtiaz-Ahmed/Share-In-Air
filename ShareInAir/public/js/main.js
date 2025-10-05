// Convert UTC times to local time with different formats for upload vs expiry
function convertUTCToLocal() {
    const timeElements = document.querySelectorAll('.local-time');
    timeElements.forEach(element => {
        const utcTime = element.getAttribute('data-utc');
        const isExpiry = element.classList.contains('expiry-time') || 
                        element.closest('p')?.textContent.includes('Expires');
        
        if (utcTime) {
            const date = new Date(utcTime);
            const now = new Date();
            
            if (isExpiry) {
                // For expiry times - show future time or "Expired"
                if (date > now) {
                    const diffMs = date - now;
                    const diffMins = Math.floor(diffMs / (1000 * 60));
                    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                    
                    if (diffMins < 60) {
                        element.textContent = `in ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
                    } else {
                        element.textContent = `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
                    }
                } else {
                    element.textContent = 'Expired';
                }
            } else {
                // For upload times - show when it was created (past time)
                const diffMs = now - date;
                const diffMins = Math.floor(diffMs / (1000 * 60));
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                
                let timeText;
                if (diffMins < 1) {
                    timeText = 'Just now';
                } else if (diffMins < 60) {
                    timeText = `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
                } else if (diffHours < 24) {
                    timeText = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
                } else {
                    timeText = date.toLocaleString();
                }
                element.textContent = timeText;
            }
            
            element.title = date.toLocaleString(); // Show full time on hover
        }
    });
}

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Convert all UTC times to local time
    convertUTCToLocal();
    
    // Update times every minute for live relative times
    setInterval(convertUTCToLocal, 60000);
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Tab Functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const targetContent = document.getElementById(tabName + '-tab');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // File Upload Functionality
    setupFileUpload();
    setupPrivateFileUpload();

    // Character Count for Text Areas
    setupCharacterCount('textInput', 'charCount');
    setupCharacterCount('privateTextInput', 'privateCharCount');
});

// File Upload Setup
function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const uploadBtn = document.getElementById('uploadBtn');

    if (!uploadArea || !fileInput) return;

    // Click to upload
    uploadArea.addEventListener('click', function(e) {
        if (e.target.type !== 'file') {
            fileInput.click();
        }
    });

    // Drag and drop
    setupDragAndDrop(uploadArea, fileInput);

    // File selection
    fileInput.addEventListener('change', function() {
        handleFileSelection(this.files, fileList, uploadBtn);
    });
}

// Private File Upload Setup
function setupPrivateFileUpload() {
    const uploadArea = document.getElementById('privateUploadArea');
    const fileInput = document.getElementById('privateFileInput');
    const fileList = document.getElementById('privateFileList');
    const uploadBtn = document.getElementById('privateUploadBtn');

    if (!uploadArea || !fileInput) return;

    // Click to upload
    uploadArea.addEventListener('click', function(e) {
        if (e.target.type !== 'file') {
            fileInput.click();
        }
    });

    // Drag and drop
    setupDragAndDrop(uploadArea, fileInput);

    // File selection
    fileInput.addEventListener('change', function() {
        handleFileSelection(this.files, fileList, uploadBtn);
    });
}

// Drag and Drop Setup
function setupDragAndDrop(uploadArea, fileInput) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    uploadArea.addEventListener('drop', function(e) {
        const files = e.dataTransfer.files;
        fileInput.files = files;
        
        // Trigger change event
        const changeEvent = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(changeEvent);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        uploadArea.classList.add('drag-over');
    }

    function unhighlight() {
        uploadArea.classList.remove('drag-over');
    }
}

// Handle File Selection
function handleFileSelection(files, fileList, uploadBtn) {
    fileList.innerHTML = '';
    
    if (files.length === 0) {
        uploadBtn.style.display = 'none';
        return;
    }

    Array.from(files).forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileInfo = document.createElement('div');
        fileInfo.className = 'file-info';
        
        const fileName = document.createElement('span');
        fileName.textContent = file.name;
        fileName.style.fontWeight = '500';
        
        const fileSize = document.createElement('span');
        fileSize.textContent = ` (${formatFileSize(file.size)})`;
        fileSize.style.color = 'var(--text-secondary)';
        
        const fileIcon = document.createElement('i');
        fileIcon.className = 'fas fa-file';
        fileIcon.style.marginRight = '0.5rem';
        fileIcon.style.color = 'var(--primary-color)';
        
        fileInfo.appendChild(fileIcon);
        fileInfo.appendChild(fileName);
        fileInfo.appendChild(fileSize);
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn btn-small';
        removeBtn.style.background = 'var(--danger-color)';
        removeBtn.style.color = 'white';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.addEventListener('click', () => removeFile(index, files, fileList, uploadBtn));
        
        fileItem.appendChild(fileInfo);
        fileItem.appendChild(removeBtn);
        fileList.appendChild(fileItem);
    });
    
    uploadBtn.style.display = 'block';
}

// Remove File
function removeFile(index, files, fileList, uploadBtn) {
    const dt = new DataTransfer();
    Array.from(files).forEach((file, i) => {
        if (i !== index) {
            dt.items.add(file);
        }
    });
    
    // Find the correct file input based on the context
    const uploadForm = uploadBtn.closest('form');
    const fileInput = uploadForm.querySelector('input[type="file"]');
    fileInput.files = dt.files;
    
    handleFileSelection(dt.files, fileList, uploadBtn);
}

// Format File Size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Character Count Setup
function setupCharacterCount(textareaId, countId) {
    const textarea = document.getElementById(textareaId);
    const counter = document.getElementById(countId);
    
    if (!textarea || !counter) return;
    
    textarea.addEventListener('input', function() {
        counter.textContent = this.value.length;
    });
}

// Copy to Clipboard Function
function copyToClipboard(text) {
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return Promise.resolve();
        } catch (err) {
            document.body.removeChild(textArea);
            return Promise.reject(err);
        }
    }
}

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--danger-color)';
            isValid = false;
        } else {
            field.style.borderColor = 'var(--border-color)';
        }
    });
    
    return isValid;
}

// Progress Bar (for file uploads)
function showProgress(progress) {
    let progressBar = document.querySelector('.progress-bar');
    
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: ${progress}%;
            height: 4px;
            background: var(--primary-color);
            transition: width 0.3s;
            z-index: 1000;
        `;
        document.body.appendChild(progressBar);
    } else {
        progressBar.style.width = progress + '%';
    }
    
    if (progress >= 100) {
        setTimeout(() => {
            if (progressBar && progressBar.parentNode) {
                progressBar.parentNode.removeChild(progressBar);
            }
        }, 500);
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem;
        background: var(--surface);
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        max-width: 300px;
        transform: translateX(400px);
        transition: transform 0.3s;
    `;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 
                 'info-circle';
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${icon}" style="color: var(--${type === 'error' ? 'danger' : type === 'success' ? 'secondary' : 'primary'}-color);"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Auto-resize textareas
function autoResizeTextarea() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });
}

// Initialize auto-resize on load
document.addEventListener('DOMContentLoaded', autoResizeTextarea);