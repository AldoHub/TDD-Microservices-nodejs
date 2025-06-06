export type OrderLineItemType = {
    id: number, // for db record
    productId: number,
    itemName: string, 
    qty: number, 
    price: number,
    orderId: number;
    createdAt: Date,
    updatedAt: Date,
   
}


export interface OrderWithLineItems {
    id?: number;
    customerId: number;
    orderNumber: number;
    txnId: string | null; //transaction id
    amount: string;
    status: string;
    orderItems: OrderLineItemType[];
    createdAt?: Date;
    updatedAt?: Date;
}