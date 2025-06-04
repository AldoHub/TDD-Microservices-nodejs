import { CartRepositoryType } from "../repository/cart.repository";
import { OrderRepositoryType } from "../repository/order.repository";

export const CreateOrder = async(userId: number, repo: OrderRepositoryType, cartRepo: CartRepositoryType) => {
    return {}
}

export const UpdateOrder = (orderId: number, status: string, repo: OrderRepositoryType) => {
    return {}
}

export const GetOrder = (orderId: number, repo: OrderRepositoryType) => {
    return {}
}

export const GetOrders = (orderId: number, repo: OrderRepositoryType) => {
    return {}
}

export const DeleteOrder = (orderId: number, repo: OrderRepositoryType) => {
    return {}
}

export const HandleSubscription = async(message: any) => {
   //if (message.event === OrderEvent.ORDER_UPDATED) {}
   // call create order
}