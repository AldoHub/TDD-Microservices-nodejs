import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import orderRoutes from "./routes/order.routes";
import cartRoutes from "./routes/cart.routes";
import { httpLogger, HandleErrorWithLogger } from "./utils";
import { MessageBroker } from "./utils/broker";
import { Consumer, Producer } from "kafkajs";
import { MessageType } from "./types";




export const ExpressApp = async() => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(httpLogger);
    
    //connect the producer
    const producer = await MessageBroker.connectProducer<Producer>();
   
    producer.on("producer.connect", () => {
        console.log("Producer Connected")
    });

    //connect the consumer
    const consumer = await MessageBroker.connectConsumer<Consumer>();

    consumer.on("consumer.connect", () => {
        console.log("Consumer Connected")
    });


    //consumer test
    await MessageBroker.subscribe((message: MessageType) => {
        console.log("Consumer received message ", message);
    }, "OrderEvents");



    app.use(orderRoutes);
    app.use(cartRoutes);
    
    app.use("/", (req: Request, res: Response, _: NextFunction) => {
        return res.status(200).json({message: "app working"})
    });
    
    
    app.use(HandleErrorWithLogger);

    return app;
}
