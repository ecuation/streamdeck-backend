import { Instructions } from "../Shared/Models";
import { OBSService } from "./OBSService";

export class DispatcherService {
  private instructions: Instructions;
  private obs: OBSService;
  constructor(instructions: Instructions, obs: OBSService) {
    this.instructions = instructions;
    this.obs = obs;
  }

  async make() {
    const actions = Object.keys(this.instructions) as ["setScene", "mute"];
    try {
      for (const action of actions) {
        await this[action]();
      }
    } catch (error) {
      throw error;
    }
  }

  async setScene() {
    try {
      await this.obs.switchToScene(this.instructions.setScene);
    } catch (error) {
      throw error;
    }
  }

  async mute() {
    try {
      const actions = this.instructions.mute;
      for (const action of actions) {
        await this.obs.muteAudioItem(action.item, action.status);
      }
    } catch (error) {
      throw error;
    }
  }
}
