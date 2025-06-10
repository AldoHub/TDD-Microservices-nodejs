export type OrderLineItemType = {
    id: number, // for db record
    productId: number,
    qty: number,  
}


export interface OrderWithLineItems {
    id?: number;
    orderNumber: number;
    orderItems: OrderLineItemType[];
}