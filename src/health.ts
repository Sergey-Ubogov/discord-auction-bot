import http from 'http';

export function startHealthServer() {
    return http
        .createServer(function (req, res) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('OK\n');
        })
        .listen(8080);
}

startHealthServer();
