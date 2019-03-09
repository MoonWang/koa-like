// 每个路由设定都创建一个 layer 实例，保存其私有的相关属性
class Layer {
    constructor(path, method, route) {
        this.path = path;
        this.method = method;
        this.route = route;
    }

    match(ctx) {
        let requestPath = ctx.path;
        // 简单判断一下
        if (requestPath == this.path) {
            return true;
        }
        return false;
    }
}

// router 的简单实现，以 get 为例，完整的应该支持多种 method 、支持 params 、甚至支持中间件
module.exports = class Router {
    constructor() {
        this.routeStack = [];
    };

    get(path, route) {
        this.routeStack.push(new Layer(path, 'get', route))
    }

    matchRoute(ctx) {
        return this.routeStack
            .filter(item => item.match(ctx))
            .map(item => item.route);
    }

    compose(routes) {
        return function (ctx) {
            return dispatch(0);
            function dispatch(i) {
                let route = routes[i];
                if (!route) return Promise.resolve();

                return Promise.resolve(route(ctx, () => dispatch(i + 1)));
            }
        }
    }

    // 该方法返回的是 app.use 所需的中间件函数
    routes() {
        return async (ctx, next) => {
            // 1. 找到和 ctx.path 相匹配的路由
            let routes = this.matchRoute(ctx);
            // 2. 执行路由，此处也用 compose 来合并处理
            let fnRoutes = this.compose(routes);
            fnRoutes(ctx).then(() => {
                // 路由匹配成功后不会向下继续匹配
            }).catch(err => {
                console.log(err);
            });
        };
    }
}
