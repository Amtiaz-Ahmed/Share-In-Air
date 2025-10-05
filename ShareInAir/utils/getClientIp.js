// Helper function to get the real client IP address
function getClientIp(req) {
  // Check for forwarded IP (when behind proxy/load balancer like AWS ELB)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwarded.split(',')[0].trim();
  }
  
  // Check other common headers
  if (req.headers['x-real-ip']) {
    return req.headers['x-real-ip'];
  }
  
  // Check CloudFlare header
  if (req.headers['cf-connecting-ip']) {
    return req.headers['cf-connecting-ip'];
  }
  
  // Fallback to direct connection
  return req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         req.ip ||
         null;
}

module.exports = getClientIp;