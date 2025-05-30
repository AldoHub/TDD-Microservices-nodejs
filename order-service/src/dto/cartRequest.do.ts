import { Type, Static } from "@sinclair/typebox";

//cart input schema
export const CartRequestSchema = Type.Object({
    productId: Type.Integer(),
    //customerId: Type.Integer(),
    qty: Type.Integer()
});


export type CartRequestInput = Static<typeof CartRequestSchema>;


//cart edit request schema
export const CartEditRequestSchema = Type.Object({
    id: Type.Integer(),
    qty: Type.Integer()
});


export type CartEditRequestInput = Static<typeof CartEditRequestSchema>;


type CartLineItem = {
    id: number;
    productId: number;
    itemName: string;
    price: string;
    qty: number;
    variant: string | null;
    createdAt: Date;
    updatedAt: Date;
    availability?: number;
}


export interface CartWithLineItems {
    id: number;
    customerId: number;
    lineItems: CartLineItem[];
    createdAt: Date;
    updatedAt: Date;
}