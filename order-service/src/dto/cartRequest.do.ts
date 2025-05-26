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
