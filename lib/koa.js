const http = require('http');

module.exports = class Koa {
    constructor() {
        this.middlewares = [];
    }

    use(middleware) {
        /**
         * 说明：
         *   1. 源码中做了参数错误判断：isFunction
         *   2. 源码中做了参数格式判断：isGeneratorFunction
         *      - 原因： Koa1 使用 Generator 实现，Koa2 使用 async/await 实现
         *      - 处理：警告提示，并使用 convert 包装中间件(内部使用 co 库处理)
         *   3. 如果需要链式调用，最后 return this;
         */
        this.middlewares.push(middleware);
    }

    compose(middlewares) {
        /**
         * 说明：
         *   1. 源码做了参数错误判断：isArray，isFunction [源码](https://github.com/koajs/compose/blob/master/index.js#L20)
         *   2. 源码做了 next 禁止多次调用 [源码](https://github.com/koajs/compose/blob/master/index.js#L36)
         */
        return function fnMiddleware(ctx) {
            return dispatch(0);

            function dispatch(i) {
                let fn = middlewares[i];
                // 递归边界条件
                if (!fn) return Promise.resolve();
                /**
                 * 说明：
                 *   1. 参数2不能只执行 dispatch(i+1) ，一定要进行返回，保证最终返回的是一个 promise ，否则定义中间件执行时会 await 无法暂停执行
                 *   2. 参数2等同于 function next() { reutrn dispatch(i + 1); }
                 */
                return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
            }
        };
    }

    // 主流程-1: listen 创建服务并监听 [源码](https://github.com/koajs/koa/blob/master/lib/application.js#L62)
    listen(port, cb) {
        // 主流程-2: callback 请求处理函数 [源码](https://github.com/koajs/koa/blob/master/lib/application.js#L126)
        /**
         * 说明：
         *   1. 源码是用 this.callback() 的返回函数作为监听函数，可以只执行一次 compose
         */
        const server = http.createServer((req, res) => {
            // 主流程-4: 创建 context [源码](https://github.com/koajs/koa/blob/master/lib/application.js#L160)
            /**
             * 说明：
             *   1. 源码中连等式是为了让各个对象能够互相引用，并且让 ctx 代理 request 和 response 中的属性和方法 
             *   2. 源码中 res、req 是原生的对象；response、request 是封装的对象
             *   3. 应该为每一个请求创建一个上下文对象
             */
            let ctx = {};
            ctx.req = req;
            ctx.res = res;

            // 主流程-3: compose 组合中间件 [源码](https://github.com/koajs/koa/blob/master/lib/application.js#L127)
            let fnMiddleware = this.compose(this.middlewares);

            // 主流程-5: fnMiddleware(ctx).then(handleResponse).catch(onerror) 执行中间件，响应请求 
            /**
             * 说明：
             *   1. 源码中在响应前做了额外处理，默认 404 ，并处理 error [源码](https://github.com/koajs/koa/blob/master/lib/application.js#L145)
             */
            return fnMiddleware(ctx).then(() => {
                // 主流程-6: respond 响应处理 [源码](https://github.com/koajs/koa/blob/master/lib/application.js#L199)
                this.handleResponse(ctx);
            }).catch(console.log);
        });

        server.listen(port, cb);
    }

    handleResponse(ctx) {
        let body = ctx.body;
        if (typeof body == 'string') {
            ctx.res.end(body);
        }
    }
}
