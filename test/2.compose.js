// const Koa = require('koa');
const Koa = require('../lib/koa');
const app = new Koa();
const port = 8080;

app.use((ctx, next) => {
    debugger
    ctx.body = 'hello koa1';
    debugger
    next();
});

app.use((ctx, next) => {
    debugger
    ctx.body = 'hello koa2';
    debugger
    next();
});

app.use((ctx, next) => {
    debugger
    ctx.body = 'hello koa3';
    debugger
    next();
});

app.listen(port, () => {
    console.log(`${port} listening`);
});