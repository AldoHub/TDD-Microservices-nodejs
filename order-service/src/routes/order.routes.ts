import express, {Request, Response, NextFunction } from "express";
import { MessageBroker } from "../utils/broker";
import { OrderEvent } from "../types";

const router = express.Router();


router.post("/order", async(req:Request, res:Response, next:NextFunction) => {
    //send broker message - dummy
    await MessageBroker.publish({
        topic: "OrderEvents",
        headers: {token: req.headers.authorization}, //if no Authorization token, just add whatever string to the header for it
        event: OrderEvent.CREATE_ORDER,
        message: {
            orderId: 1,
            items: [
                {
                    productId: 1,
                    quantity: 1
                },
                {
                    productId: 2,
                    quantity: 2
                }
            ]
        }
    })
    
    return res.status(200).json({message: "create order"})
});


router.get("/order", async(req:Request, res:Response, next:NextFunction) => {
    return res.status(200).json({message: "get order"})
});


router.get("/order/:id", async(req:Request, res:Response, next:NextFunction) => {
    return res.status(200).json({message: "get order by id"})
});


router.delete("/order", async(req:Request, res:Response, next:NextFunction) => {
    return res.status(200).json({message: "delete order"})
});



export default router;