const path = require('path');
// const Koa = require('koa');
const Koa = require('../lib/koa');
const Router = require('./middleware/koa-router');

const app = new Koa();
const router = new Router();
const port = 8080;

router.get('/a', (ctx, next) => {
    ctx.body = 'get-a';
    return next();
});

router.get('/b', (ctx, next) => {
    ctx.body = 'get-b';
    return next();
});

app.use(router.routes());

app.listen(port, () => {
    console.log(`${port} listening`);
});