"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BodyPhase = require("koa-bodyparser");
function routerConfig(app, Router) {
    const PORT = 8096;
    app.listen(PORT);
    app.use(BodyPhase());
    app.use(Router.routes());
    // tslint:disable-next-line:max-line-length
    app.use(async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE');
        ctx.set('Access-Control-Request-Method', 'OPTIONS, GET, PUT, POST, DELETE');
        ctx.set('Access-Control-Request-Headers', 'X-Custom-Header');
        ctx.set('Access-Control-Allow-Headers', '*');
        ctx.set('Access-Control-Max-Age', 300);
        if (ctx.request.method === 'OPTIONS') {
            ctx.response.status = 204;
        }
        await next();
    });
    // tslint:disable-next-line:no-console
    console.log(`start in port:${PORT}`);
}
exports.routerConfig = routerConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyQ29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlckNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDRDQUEyQztBQUUzQyxTQUFnQixZQUFZLENBQUMsR0FBRyxFQUFFLE1BQU07SUFDcEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFBO0lBQ2pCLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFBO0lBQ3BCLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7SUFDeEIsMkNBQTJDO0lBQzNDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUN4QixHQUFHLENBQUMsR0FBRyxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQzNDLEdBQUcsQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUUsaUNBQWlDLENBQUMsQ0FBQTtRQUMxRSxHQUFHLENBQUMsR0FBRyxDQUFDLCtCQUErQixFQUFFLGlDQUFpQyxDQUFDLENBQUE7UUFDM0UsR0FBRyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsRUFBRSxpQkFBaUIsQ0FBQyxDQUFBO1FBQzVELEdBQUcsQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDNUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUN0QyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUNsQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUE7U0FDNUI7UUFDRCxNQUFNLElBQUksRUFBRSxDQUFBO0lBQ2hCLENBQUMsQ0FBQyxDQUFBO0lBQ0Ysc0NBQXNDO0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLElBQUksRUFBRSxDQUFDLENBQUE7QUFDeEMsQ0FBQztBQXBCRCxvQ0FvQkMifQ==