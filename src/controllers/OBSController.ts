import { NextFunction, Request, Response } from "express";
import { BaseError } from "../errorHandlers/BaseError";
import { OBSService } from "../services/OBSService";
import { TwitchChatService } from "../services/TwitchChatService";
import { ApiResponses } from "../utils/ApiResponses";
class OBSController {
  private obs: OBSService;
  private socket: any;
  private twitchService: TwitchChatService;
  constructor(obs: OBSService, socket: any) {
    this.obs = obs;
    this.socket = socket;
    this.twitchService = new TwitchChatService();
  }
  async getCurrentScene(req: Request, res: Response, next: NextFunction) {
    try {
      const currentScene = await this.obs.getCurrentScene();
      return res.send(
        ApiResponses.success("Scene retrieved successfully", currentScene)
      );
    } catch (error: BaseError | any) {
      return next(error);
    }
  }

  async changeItemVisibleStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { itemName, status } = req.body;
      await this.obs.setItemFromCurrentSceneVisibleTo(itemName, status);

      res.send({
        message: "Item status changed successfully",
        itemName,
        status,
      });
    } catch (error) {
      next(JSON.stringify(error));
    }
  }

  async switchScene(req: Request, res: Response, next: NextFunction) {
    try {
      const { sceneName } = req.body;
      await this.obs.switchToScene(sceneName);
      res.send({ message: "scene changed successfully!", sceneName });
    } catch (error) {
      next(error);
    }
  }

  // TODO: Add validation request
  async changeItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { instructions } = req.body;
      this.socket.emit("obs-channel", instructions);
      res.send(ApiResponses.success("Instructions changed successfully!"));
    } catch (error: BaseError | any) {
      next(error);
    }
  }

  async twitchChat(req: Request, res: Response, next: NextFunction) {
    const { message } = req.body;
    this.twitchService.writeMessage(message);
    res.send(ApiResponses.success("Message sent successfully!"));
  }
}

export default OBSController;
