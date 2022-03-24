import * as express from "express";
import { Server } from "socket.io";
import OBSController from "./controllers/OBSController";
import { OBSService } from "./services/OBSService";
import { TwitchChatService } from "./services/TwitchChatService";
const router = express.Router();

export default class Router {
  private obsController: OBSController;
  private socket?: Server;
  constructor(
    obs: OBSService,
    io: Server,
    twitchChatService: TwitchChatService
  ) {
    const socket = this.socketConnect(io);
    this.obsController = new OBSController(obs, socket, twitchChatService);
    this.makeRoutes();
    //obs.connect();
  }

  socketConnect(io: Server) {
    return io.on("connection", (socket) => socket);
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

    router.post(
      "/twitch-chat",
      this.obsController.twitchChat.bind(this.obsController)
    );
  }

  getRouter() {
    return router;
  }
}
