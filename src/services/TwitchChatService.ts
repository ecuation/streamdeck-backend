import { ChatUserstate } from "tmi.js";
import * as tmi from "tmi.js";
import { BotsDB } from "./BotsDB";
const fs = require('fs');
const appRoot = require("app-root-path");

export class TwitchChatService {
  tmiClient = new tmi.client({
    identity: {
      username: process.env.TWITCH_USER,
      password: process.env.TWITCH_PASSWORD,
    },
    channels: ["ecuationable"],
  });

  botsDB = new BotsDB();
  lastTimeRaided: Date = this.addMinutes(new Date(), 10);
  private socket: any;

  //TODO: add types for io argument
  constructor(io: any) {
    this.socket = io;
    this.tmiClient.connect();
    this.botsDB.writeFile();
    this.tmiClient.on(
      "message",
      (target: string, context: ChatUserstate, msg: string, self: boolean) => {
        if (msg === "!ninovimo") {
          this.hideMainCam();
        }
        
        if((context.username == 'ecuationable' || context.mod) && msg === "!autopromo") {
          fs.readFile(`${appRoot.path}/src/last-raider.txt`, 'utf8', (err: any, lastRaider: any) => {
            if (err) {
              console.error(err);
              return;
            }

            this.writeMessage(`Un beso en la rosca para https://twitch.com/${lastRaider} seguidle, no sus ahueveis`);
          });
        }
      }
    );

    this.tmiClient.on("raided", (channel, username, viewers) => {
      this.lastTimeRaided = this.addMinutes(new Date(), 5);
      this.writeMessage(
        `${username} ha enviado una raid con ${viewers} espectadores. Gracias!`
      );

      if(viewers >= 2){
        fs.writeFile(`${appRoot.path}/src/last-raider.txt`, username, (err: any) => {
          if (err) {
            console.error(err);
          }
        });
      }
    });

    this.tmiClient.on("join", (channel, username) => {
      const currentTime = new Date();
      const lastTimeRaided = this.lastTimeRaided;
      const botDB = new BotsDB();
      if (!botDB.isBot(username)) {
        //if (currentTime.valueOf() > lastTimeRaided.valueOf()) {
        console.log("JOINED: " + username);
        //}
      }else {
        if(!['Nightbot', 'Streamelements', 'nightbot', 'streamelements', 'Streamcord', 'streamcord'].includes(username)){
          this.tmiClient.ban('ecuationable', username, 'Sos un bot sucio');
          console.log("Baneado, sos un bot sucio: " + username);
          this.writeMessage(`Baneado, sos un bot sucio ${username}`);
        }
      }
    });
  }

  hideMainCam() {
    this.socket.emit("obs-channel", {
      hideAndShowSource: [
        {
          sourceName: "LogitechBrioCam",
        },
      ],
    });
  }

  addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }

  async connect() {
    this.connectTwitch();
    // await this.connectOBS();
  }

  connectTwitch() {
    this.tmiClient.connect();
  }

  async onMessageHandler(
    target: string,
    context: ChatUserstate,
    msg: any,
    self: boolean
  ): Promise<void> {
    if (self) {
      return;
    } // Ignore messages from the bot
  }

  writeMessage(message: string): void {
    this.tmiClient.say("ecuationable", message);
  }

  welcomeMessage(): void {
    this.writeMessage(`Comando !r para reproducir tu mensaje.`);
  }
}
