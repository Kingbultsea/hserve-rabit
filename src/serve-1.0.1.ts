import * as Koa from 'koa'
import Atob from 'atob'
import { routerConfig } from './routerConfig'
import * as Router from 'koa-router'

const app = new Koa()
const router = new Router()
// 配置 router
routerConfig(app, router)

router.get('/user/nowdata', (ctx) => {
    ctx.body = '123456 hahahah 2333'
})
