const path = require('path');
// const Koa = require('koa');
const Koa = require('../lib/koa');
const staticServer = require('./middleware/koa-static');
const app = new Koa();
const port = 8080;

app.use(staticServer(path.join(__dirname, '../public')));

// app.use(async (ctx, next) => {
//     console.log(2);
//     ctx.body = 'hello koa';
// });

app.listen(port, () => {
    console.log(`${port} listening`);
});