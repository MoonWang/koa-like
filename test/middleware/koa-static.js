const path = require('path');
const fs = require('fs');
const util = require('util');
const mime = require('mime');

const fsStat = util.promisify(fs.stat);

/**
 * 简单版静态文件中间件，完整的应该还可以配置一些参数项，像 express 中的那样
 * 此处只做了最基础的处理，还可以添加缓存处理、文件夹处理、后缀名处理等
 */
module.exports = (rootPath) => async (ctx, next) => {
    let filePath = path.join(rootPath, ctx.path);
    
    // 不存在则调用 next 执行下一个中间件，存在则执行到此结束，处理下 header 等内容后直接设置 ctx.body ，结束执行
    try {
        // 注意 return 关键字是否生效的问题，在回调函数中的 return 并不具备截断执行的能力
        let stat = await fsStat(filePath);
        if(stat.isDirectory()) return next();
    } catch(e) {
        return next();
    }

    // 根据 mime 类型设置响应头
    let contentType = mime.getType(filePath);
    ctx.res.setHeader('Content-Type', contentType);

    let rs = fs.createReadStream(filePath);
    ctx.body = rs;
};
