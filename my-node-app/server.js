// server.js
const http = require('node:http');

const PORT = 3000;

// Create HTTP server
const server = http.createServer((req, res) => {
  const path = req.url;

  // Set default header
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  // Route handling
  if (path === '/' || path === '/index.html') {
    res.writeHead(200);
    res.end('<h1>Welcome to Node.js Server!</h1><p>This is the home page.</p>');

  } else if (path === '/about') {
    res.writeHead(200);
    res.end('<h1>About Us</h1><p>Node.js is fast, lightweight, and perfect for web services.</p>');

  } else if (path === '/contact') {
    res.writeHead(200);
    res.end(`
      <h1>Contact Us</h1>
      <p>Email shrutiranjan2810.com</p>
      <p>Phone: +987654321</p>
    `);

  } else {
    res.writeHead(404);
    res.end('<h1>404 Not Found</h1><p>The page you are looking for does not exist.</p>');
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Try: /     /about     /contact`);
});