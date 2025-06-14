import { InferSelectModel, relations } from "drizzle-orm";
import { integer, numeric, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
    id: serial("id").primaryKey(), // for db record
    orderNumber: varchar("order_number").notNull().unique(),
    customerId: integer("customer_id").notNull(),
    amount: numeric("amount").notNull(), 
    status: varchar("status").default("pending"), 
    txnId: varchar("txn_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Order = InferSelectModel<typeof orders>;


export const orderLineItems = pgTable("order_line_items", {
    id: serial("id").primaryKey(), // for db record
    itemName: varchar("item_name").notNull(),
    qty: integer("qty").notNull(),
    price: numeric("price").notNull(), 
    orderId: integer("order_id").references(() => orders.id, {onDelete: "cascade"}).notNull(), 
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type OrderLineItem = InferSelectModel<typeof orderLineItems>;

export const orderRelations = relations(orders, ({many}) => ({
    lineItems: many(orderLineItems),
}));

export const orderItemRelations =  relations(orderLineItems, ({one}) => ({
    order: one(orders, {
        fields: [orderLineItems.orderId],
        references: [orders.id]
    }),
}));

// --- DO the migrations using "npm run db:generate"
// --- first run the docker file from the "db" folder --- "docker-compose up"