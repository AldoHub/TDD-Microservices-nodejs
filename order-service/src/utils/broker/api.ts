import axios from "axios";
import { logger } from "../logger";
import { APIError } from "../errors";
import { Product } from "../../dto/product.dto";

const CATALOG_BASE_URL =  process.env.CATALOG_BASE_URL || 'http://localhost:9002'; // grab from env variable

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