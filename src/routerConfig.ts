import * as Router from 'koa-router'
import * as BodyPhase from 'koa-bodyparser'

export function routerConfig(app, Router) {
    const PORT = 8096
    app.listen(PORT)
    app.use(BodyPhase())
    app.use(Router.routes())
    // tslint:disable-next-line:max-line-length
    app.use(async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*')
        ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE')
        ctx.set('Access-Control-Request-Method', 'OPTIONS, GET, PUT, POST, DELETE')
        ctx.set('Access-Control-Request-Headers', 'X-Custom-Header')
        ctx.set('Access-Control-Allow-Headers', '*')
        ctx.set('Access-Control-Max-Age', 300)
        if (ctx.request.method === 'OPTIONS') {
            ctx.response.status = 204
        }
        await next()
    })
    // tslint:disable-next-line:no-console
    console.log(`start in port:${PORT}`)
}
