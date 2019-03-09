// const Koa = require('koa');
const Koa = require('../lib/koa');
const app = new Koa();
const port = 8080;

app.use((ctx, next) => {
    ctx.body = 'hello koa';
});

app.listen(port, () => {
    console.log(`${port} listening`);
});