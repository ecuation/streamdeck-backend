import * as express from "express";
import Router from "./routes";
import { OBSService } from "./services/OBSService";
import * as swaggerUi from "swagger-ui-express";
const swaggerDocument = require("./swagger.json");

console.log(swaggerDocument);

require("dotenv").config();

const app = express();
const port = 8081;
const router = new Router(new OBSService());

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/obs", router.getRouter());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
