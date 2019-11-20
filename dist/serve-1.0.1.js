"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const routerConfig_1 = require("./routerConfig");
const Router = require("koa-router");
const app = new Koa();
const router = new Router();
// 配置 router
routerConfig_1.routerConfig(app, router);
router.get('/user/nowdata', (ctx) => {
    ctx.body = '123456 hahahah 2333';
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmUtMS4wLjEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc2VydmUtMS4wLjEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQkFBMEI7QUFFMUIsaURBQTZDO0FBQzdDLHFDQUFvQztBQUVwQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3JCLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUE7QUFDM0IsWUFBWTtBQUNaLDJCQUFZLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBRXpCLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDaEMsR0FBRyxDQUFDLElBQUksR0FBRyxxQkFBcUIsQ0FBQTtBQUNwQyxDQUFDLENBQUMsQ0FBQSJ9