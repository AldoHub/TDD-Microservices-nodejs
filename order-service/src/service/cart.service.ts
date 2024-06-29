import { CartRequestInput } from "../dto/cartRequest.do";
import { CartRepositoryType } from "../types/repository.type";
import { GetProductDetails } from "../utils/broker";

export const CreateCart = async(input: CartRequestInput, repo: CartRepositoryType) => {
    
    //get details from the Catalog microservice
    const product = await GetProductDetails(input.productId);
    
    if(product.stock > input.qty){
        throw new Error("product is out of stock");
    }

    const data = repo.create(input);
    return data;
} 

export const GetCart = async(input: unknown, repo: CartRepositoryType) => {
    const data = repo.find(input);
    return data;
} 

export const EditCart = async(input: unknown, repo: CartRepositoryType) => {
    const data = repo.update(input);
    return data;
} 

export const DeleteCart = async(input: unknown, repo: CartRepositoryType) => {
    const data = repo.delete(input);
    return data;
} 