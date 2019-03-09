# koa

> 简单版的 koa 框架实现，用于学习，加深理解。

# 项目目录

```
```

# 一、基本 HTTP 服务

- 通过 new 创建 application 实例，所以 Koa 返回的是一个 Class
- 基本方法 listen 创建一个 httpServer 并监听指定端口

测试：
- 文件：1.baase.js
- 请求：curl -v http://localhost:8080

# 二、compose 组合中间件

> Koa 中使用 compose 高阶函数，将所有中间件按照`洋葱模型(也叫回形针模型)`的方式组合，返回一个函数。该函数执行返回一个 Promise。

最直观的洋葱模型同步代码解释：
```javascript
function compose (middlewares) {
    return function fnMiddleware (ctx) {
        return function middlewares[0](ctx, function next () {
            return function middlewares[1](ctx, function next () {
                return function middlewares[2](ctx, function next () {
                    //...
                });
            });
        });
    }
}
```

<img src="./images/onionModel.png">

由于中间件总数不具有确定性，所以不能直接使用上述方式进行调用，而应该提取一个方法 `dispatch` 用于`递归`调用所有中间件。

测试：
- 文件：2.compose.js
- 请求：curl -v http://localhost:8080

# 三、常用中间件

## 3.1 static-server

这个没什么好讲的，主要注意处理异步问题，细节可以参考 [express-like/server-static.js](https://github.com/MoonWang/express-like/blob/master/test/middleware/serve-static.js)