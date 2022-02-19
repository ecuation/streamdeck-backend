import * as express from "express";
import OBSController from "./controllers/OBSController";
import { OBSService } from "./services/OBSService";
const router = express.Router();

export default class Router {
  private obs: OBSService;
  private obsController: OBSController;

  constructor(obs: OBSService) {
    this.obs = obs;
    this.obs.connect();
    this.obsController = new OBSController(obs);
    this.makeRoutes();
  }

  makeRoutes() {
    router.get(
      "/current-scene",
      this.obsController.getCurrentScene.bind(this.obsController)
    );

    router.post(
      "/toggle-item-visible-status",
      this.obsController.changeItemVisibleStatus.bind(this.obsController)
    );

    router.post(
      "/switch-scene",
      this.obsController.switchScene.bind(this.obsController)
    );

    router.post(
      "/change-items",
      this.obsController.changeItems.bind(this.obsController)
    );
  }

  getRouter() {
    return router;
  }
}
