"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dsRouter = require("express").Router();
const commonControllers = require("../lib/commonControllers");
function dsLoginCB1(req, res, next) {
  req.dsAuthCodeGrant.oauth_callback1(req, res, next);
}
function dsLoginCB2(req, res, next) {
  req.dsAuthCodeGrant.oauth_callback2(req, res, next);
}
dsRouter
  .get("/", commonControllers.indexController)
  .get("/ds/login", (req, res, next) => {
    req.dsAuthCodeGrant.login(req, res, next);
  })
  .get("/ds/callback", [dsLoginCB1, dsLoginCB2]) // OAuth callbacks. See below
  .get("/ds/logout", (req, res) => {
    req.dsAuthCodeGrant.logout(req, res);
  })
  .get("/ds/logoutCallback", (req, res) => {
    req.dsAuthCodeGrant.logoutCallback(req, res);
  })
  .get("/ds/mustAuthenticate", commonControllers.mustAuthenticateController)
  .get("/ds-return", commonControllers.returnController);
exports.default = dsRouter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9jb250cm9sbGVycy9kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUM3QyxNQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0FBRTdELFNBQVMsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxJQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUEsQ0FBQSxDQUFDO0FBQ3pGLFNBQVMsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxJQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUEsQ0FBQSxDQUFDO0FBR3pGLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLGlCQUFpQixDQUFDLGVBQWUsQ0FBQztLQUMvQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxHQUFFLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUEsQ0FBQSxDQUFDLENBQUM7S0FDakYsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLDZCQUE2QjtLQUMzRSxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEdBQUUsR0FBRyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFBLENBQUEsQ0FBQyxDQUFDO0tBQ3ZFLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxHQUFFLEdBQUcsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBQztLQUN2RixHQUFHLENBQUMsc0JBQXNCLEVBQUUsaUJBQWlCLENBQUMsMEJBQTBCLENBQUM7S0FDekUsR0FBRyxDQUFDLFlBQVksRUFBRSxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBRTFELGtCQUFlLFFBQVEsQ0FBQSJ9