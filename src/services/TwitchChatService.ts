import { ChatUserstate } from "tmi.js";
import * as tmi from "tmi.js";
import { BotsDB } from "./BotsDB";

export class TwitchChatService {
  tmiClient = new tmi.client({
    identity: {
      username: process.env.TWITCH_USER,
      password: process.env.TWITCH_PASSWORD,
    },
    channels: ["ecuationable"],
  });

  botsDB = new BotsDB();
  lastTimeRaided: Date = this.addMinutes(new Date(), 1);
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
      }
    );

    this.tmiClient.on("raided", (channel, username, viewers) => {
      this.lastTimeRaided = this.addMinutes(new Date(), 5);
      this.writeMessage(
        `${username} ha enviado una raid con ${viewers} espectadores. Gracias!`
      );
    });

    this.tmiClient.on("join", (channel, username) => {
      const currentTime = new Date();
      const lastTimeRaided = this.lastTimeRaided;
      const botDB = new BotsDB();
      if (currentTime.valueOf() > lastTimeRaided.valueOf()) {
        if (!botDB.isBot(username)) {
          this.welcomeMessage();
        }
      }
    });
  }

  hideMainCam() {
    this.socket.emit("obs-channel", {
      hideSource: [
        {
          sourceName: "LogitechCamCroma",
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
