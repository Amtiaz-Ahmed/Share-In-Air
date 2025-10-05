# Deploy IP-Based Filtering Updates to EC2

## Step 1: Create utils directory locally

Create a new folder: `ShareInAir/utils/`

## Step 2: Upload files via FileZilla

Upload these modified files to your EC2:
1. `/models/storage.js` - Updated with IP tracking
2. `/utils/getClientIp.js` - New file
3. `/routes/home.js` - Updated to pass IP
4. `/controllers/uploadController.js` - Updated to track uploader IP
5. `/controllers/textController.js` - Updated to track uploader IP
6. `/controllers/privateController.js` - Updated with getClientIp import

## Step 3: Connect to EC2 and restart

```bash
# Connect via EC2 Instance Connect or SSH
cd ~/ShareInAir

# Create utils directory if it doesn't exist
mkdir -p utils

# Restart the application
pm2 restart shareinair

# Check logs
pm2 logs shareinair
```

## Step 4: Test IP-based sharing

1. Upload a file or text from your computer
2. Check if it appears on the homepage
3. Ask someone on a different network to visit your site
4. They should NOT see your uploads (only same network can see)
5. If they're on the same Wi-Fi/network, they SHOULD see it

## Debug: Check IPs

In the server logs, you'll see:
- `Viewer IP: xxx.xxx.xxx.xxx` - when someone visits
- `Upload from IP: xxx.xxx.xxx.xxx` - when someone uploads
- `Text share from IP: xxx.xxx.xxx.xxx` - when someone shares text

## Note on AWS EC2

Since your EC2 is behind AWS load balancer, the IP detection uses the `x-forwarded-for` header to get the real client IP.