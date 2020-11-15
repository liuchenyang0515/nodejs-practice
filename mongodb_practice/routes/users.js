const router = require('koa-router')()
const { User } = require('../db/model')

router.prefix('/users') // 前缀

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

// 登录(对接数据库的)
// 为了方便同域的测试，暂用get请求
router.get('/login', async (ctx, next) => {
  const { username, password } = ctx.query
  // const { username, password } = ctx.request.body
  const user = await User.findOne({
    username,
    password
  })
  if (user != null) {
    // 登录成功
    ctx.session.userInfo = user // 所有用户信息
    ctx.body = {
      errno: 0,
      data: user
    }
    return 
  }
  // 登录失败，不用操作session

  ctx.body = {
    errno: -1,
    message: '用户名或者密码错误'
  }
})


// 模拟登录
router.get('/login-mock', async (ctx, next) => {
  let str = ''
  const query = ctx.query // url参数，querystring
  if (query.username) {
    // 模拟登陆成功
    ctx.session.userInfo = {
      username: query.username
    }
    str = 'login ok'
  } else {
    // 模拟登陆失败，不用处理session
    str = 'login failed'
  }
  ctx.body = str
})

// 模拟登录验证
router.get('/login-check-mock', async (ctx, next) => {
  ctx.body = ctx.session.userInfo || {}
})

module.exports = router
