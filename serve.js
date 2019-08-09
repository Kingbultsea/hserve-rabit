let Koa = require('koa')
let Router = require('koa-router')
let app = new Koa()
let router = new Router()
const bodyParser = require('koa-bodyparser')

function randomNum (minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10)
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
    default:
      return 0
  }
}

function base64deCode (str) {
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
}

app.use(bodyParser())
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE')
  ctx.set('Access-Control-Request-Method', 'OPTIONS, GET, PUT, POST, DELETE')
  ctx.set('Access-Control-Request-Headers', 'X-Custom-Header')
  ctx.set('Access-Control-Allow-Headers', '*')
  // ctx.set('Content-Type', 'application/json;charset=utf-8')
  ctx.set('Access-Control-Max-Age', 300)

  console.log(ctx.request.headers)
  const array = ctx.request.headers.authorization.split('.')
  console.log(
    base64deCode(array[1].roomId)
  )
  ctx.request.roomId = base64deCode(array[1].roomId)

  if (ctx.request.method === 'OPTIONS') {
    ctx.response.status = 204
  }
  await next()
})

let controler = {
  inviterCounter: 0,
  inviter: [{
    name: 'αβγδεζηθκλμνξο',
    avatar: 'http://huyaimg.msstatic.com/avatar/1044/05/03f24df0d18ee3c6c534a7dc2d4b98_180_135.jpg?1495094463',
    status: 0,
    score: 0,
    desc: '准备中',
    front: 500,
    counter: 0
  },
  {
    name: '2',
    avatar: 'http://huyaimg.msstatic.com/avatar/1044/05/03f24df0d18ee3c6c534a7dc2d4b98_180_135.jpg?1495094463',
    status: 5,
    score: 0,
    desc: '准备中',
    front: 'right'
  },
  {
    name: '3',
    avatar: 'http://huyaimg.msstatic.com/avatar/1044/05/03f24df0d18ee3c6c534a7dc2d4b98_180_135.jpg?1495094463',
    status: 5,
    score: 0,
    desc: '准备中',
    front: 'left'
  },
  {
    name: '4',
    avatar: 'http://huyaimg.msstatic.com/avatar/1044/05/03f24df0d18ee3c6c534a7dc2d4b98_180_135.jpg?1495094463',
    status: 5,
    score: 0,
    desc: '准备中',
    front: 'down'
  }], // : []{ avatar: string, name: string }
}

// 游戏目前交换情况
router.post('/user/nowdata2', (ctx, next) => {
  const body = ctx.request.body
  const id = ctx.request.roomId
  let data = anchorCreateData.get(id)
  if (!data) {
    return
  }
  data.firstGetIn = true
  ctx.body = anchorCreateData.get(id).inviter
})

// 询问当前准备状态
router.get('/user/nowdata', (ctx, next) => {
  const id = ctx.request.roomId
  let data = anchorCreateData.get(id)
  if (!data) {
    return
  }
  ctx.body = anchorCreateData.get(id).inviter
})

// 用户在线准备状态进入游戏
router.post('/user/ready', (ctx, next) => {
  const id = ctx.request.roomId
  if (!anchorCreateData.get(id)) {
    // 没有则返回
    return
  }
  // 模拟数据 一次触发4个
  if (true) {
    for (let moni of anchorCreateData.get(id).inviter) {
      console.log('触发4次啊')
      function a () {
        const data = {
          name: moni.name,
          avatar: moni.avatar
        }// ctx.request.body
        for (let [index, i] of anchorCreateData.get(id).inviter.entries()) {
          if (data.name === i.name && data.avatar === i.avatar) {
            i.desc = '准备中'
            i.status = 5
            i.front = 500
            i.round += 1

            // 检测当前round 如果过了秒数还是一样相等， 那么自动输入
            const roundSaver = i.round
            const func = () => {
              // 如果没有检测到用户进入了的话，那么这20000 无效 继续询问
              let typeCount = 0
              for (let i of anchorCreateData.get(id).inviter) {
                i.status === 5 ? typeCount += 1 : ''
              }
              if (typeCount <= 3) {
                setTimeout(func, 5000)
                return
              }

              setTimeout(() => {
                if (i.desc === '等待中') {
                  return
                }
                console.log(i.round, roundSaver)
                if (i.round === roundSaver) {
                  console.log('随机状态触发')
                  let trueActions = []
                  index === 0 ? trueActions = ['left', 'right', 'down'] : ''
                  index === 1 ? trueActions = ['right', 'up', 'down'] : ''
                  index === 2 ? trueActions = ['left', 'up', 'down'] : ''
                  index === 3 ? trueActions = ['left', 'up', 'right'] : ''
                  i.front = trueActions[randomNum(0, 2)]

                }
              }, 25000)

            }
            setTimeout(func, 5000)

            ctx.body = { msg: 'success', hash: '' }
            return
          }
        }
      }

      a()

    }
  }


  ctx.body = { msg: 'success', hash: '' }
})

// 用户进入下一个回合
// router.post('/user/next', (ctx, next) => {
//   const id = ctx.request.roomId
//   if (!anchorCreateData.get(id)) {
//     // 没有则返回
//     return
//   }
//   const data = ctx.request.body
//   for (let i of anchorCreateData.get(id).inviter) {
//     if (data.name === i.name && data.avatar === i.avatar) {
//       i.front = 500
//       i.desc = '准备中'
//       ctx.body = { msg: 'success', hash: '' }
//       return
//     }
//   }
//   ctx.body = 'undefinded'
// })

// 用户提交键盘事件
const front = ['up', 'down', 'left', 'right']
router.post('/user/front', (ctx, next) => {
  const id = ctx.request.roomId
  if (!anchorCreateData.get(id)) {
    // 没有则返回
    return
  }
  const data = ctx.request.body
  console.log(data)
  if (front.includes(data.front)) {
    for (let i of anchorCreateData.get(id).inviter) {
      if (data.name === i.name && data.avatar === i.avatar) {
        i.front = data.front
        i.desc = '等待中'
        ctx.body = { msg: 'success', hash: '' }
        return
      }
    }
  }
  ctx.body = 'undefinded'
})

// 用户得分提交
// router.post('/user/score', (ctx, next) => {
//   const data = ctx.request.body
//   console.log(data)
//   if (front.includes(data.front)) {
//     for (let i of controler.inviter) {
//       if (data.name === i.name && data.avatar === i.avatar) {
//         i.score += +data.score
//         i.desc = '准备中'
//         ctx.body = { msg: 'success', hash: '' }
//         return
//       }
//     }
//   }
//   ctx.body = 'undefinded'
// })

// 主播添加邀请人
let anchorCreateData = new Map()
router.post('/anchor/create', async (ctx, next) => {
  const id = ctx.request.roomId
  const users = JSON.parse(ctx.request.body.users)
  let inviter = []
  for (let i of users) {
    if (inviter.length >= 4) {
      break
    }

    inviter.push({
      name: i.userNick,
      avatar: i.userAvatarUrl,
      status: 5, // 测试 先所有的 都是5 先
      score: 0,
      desc: '准备中',
      front: 500,
      counter: 0,
      round: 0
    })
  }
  let controler = {
    inviter,
    firstGetIn: false // 首次进入
  }
  anchorCreateData.set(id, controler)

  ctx.body = { msg: 'success' }
})

router.post('/anchor/unload', async (ctx, next) => {
  const id = ctx.request.roomId
  anchorCreateData.delete(id)

  ctx.body = { msg: 'success' }
})

const port = 3002
console.log(`start in ${port}`)
app.use(router.routes())
app.listen(port)

// 现在卡在用户进入游戏 那个随机状态
// 有些人不按下去
// 有些人直接关闭窗口
// 随机状态只能在服务器中设置
// 我到底是设置自己的状态 还是别人的状态呢？ 只能自己的
// 那么用户首次进入是会执行那个ready的 所以我在哪setTimeout一个就好了
// 但是问题又来了，那个20000 把握不好，会造成用户首次进入，直接就被判断为随机了
// 现在缺一个状态，所有用户进入到界面，才能触发那个20000，其实就是所有的type为5才触发那个20000
