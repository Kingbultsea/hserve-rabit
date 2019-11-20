const process = require('child_process')
const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()

app.use(router.routes())

const IMAGES_NAME = 'hserve'

const instruct = [
  'docker-compose pull',
  'docker-compose stop',
  'docker-compose rm',
  'docker-compose up -d'
]

// eslint-disable-next-line handle-callback-err
router.post('/wechat', async ctx => {
  let data = await parsePostData(ctx)
  data = JSON.parse(data)
  console.log('from docker webhook', data.repository.namespace, data.repository.name, IMAGES_NAME)
  if (data.repository.namespace === 'hodor123' && data.repository.name === IMAGES_NAME) {
    console.log('run ~')
    process.exec(instruct.join('&'), err => {
      console.log('run')
      err
        ? console.log(err)
        : console.log('process done work', err)
    })
    ctx.response.status = 200
    ctx.response.body = JSON.stringify({
      'state': 'success',
      'description': '387 tests PASSED',
      'context': 'Continuous integration by Acme CI',
      'target_url': 'http://ci.acme.com/results/afd339c1c3d27'
    })
  }
  // console.log(Object.getOwnPropertyNames(ctx), Object.getOwnPropertyNames(ctx.request))
})

function parseQueryStr (queryStr) {
  let queryData = {}
  let queryStrList = queryStr.split('&')
  console.log(queryStrList)
  for (let [ index, queryStr ] of queryStrList.entries() ) {
    let itemList = queryStr.split('=')
    queryData[ itemList[0] ] = decodeURIComponent(itemList[1])
  }
  return queryData
}

function parsePostData (ctx) {
  return new Promise((resolve, reject) => {
    try {
      let postdata = ''
      ctx.req.addListener('data', data => {
        postdata += data
      })
      ctx.req.addListener('end', () => {
        // let parseData = parseQueryStr(postdata)  json 暂时不需要key value
        resolve(postdata)
      })
    } catch (err) {
      reject(err)
    }
  })
}

// process.exec('docker-compose pull info', () => {
// })

app.listen('2333')
