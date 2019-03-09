const http = require('http');

module.exports = class Koa {
    constructor() {
        this.middlewares = [];
        this.ctx = {};
    }

    use(middleware) {
        this.middlewares.push(middleware);
    }

    compose(middlewares) {
        return function fnMiddleware(ctx) {
            return dispatch(0);

            function dispatch(i) {
                let fn = middlewares[i];
                // 递归边界条件
                if (!fn) return Promise.resolve();
                // 注意：这里的参数2 next 不能单只执行 dispatch(i+1) ，一定要返回，否则定义中间件执行时会 await 无法暂停执行
                return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
                // 等同于 function next() { reutrn dispatch(i + 1); }
            }
        };
    }

    listen(port, cb) {
        const server = http.createServer((req, res) => {
            let ctx = this.ctx;
            ctx.req = req;
            ctx.res = res;

            let fnMiddleware = this.compose(this.middlewares, ctx);
            fnMiddleware(ctx).then(() => {
                this.handleResponse(ctx);
            }).catch(console.log);
        });

        server.listen(port, cb);
    }

    handleResponse(ctx) {
        let body = ctx.body;
        if(typeof body == 'string') {
            ctx.res.end(body);
        }
    }
}
