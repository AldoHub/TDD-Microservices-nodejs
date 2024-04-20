import { CartRepositoryType } from "../types/repository.type";


const createCart = async(input:unknown): Promise<{}> => {
    return Promise.resolve({});
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