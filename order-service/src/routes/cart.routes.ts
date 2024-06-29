import express, {Request, Response, NextFunction } from "express";

//repository
import * as repository from "../repository/cart.repository";

//service
import * as cartService from "../service/cart.service";
import { ValidateRequest } from "../utils/validator";
import { CartRequestInput, CartRequestSchema } from "../dto/cartRequest.do";

const router = express.Router();
const repo = repository.CartRepository; 

router.post("/cart", async(req:Request, res:Response, next:NextFunction) => {
    
    try {

        //validate the input data
        const error = ValidateRequest<CartRequestInput>(
            req.body,
            CartRequestSchema
        );        


        if(error){
            return res.status(500).json({error});
        }

        const response = await cartService.CreateCart(req.body as CartRequestInput, repo);
        return res.status(200).json(response);
    }catch(error) {
        return res.status(500).json({error});
    }    

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