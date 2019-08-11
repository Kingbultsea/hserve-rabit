let Koa = require('koa')
let Router = require('koa-router')
let app = new Koa()
let router = new Router()
const bodyParser = require('koa-bodyparser')
const atob = require('atob')

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

  try {
    const array = ctx.request.headers.authorization.split('.')
    const decode = JSON.parse(base64deCode(array[1]))
    ctx.request.roomId = decode.roomId
  } catch (e) {
  }
  ctx.request.roomId = '12345'


  // 测试
  //

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
  // console.log(id)
  let data = anchorCreateData.get(id)
  if (!data) {
    ctx.body = { msg: 'err' }
    return
  }
  ctx.body = anchorCreateData.get(id)
})

// 用户申请玩
router.post('/user/sendjoin', (ctx, next) => {
  const id = ctx.request.roomId
  if (!anchorCreateData.get(id)) {
    // 没有则返回
    return
  }
  const data = ctx.request.body
  console.log('用户申请', data.avatar, data.name)

  const userList = anchorCreateData.get(id).userList
  for (let i of userList) {
    if (i.name === data.name && i.avatar === data.avatar) {
      ctx.body = { msg: 'success', hash: '' }
      return
    }
  }
  console.log('用户申请', data.avatar, data.name)
  anchorCreateData.get(id).userList.add({
    name: data.name,
    avatar: data.avatar
  })
  ctx.body = { msg: 'success', hash: '' }
})

// 用户在线准备状态进入游戏
router.post('/user/ready', (ctx, next) => {
  const selfName = ctx.request.body.name
  const selfAvatar = ctx.request.body.avatar

  const id = ctx.request.roomId
  if (!anchorCreateData.get(id)) {
    // 没有则返回
    return
  }




        for (let [index, i] of anchorCreateData.get(id).inviter.entries()) {

            i.desc = '准备中'

            // 只有自己才可以准备
            if (selfName === i.name && selfAvatar === i.avatar) {
              i.online = true

              // 删除上一次的状态检查
              if (i.onlineTimeout) {
                console.log('delete')
                clearTimeout(i.onlineTimeout)
              }

              console.log('avtive gameing')
              i.status = 5
              // i.round += 1 // 现在设置只有自己的round才能加
            }

            i.front = 500

            // 检测当前round 如果过了秒数还是一样相等， 那么自动输入
            const roundSaver = i.round
            const func = () => {
              // 如果没有检测到用户进入了的话，那么这20000 无效 继续询问
              let typeCount = 0
              if (!anchorCreateData.get(id)) {
                console.log('log out')
                // 没有则返回
                return
              }
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
                  // 别人如果是在线状态 那么只修改自己的随机状态
                  if (i.online && selfName !== i.name && selfAvatar !== i.avatar) {
                    console.log('self return')
                    return
                  }

                  i.round += 1

                  // i.round += 1 // 准备下一个回合的 +1
                  console.log('随机状态触发')
                  let trueActions = []
                  index === 0 ? trueActions = ['left', 'right', 'down'] : ''
                  index === 1 ? trueActions = ['right', 'up', 'down'] : ''
                  index === 2 ? trueActions = ['left', 'up', 'down'] : ''
                  index === 3 ? trueActions = ['left', 'up', 'right'] : ''
                  i.front = trueActions[randomNum(0, 2)]
                  i.desc = '等待中'
                }
              }, 34000)

            }
            setTimeout(func, 5000)

            // ctx.body = { msg: 'success', hash: '' }
            // return

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
        i.round += 1
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
  console.log('创建游戏')
  const id = ctx.request.roomId
  const users = JSON.parse(ctx.request.body.users)
  let inviter = []
  for (let index = 0; index < 4; index++) {
    const i = users[index]
    if (inviter.length >= 4) {
      break
    }

    inviter.push({
      name: users[index] ? i.userNick : randomNum(0, 4000),
      avatar: users[index] ? i.userAvatarUrl : '23' + randomNum(0, 4000),
      status: 0, // 测试 先所有的 都是5 先
      score: 0,
      desc: '准备中',
      front: 500,
      online: false, // 每一个回合的在线状态
      onlineTimeout: null, // 记录在线的steTimeout
      counter: 0,
      round: 0
    })
  }

  // 主播10秒后，还有用户未准备的话，将随机抽取一位点击user/nowdata的用户
  const rad = () => {
    for (let [index, i] of anchorCreateData.get(id).inviter.entries()) {
      if (i.status !== 5) {
        const userList = anchorCreateData.get(id).userList
        const arr = [...userList]
        if (arr.length === 0) {
          setTimeout(rad, 10000)
          return
        }
        const rdN = randomNum(0, arr.length - 1)
        userList.delete(arr[rdN])
        anchorCreateData.get(id).inviter[index] = {
          name: arr[rdN].name,
          avatar: arr[rdN].avatar,
          status: 5, // 继续为0 需要玩家再次按下
          score: 0,
          desc: '准备中',
          front: 500,
          online: false, // 每一个回合的在线状态
          onlineTimeout: null, // 记录在线的steTimeout
          counter: 0,
          round: 0
        }
        if (arr.length <= 1) {
          setTimeout(rad, 10000)
          return
        }
      }
    }
  }
  setTimeout(rad, 10000)

  const score = []
  // 添加气泡
  for (let i = 0; i < 5; i += 1) {
    const nowScore = []
    for (let i = 0; i < 5; i += 1) {
      let count = '' + randomNum(2, 5)
      if (i === 2) {
        count = '' + randomNum(4, 6)
      }
      nowScore.push(count)
    }
    score.push(nowScore)
  }

  let controler = {
    inviter,
    firstGetIn: false, // 首次进入
    userList: new Set(), // 用户申请玩
    score
  }
  anchorCreateData.set(id, controler)

  ctx.body = { msg: 'success' }
})

router.post('/anchor/unload', async (ctx, next) => {
  const id = ctx.request.roomId
  anchorCreateData.delete(id)
  console.log('delete game ' + id)
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

// 主播如果一直都在等待中
// 那么直接随机匹配一位点击参与的用户

// 准备问题
