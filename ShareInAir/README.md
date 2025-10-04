# ShareInAir

ShareInAir is a modern file and text sharing platform inspired by AirForShare.com. Built with Node.js, Express, and EJS, it provides a clean and simple way to share files and text content with automatic expiration and private sharing capabilities.

## Features

### 📁 File Upload
- Upload up to 10 files per session
- Maximum 20MB per file
- Support for all file types
- Drag and drop interface
- Automatic file cleanup after 60 minutes

### 📝 Text Sharing
- Share large text content without file uploads
- Public text viewing on homepage
- Character count tracking
- Copy-to-clipboard functionality

### 🔒 Private Sharing
- Secure sharing with secret keys
- Protected file and text uploads
- Key-based access control
- Same 60-minute expiration policy

### ⚡ Additional Features
- Auto-expiry: Content expires 60 minutes after last access
- Responsive design for all devices
- Clean, modern UI similar to AirForShare
- Background cleanup service
- Session management
- Error handling and validation

## Tech Stack

- **Backend**: Node.js with Express.js
- **Frontend**: EJS templating engine
- **Architecture**: MVC (Model-View-Controller)
- **Styling**: Custom CSS with modern design
- **File Handling**: Multer for uploads
- **Session Management**: Express Session
- **Utilities**: UUID, dotenv

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ShareInAir
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Copy `.env` file and update if needed:
   ```env
   PORT=3000
   SESSION_SECRET=your-secret-key-here
   MAX_FILE_SIZE=20971520
   MAX_FILES=10
   CLEANUP_INTERVAL=300000
   SESSION_TIMEOUT=3600000
   ```

4. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
ShareInAir/
├── controllers/           # Business logic
│   ├── uploadController.js
│   ├── textController.js
│   ├── privateController.js
│   └── viewController.js
├── models/               # Data models
│   ├── storage.js
│   └── cleanup.js
├── routes/               # Express routes
│   ├── home.js
│   ├── upload.js
│   ├── text.js
│   ├── private.js
│   └── view.js
├── views/                # EJS templates
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs
│   ├── upload.ejs
│   ├── text.ejs
│   ├── private.ejs
│   ├── privateSuccess.ejs
│   ├── privateAccess.ejs
│   ├── viewFile.ejs
│   ├── viewText.ejs
│   ├── how-it-works.ejs
│   ├── feedback.ejs
│   └── error.ejs
├── public/               # Static files
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── images/
│   └── uploads/          # File upload directory
├── server.js             # Entry point
├── package.json
├── .env
└── README.md
```

## API Routes

### Public Routes
- `GET /` - Homepage
- `GET /upload` - Upload form
- `POST /upload` - Handle file upload
- `GET /text` - Text sharing form
- `POST /text` - Handle text submission
- `GET /view/file/:id` - View uploaded files
- `GET /view/text/:id` - View shared text
- `GET /how-it-works` - Information page
- `GET /feedback` - Feedback form
- `POST /feedback` - Handle feedback submission

### Private Routes
- `GET /private` - Private sharing form
- `POST /private/files` - Handle private file upload
- `POST /private/text` - Handle private text sharing
- `GET /private/access` - Private access form
- `GET /private/:key` - Access private content with key

## Usage Examples

### 1. Upload Files
1. Navigate to `/upload`
2. Select files or drag and drop
3. Click "Upload Files"
4. Share the generated link

### 2. Share Text
1. Go to `/text`
2. Enter or paste your text
3. Click "Share Text"
4. Copy the shareable link

### 3. Private Sharing
1. Visit `/private`
2. Choose between files or text
3. Set a secret key
4. Upload content
5. Share the secret key with recipients

### 4. Access Private Content
1. Go to `/private/access`
2. Enter the secret key
3. View the protected content

## Configuration

### Environment Variables
- `PORT`: Server port (default: 3000)
- `SESSION_SECRET`: Secret key for sessions
- `MAX_FILE_SIZE`: Maximum file size in bytes (default: 20MB)
- `MAX_FILES`: Maximum number of files per upload (default: 10)
- `CLEANUP_INTERVAL`: Cleanup interval in milliseconds (default: 5 minutes)
- `SESSION_TIMEOUT`: Session timeout in milliseconds (default: 60 minutes)

### File Storage
- Files are stored in `public/uploads/`
- Automatic cleanup removes expired files
- Files are deleted 60 minutes after last access

## Security Features

- File upload validation
- XSS protection through EJS escaping
- Secret key protection for private content
- Session-based security
- File size and count limits
- Automatic content expiration

## Development

### Running in Development Mode
```bash
npm run dev
```

### Adding New Features
1. Create controllers in `controllers/`
2. Add routes in `routes/`
3. Create EJS templates in `views/`
4. Update CSS in `public/css/`
5. Add JavaScript in `public/js/`

### Code Style
- Use MVC architecture pattern
- Follow Express.js conventions
- Use consistent naming conventions
- Add error handling for all routes
- Validate user inputs

## Production Deployment

1. **Set production environment variables**
2. **Use a process manager like PM2**
   ```bash
   npm install -g pm2
   pm2 start server.js --name ShareInAir
   ```
3. **Set up reverse proxy (nginx)**
4. **Configure SSL certificates**
5. **Set up file backup for uploads**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For issues and feature requests, please use the feedback form in the application or create an issue in the repository.