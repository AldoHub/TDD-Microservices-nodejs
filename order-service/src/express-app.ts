import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import orderRoutes from "./routes/order.routes";
import cartRoutes from "./routes/cart.routes";

const app = express();

app.use(express.json());

app.use(orderRoutes);
app.use(cartRoutes);

app.use("/", (req: Request, res: Response, _: NextFunction) => {
    return res.status(200).json({message: "app working"})
});


export default app;