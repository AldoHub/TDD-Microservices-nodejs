import express, {Request, Response, NextFunction } from "express";

//repository
import * as repository from "../repository/cart.repository";

//service
import * as cartService from "../service/cart.service";
import { ValidateRequest } from "../utils/validator";
import { CartRequestInput, CartRequestSchema } from "../dto/cartRequest.do";
import { RequestAuthorizer } from "./middleware";

const router = express.Router();
const repo = repository.CartRepository; 

router.post("/cart", RequestAuthorizer ,async(req:Request, res:Response, next:NextFunction) => {
    
    try {
        //get the user from the Request validator
        const user = req.user;
        if(!user) {
            next(new Error('User not found'));
            return;
        }

        //validate the input data
        const error = ValidateRequest<CartRequestInput>(
            req.body,
            CartRequestSchema
        );        

        if(error){
            return res.status(500).json({error});
        }

        const input: CartRequestInput = req.body; 


        const response = await cartService.CreateCart({...input, customerId: user.id}, repo);
        return res.status(200).json(response);
    }catch(error) {
        return res.status(500).json({error});
    }    

});


router.get("/cart", RequestAuthorizer ,async(req:Request, res:Response, next:NextFunction) => {

    //might come from the auth middleware - JWT - Not implemented
    const response = await cartService.GetCart(req.body.customerId, repo);
    return res.status(200).json(response);
});


router.patch("/cart/:itemId", RequestAuthorizer , async(req:Request, res:Response, next:NextFunction) => {

    //update the cartLineItem
    const lineItemId = req.params.itemId;
    const response = await cartService.EditCart({
        id: parseInt(lineItemId),
        qty: req.body.qty
    }, 
    repo    
    );

    return res.status(200).json(response)
});


router.delete("/cart/:itemId", RequestAuthorizer, async(req:Request, res:Response, next:NextFunction) => {

    const lineItemId = req.params.itemId;

    const response = await cartService.DeleteCart(parseInt(lineItemId), repo);
    return res.status(200).json(response);
});



export default router;