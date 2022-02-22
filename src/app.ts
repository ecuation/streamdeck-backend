import * as express from "express";
import Router from "./routes";
import { OBSService } from "./services/OBSService";
import * as http from "http";
import { Server } from "socket.io";

require("dotenv").config();
const app = express();
const server = http.createServer(app);
const port = 8081;
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET"],
  },
});

const router = new Router(new OBSService(), io);

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use("/api/obs", router.getRouter());

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
