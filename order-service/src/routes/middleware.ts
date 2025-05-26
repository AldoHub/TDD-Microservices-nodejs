import { NextFunction, Request, Response } from "express";
import { ValidateUser } from "../utils";

export const RequestAuthorizer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        if(!req.headers.authorization){
             return res.status(403).json({error: "Unathorized"});
        }

        const userData = await ValidateUser(req.headers.authorization as string);
        //assign the user to the namepace property
        req.user = userData;
        next(); 
    } catch(error) {
        return res.status(403).json({error: "Unathorized"});
    }   

}