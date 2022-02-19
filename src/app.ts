import * as express from "express";
import Router from "./routes";
import { OBSService } from "./services/OBSService";
require("dotenv").config();

const app = express();
const port = 8081;
const router = new Router(new OBSService());

app.use(express.json());
app.use("/api/obs", router.getRouter());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
