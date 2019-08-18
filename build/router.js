const utils = require('./utils');
const path = require('path');
const fs = require('fs');
const Router = require('koa-router');
const MarkdownIt = require('markdown-it')

const router = new Router();
const md = new MarkdownIt({
  html:true,
  linkify:true,
  typographer: true,
});

// 处理文档
router.get('/md/:id', async (ctx, next)=>{
  let docName = ctx.params.id || '';
  let extName = 'md';
  let docs = await utils.findMd(path.resolve(__dirname, '../doc'), extName);
  let mdfile = docs.filter(file=>file.filename===docName)[0];
  if(mdfile){
    let content = fs.readFileSync(mdfile.filepath).toString();
    // 当前 ejs 模板引擎的根路径是项目的根路径,默认模板引擎的扩展名是 .ejs
    await ctx.render("doc/doc.base", {
      title: ctx.params.id,
      content: md.render(content)
    });
  }else{
    ctx.status = 404;
    ctx.body = `Not Found 没有这样的文档：${docName}.${extName}`;
  };
});
router.get('/city', async (ctx, next)=>{
  ctx.body = 'china xiann';
});

module.exports = router;
