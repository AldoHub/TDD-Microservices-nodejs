import express, {Request, Response, NextFunction } from "express";
import { MessageBroker } from "../utils/broker";
import { OrderEvent } from "../types";
import { RequestAuthorizer } from "./middleware";
import * as service from "../service/order.service";
import { OrderRepository } from "../repository/order.repository";
import { CartRepository } from "../repository/cart.repository";

const repo = OrderRepository;
const cartRepo = CartRepository;
const router = express.Router();


router.post("/orders",RequestAuthorizer, async(req:Request, res:Response, next:NextFunction) => {
    //send broker message - dummy
    /*
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
    */

    const user = req.user;
    if(!user){
        next(new Error("User not found"));
        return;
    }    

    const response = await service.CreateOrder(user.id, repo, cartRepo);
    return res.status(200).json(response)
});


router.get("/orders", RequestAuthorizer, async(req:Request, res:Response, next:NextFunction) => {
    const user = req.user;
    if(!user){
        next(new Error("User not found"));
        return;
    }    
    const response = await service.GetOrders(user.id, repo);
    return res.status(200).json(response)
});


router.get("/orders/:id", RequestAuthorizer, async(req:Request, res:Response, next:NextFunction) => {
    const user = req.user;
    if(!user){
        next(new Error("User not found"));
        return;
    }    
    const response = await service.GetOrder(user.id, repo);
    return res.status(200).json(response)
});

// only going to be called from the microservices - wont be exposed to the users
router.patch("/orders/:id", RequestAuthorizer, async(req:Request, res:Response, next:NextFunction) => {
   
    //security check for microservice calls only
    const orderId = parseInt(req.params.id);
    const status = req.body.status;

    const response = await service.UpdateOrder(orderId, status, repo);
    return res.status(200).json(response);
});


router.delete("/orders/:id", async(req:Request, res:Response, next:NextFunction) => {
    const user = req.user;
    if(!user){
        next(new Error("User not found"));
        return;
    }    
    const orderId = parseInt(req.params.id);
    const response = await service.DeleteOrder(orderId, repo);
    return res.status(200).json(response)
});



export default router;

