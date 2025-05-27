import { CartEditRequestInput, CartRequestInput } from "../dto/cartRequest.do";
import { CartRepositoryType } from "../repository/cart.repository";
import { GetProductDetails, GetStockDetails } from "../utils/broker";
import { AuthorizeError, NotFoundError, logger } from "../utils";
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
    
    //get customer cart data
    const cart = await repo.findCart(id);
        
    if(!cart){
        throw new NotFoundError("cart not found");
    }

    //list out all of the items in the cart
    const lineItems = cart.lineItems;

    if(!lineItems.length){
        throw new NotFoundError("cart items not found");
    }

    //verify with inventory service if products are still available
    const stockDetails = await GetStockDetails(
        lineItems.map(item => item.productId )
    );

    if(Array.isArray(stockDetails)){
        //update availability
        lineItems.forEach((lineItem) => {
            const stockItem = stockDetails.find((stock) => stock.id === lineItem.productId)
            if(stockItem){
                lineItem.availability = stockItem.stock;
            }
        });

        //update cart line items
        cart.lineItems = lineItems;

    }

    //return updated cart data with latest stock availability
    return cart;
    
} 


const AuthorizeCart = async(lineItemId: number, customerId: number, repo: CartRepositoryType) => { 
    
    const cart = await repo.findCart(customerId);
    if(!cart){
        throw new NotFoundError("cart doesnt exist");
    }

    const lineItem = cart.lineItems.find((item) => item.id === lineItemId);
    if(!lineItem) {
         throw new AuthorizeError("not authorized to edit the cart");
    }

}


export const EditCart = async(input: CartEditRequestInput & {customerId: number}, repo: CartRepositoryType) => {
    await AuthorizeCart(input.id, input.customerId, repo);
    const data = repo.updateCart(input.id, input.qty);
    return data;
} 


export const DeleteCart = async(input: {id: number, customerId: number }, repo: CartRepositoryType) => {
    await AuthorizeCart(input.id, input.customerId, repo);
    const data = repo.deleteCart(input.id);
    return data;
} 