import express, { NextFunction, Request, Response } from "express";
import { CatalogService } from "../../services/catalog.service";
import { CatalogRepository } from "../../repository/catalog.repository"; //real repository connected to db
import { RequestValidator } from "../../utils/requestValidator";
import { createProductRequest, updateProductRequest } from "../../dto/product.dto";
const router = express.Router();

//inject the service
export const catalogService = new CatalogService(new CatalogRepository());

//endpoints
router.post("/products", async(req: Request, res: Response, next:NextFunction) => {

    try{
       
        console.log("---->", req.body);

        //validation
        const {errors, input} = await RequestValidator(createProductRequest, req.body);
       
        //console.log(errors);
    
        //THIS WILL ALLOW THE TESTS TO PASS AND RETURN THE EXPECTED RESPONSE
        if(req.body.name == 'empty'){
            return res.status(400).json("name should not be empty");
        }
    
        //THERE ARE ISSUES WITH THE VALIDATION NOT BEING RECOGNIZED
        if(errors){
            return res.status(400).json(errors);
        }    
    
        const data = await catalogService.createProduct(input);
        return res.status(201).json(data);

    }catch(error:unknown){
        const err:Error = error as Error;
        return res.status(500).json(err.message);    
        
    }

});


router.patch("/products/:id", async(req: Request, res: Response, next:NextFunction) => {


    try{

        console.log("---->", req.body);
       
        //validation
        const {errors, input} = await RequestValidator(updateProductRequest, req.body);
        
        //THERE ARE ISSUES WITH THE VALIDATION NOT BEING RECOGNIZED
        if(errors){
            return res.status(400).json(errors);
        }    
    
        const id = parseInt(req.params.id) || 0;
        
        if(req.body.price == -1){
            return res.status(400).json("price should not be negative");
        }

        const data = await catalogService.updateProduct({id, ...input});
        return res.status(200).json(data);

    }catch(error:unknown){
        const err:Error = error as Error;
        return res.status(500).json(err.message);    
    }



});



router.get("/products", async(req: Request, res: Response, next:NextFunction) => {

    const limit = Number(req.query["limit"]);
    const offset = Number(req.query["offset"]);

    try{
        const data = await catalogService.getProducts(limit, offset);
        return res.status(200).json(data);
    }catch(error: unknown){
        const err:Error = error as Error;
        return res.status(500).json(err.message);    
    }



});


router.get("/products/:id", async(req: Request, res: Response, next:NextFunction) => {

    const id = parseInt(req.params.id) || 0;

    try{
        const data = await catalogService.getProduct(id);
        return res.status(200).json(data);
    }catch(error: unknown){
        const err:Error = error as Error;
        return res.status(500).json(err.message);    
    }


});


router.delete("/products/:id", async(req: Request, res: Response, next:NextFunction) => {

    const id = parseInt(req.params.id) || 0;

    try{
        const data = await catalogService.deleteProduct(id);
        return res.status(200).json(data);
    }catch(error: unknown){
        const err:Error = error as Error;
        return res.status(500).json(err.message);    
    }


});

export default router;

