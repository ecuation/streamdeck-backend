import { NextFunction, Request, Response } from "express";
import { DispatcherService } from "../services/DispatcherService";
import { OBSService } from "../services/OBSService";
import { OBSError } from "../Shared/Models";

class OBSController {
  private obs: OBSService;
  private socket: any;
  constructor(obs: OBSService, socket: any) {
    this.obs = obs;
    this.socket = socket;
  }
  async getCurrentScene(req: Request, res: Response, next: NextFunction) {
    try {
      this.socket.emit("pinga", { chota: "porongasssss", chucha: "fresca" });
      const currentScene = await this.obs.getCurrentScene();
      return res.send(currentScene);
    } catch (error: OBSError | any) {
      return next(error.description);
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
      res.status(500).json({ error });
    }
  }

  // TODO: Add validation request
  async changeItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { instructions } = req.body;
      const dispatcher = new DispatcherService(instructions, this.obs);
      await dispatcher.make();
      res.send("Instructions changed successfully!");
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

export default OBSController;
