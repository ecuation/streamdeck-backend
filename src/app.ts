import * as express from "express";
import Router from "./routes";
import { OBSService } from "./services/OBSService";
import * as http from "http";
import { Server } from "socket.io";
import { ErrorHandler } from "./errorHandlers/ErrorHandler";
import { BaseError } from "./ErrorHandlers/BaseError";
import { TwitchChatService } from "./services/TwitchChatService";
import * as cors from "cors";

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const port = 8081;
const io = new Server(server, {
  cors: {
    origin: "http://localhost:9000",
    methods: ["GET"],
  },
});
const twitchChatService = new TwitchChatService(io);
const router = new Router(new OBSService(), io, twitchChatService);
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};



app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use("/api/obs", router.getRouter());
app.use(ErrorHandler.returnError);

process.on("unhandledRejection", (error) => {
  throw error;
});

process.on("uncaughtException", (error: BaseError) => {
  ErrorHandler.logError(error);
  if (!ErrorHandler.isOperationalError(error)) {
    process.exit(1);
  }
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
