import * as fs from "fs";
import fetch from "node-fetch";
const appRoot = require("app-root-path");

export class BotsDB {
  jsonPath = `${appRoot.path}/src/Database/bots.json`;

  async writeFile(): Promise<void> {
    const data = await this.apiCall();
    fs.writeFileSync(this.jsonPath, JSON.stringify(data), "utf-8");
  }

  async apiCall() {
    const response = await fetch("https://api.twitchinsights.net/v1/bots/all");
    return response.json();
  }

  readFile(): string {
    const data = fs.readFileSync(this.jsonPath, {
      encoding: "utf8",
      flag: "r",
    });

    return data;
  }

  mapBots(file: string) {
    const botsDB = JSON.parse(file.toString()).bots;
    return botsDB.map((user: any) => {
      return user[0];
    });
  }

  getMappedBots() {
    const bots = this.readFile();
    return this.mapBots(bots);
  }

  isBot(username: string): Boolean {
    const bots = this.getMappedBots();
    return bots.includes(username);
  }
}
