const Koa = require('koa')
const Router = require('koa-router')
const testRouter = require('./test')

const app = new Koa()

app.use(testRouter.routes())

app.listen(1314, () => {
  console.log('server is running on http://localhost:1314')
})
