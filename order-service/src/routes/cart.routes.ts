import express, {Request, Response, NextFunction } from "express";

//repository
import * as repository from "../repository/cart.repository";

//service
import * as cartService from "../service/cart.service";

const router = express.Router();
const repo = repository.CartRepository; 

router.post("/cart", async(req:Request, res:Response, next:NextFunction) => {
    const response = await cartService.CreateCart(req.body, repo);
    return res.status(200).json(response);
});


router.get("/cart", async(req:Request, res:Response, next:NextFunction) => {
    const response = await cartService.GetCart(req.body, repo);
    return res.status(200).json(response);
});


router.patch("/cart", async(req:Request, res:Response, next:NextFunction) => {
    const response = await cartService.EditCart(req.body, repo);
    return res.status(200).json(response)
});


router.delete("/cart", async(req:Request, res:Response, next:NextFunction) => {
    const response = await cartService.DeleteCart(req.body, repo);
    return res.status(200).json(response);
});



export default router;