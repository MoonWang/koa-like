const http = require('http');

module.exports = class Koa {
    constructor() {
        this.middlewares = [];
    }

    use (middleware) {
        this.middlewares.push(middleware);
    }

    listen (port, cb) {
        const server = http.createServer((req, res) => {
            console.log(req);
            res.end('base koa');
        });

        server.listen(port, cb);
    }
}