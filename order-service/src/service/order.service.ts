import { OrderLineItemType, OrderWithLineItems } from "../dto/orderRequest.dto";
import { CartRepositoryType } from "../repository/cart.repository";
import { OrderRepositoryType } from "../repository/order.repository";
import { MessageType } from "../types";
import { OrderStatus } from "../types/order.types";

export const CreateOrder = async(userId: number, repo: OrderRepositoryType, cartRepo: CartRepositoryType) => {
    //find cart by customer id
    const cart = await cartRepo.findCart(userId);
    if(!cart){
        throw new Error('Cart not found');
    }

    //calculate total order amount
    let cartTotal = 0;
    let orderLineItems: OrderLineItemType[] = [];

    //create orderline items from cart items
    cart.lineItems.forEach((item) => {
        cartTotal += item.qty * Number(item.price);
        
        orderLineItems.push({
            productId: item.productId,
            itemName: item.itemName,
            qty: item.qty,
            price: Number(item.price),
        } as OrderLineItemType) 
    });

    const orderNumber =  Math.floor(Math.random() * 1000000);

    //create order with line items
    const orderInput: OrderWithLineItems = {
        orderNumber: orderNumber,
        txnId: null, // payment ID
        customerId: userId,
        amount: cartTotal.toString(),
        orderItems: orderLineItems,
        status: OrderStatus.PENDING
    }

    const order = await repo.createOrder(orderInput);
    console.log("order created: ", order);

    //clear the cart
    await cartRepo.clearCartData(userId);
    
    //fire a message to subscription service (catalog service) to update stock
   
    //return success message
    return {message: "Order created successfully", orderNumber: orderNumber};
}


export const UpdateOrder = async(orderId: number, status: OrderStatus, repo: OrderRepositoryType) => {

    await repo.updateOrder(orderId, status);

    //fire a message to subscription service [catalog service] to update the stock
    //TODO --- handle Kafka calls
    if(status == OrderStatus.CANCELLED){
        //await repo.publishOrderEvent(order, "ORDER CANCELLED");
    }

    return {message: "Order updated successfully"};
}

export const GetOrder = (orderId: number, repo: OrderRepositoryType) => {
    const order = repo.findOrder(orderId);
    if(!order){
        throw new Error("Order not found");
    }
    
    return order;
}

export const GetOrders = async (userId: number, repo: OrderRepositoryType) => {
    const orders = await repo.findOrdersByCostumerId(userId)
    
    if(!Array.isArray(orders)){
        throw new Error("Order not found");
    }

    return orders;
   
}

export const DeleteOrder = async(orderId: number, repo: OrderRepositoryType) => {

    const result = await repo.deleteOrder(orderId);
    return result;
}

export const HandleSubscription = async(message: MessageType) => {
   //if (message.event === OrderEvent.ORDER_UPDATED) {}
   // call create order
}