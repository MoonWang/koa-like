const http = require('http');

module.exports = class Koa {
    constructor() {
        this.middlewares = [];
        this.ctx = {};
    }

    use (middleware) {
        this.middlewares.push(middleware);
    }

    compose (middlewares) {
        return function fnMiddleware (ctx) {
            return dispatch(0);

            function dispatch(i) {
                let fn = middlewares[i];
                // 递归边界条件
                if(!fn) return Promise.resolve();
                return Promise.resolve(fn(ctx, () => dispatch(i+1)));
            }
        };
    }

    listen (port, cb) {
        const server = http.createServer((req, res) => {
            let ctx = this.ctx;
            ctx.req = req;
            ctx.res = res;

            let fnMiddleware = this.compose(this.middlewares, ctx);
            fnMiddleware(ctx).then(() => {
                console.log(ctx.body);
                res.end('koa compose \n');
            }).catch(() => {

            });
        });

        server.listen(port, cb);
    }
}