import express from "express";
import catalogRouter from "./api/catalog/catalog.routes";

//utils
import { httpLogger, HandleErrorWithLogger  } from "./utils";

const app = express();
app.use(express.json());

app.use(httpLogger);

app.use("/", catalogRouter);

app.use(HandleErrorWithLogger)


export default app;