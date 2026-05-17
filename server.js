const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.ico': 'image/x-icon',
    '.png': 'image/png'
};

http.createServer((req, res) => {
    // Sanitize and decode URL path to handle Korean characters if any
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    let filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
    
    // Prevent directory traversal attacks
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Access Denied');
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('파일을 찾을 수 없습니다 (404 Not Found)');
        } else {
            res.writeHead(200, { 
                'Content-Type': MIME_TYPES[ext] || 'text/plain; charset=utf-8',
                'Access-Control-Allow-Origin': '*' // Support local API sharing
            });
            res.end(content);
        }
    });
}).listen(PORT, () => {
    console.log(`[Dongtan Meal Alerter] Server started successfully.`);
    console.log(`👉 Access URL: http://localhost:${PORT}`);
});
