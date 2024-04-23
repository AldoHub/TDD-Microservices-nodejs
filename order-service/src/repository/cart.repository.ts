import { DB } from "../db/db.connection";
import { carts } from "../db/schema";
import { CartRepositoryType } from "../types/repository.type";


const createCart = async(input:unknown): Promise<{}> => {

    const result = await DB.insert(carts).values({
        customerId: 123
    }).returning({cartId: carts.id});

    console.log(result);


    return Promise.resolve({
        message: "fake reponse from cart repository",
        input
    });
}


const findCart = async(input:unknown): Promise<{}> => {
    return Promise.resolve({});
}


const updateCart = async(input:unknown): Promise<{}> => {
    return Promise.resolve({});
}


const deleteCart = async(input:unknown): Promise<{}> => {
    return Promise.resolve({});
}


export const CartRepository:CartRepositoryType = {
    create: createCart,
    find: findCart,
    update: updateCart,
    delete: deleteCart
} 