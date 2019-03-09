// const Koa = require('koa');
const Koa = require('../lib/koa');
const app = new Koa();
const port = 8080;

app.use(async (ctx, next) => {
    debugger
    ctx.body = 'hello koa1';
    debugger
    await next();
});

app.use(async (ctx, next) => {
    debugger
    ctx.body = 'hello koa2';
    debugger
    await new Promise((resolve, reject) => {
        setTimeout(resolve, 1000);
    });
    await next();
});

app.use(async (ctx, next) => {
    debugger
    ctx.body = 'hello koa3';
    debugger
    await next();
});

app.listen(port, () => {
    console.log(`${port} listening`);
});