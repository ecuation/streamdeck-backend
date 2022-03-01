import { NextFunction, Request, Response } from "express";
import { APINotFoundError } from "../errorHandlers/ApiNotFoundError";
import { BaseError } from "../errorHandlers/BaseError";
import { DispatcherService } from "../services/DispatcherService";
import { OBSService } from "../services/OBSService";
import { OBSError } from "../Shared/Models";
import { ApiResponses } from "../utils/ApiResponses";

class OBSController {
  private obs: OBSService;
  private socket: any;
  constructor(obs: OBSService, socket: any) {
    this.obs = obs;
    this.socket = socket;
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
}

export default OBSController;
