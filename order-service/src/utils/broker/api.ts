import axios from "axios";
import { logger } from "../logger";
import { APIError, AuthorizeError, NotFoundError } from "../errors";
import { Product } from "../../dto/product.dto";
import { User } from "../../dto/User.Model";

const CATALOG_BASE_URL =  process.env.CATALOG_BASE_URL || 'http://localhost:9002'; // grab from env variable
const AUTH_SERVICE_BASE_URL = process.env.AUTH_SERVICE_BASE_URL || "http://localhost:9000";

export const GetProductDetails = async(productId: number) => {

    try{
     //make a call to the catalog microservice - productId route
     const response = await axios.get(`${CATALOG_BASE_URL}/products/${productId}`);
     return response.data as Product;

    }catch(error){
        logger.error(error);
        throw new APIError(`Product With ID ${productId} Not Found`);
    }

}


export const GetStockDetails = async(ids: number[]) => {
    
    try {
        const response = await axios.post(`${CATALOG_BASE_URL}/products/stock`, {ids});
        return response.data as Product[];
    }catch(error){
        logger.error(error);
        throw new NotFoundError("error getting stock details");
    }

} 


export const ValidateUser = async(token: string) => {
    try{
        axios.defaults.headers.common["Authorization"] = token; //assign the token to the header
        const response = await axios.get(`${AUTH_SERVICE_BASE_URL}/validate`, {
            headers: {
                Authorization: token
            }
        });
        
        if(response.status !== 200){
            throw new AuthorizeError("User not authorized");
        }    

        return response.data as User;  // will use express global to assign it to the global namespace for later use - added inside User.Model.ts
    }catch(error) {
        throw new AuthorizeError("User not authorized");
    }


}

