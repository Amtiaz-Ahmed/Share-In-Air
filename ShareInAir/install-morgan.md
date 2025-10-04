# Installing Morgan for ShareInAir

## Quick Installation

Run this command in your ShareInAir directory:

```bash
npm install morgan
```

## What Morgan Does

Morgan will now log all HTTP requests to your ShareInAir server, showing:

- **Timestamp** - When the request happened
- **IP Address** - Who made the request  
- **HTTP Method** - GET, POST, etc.
- **URL** - Which endpoint was accessed
- **Status Code** - 200 (success), 404 (not found), etc.
- **Response Time** - How fast your server responded
- **User Agent** - Browser/device information

## Example Log Output

```
2024-01-15T10:30:45.123Z ::1 GET /upload 200 1234 - 45.67 ms - Mozilla/5.0...
2024-01-15T10:30:50.456Z ::1 POST /upload 302 - - 234.56 ms - Mozilla/5.0...
2024-01-15T10:31:00.789Z ::1 GET /view/file/abc123 200 5678 - 12.34 ms - Mozilla/5.0...
```

## Restart Required

After running `npm install morgan`, restart your ShareInAir server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

You'll immediately see detailed request logging in your console!