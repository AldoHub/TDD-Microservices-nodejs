import { CartEditRequestInput, CartRequestInput } from "../dto/cartRequest.do";
import { CartRepositoryType } from "../repository/cart.repository";
import { GetProductDetails } from "../utils/broker";
import { NotFoundError, logger } from "../utils";
import { CartLineItem } from "../db/schema";

export const CreateCart = async(input: CartRequestInput & {customerId: number}, repo: CartRepositoryType) => {
    
    //get product details from the catalog service
    const product = await GetProductDetails(input.productId);
    logger.info(product);

    if(product.stock < input.qty){
        throw new NotFoundError("product is out of stock");
    }

    //see if the product is already in the cart
    const lineItem = await repo.findCartByProductId(input.customerId, input.productId);
    if(lineItem){
        return repo.updateCart(lineItem.id, lineItem.qty + input.qty)
    }

    return repo.createCart(input.customerId, {
        productId: product.id,
        price: product.price.toString(),
        qty: input.qty,
        itemName: product.name,
        variant: product.variant

    } as CartLineItem);

} 


export const GetCart = async(id: number, repo: CartRepositoryType) => {
    const data = repo.findCart(id);
    
    if(!data){
        throw new NotFoundError("cart not found");
    }

    return data;
} 


export const EditCart = async(input: CartEditRequestInput, repo: CartRepositoryType) => {
    const data = repo.updateCart(input.id, input.qty);
    return data;
} 


export const DeleteCart = async(id: number, repo: CartRepositoryType) => {
    const data = repo.deleteCart(id);
    return data;
} 