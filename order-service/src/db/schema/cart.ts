import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { serial, integer, pgTable, timestamp, varchar, numeric } from "drizzle-orm/pg-core";

export const carts = pgTable("carts", {
    id: serial("id").primaryKey(),
    customerId: integer("customer_id").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


export type Cart = InferSelectModel<typeof carts>;
export type NewCart = InferInsertModel<typeof carts>;


export const cartLineItems = pgTable("cart_line_items", {
    id: serial("id").primaryKey(), // for db record
    productId: integer("product_id").notNull(),
    cartId: integer("cart_id")
    .references(()=> carts.id , {onDelete: "cascade" })
    .notNull(),
    itemName: varchar("item_name").notNull(), // human readable
    variant: varchar("variant"), // any variant type
    qty: integer("qty").notNull(),
    price: numeric("amount").notNull(), // amount in cetns
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type CartLineItem = InferSelectModel<typeof cartLineItems>;

export const cartRelations = relations(carts, ({ many }) => ({
    lineItems: many(cartLineItems),
}));


export const lineItemsRelations = relations(cartLineItems, ({ one }) => ({
    cart: one(carts, {
        fields: [cartLineItems.cartId],
        references: [carts.id]
    })
}));


// --- DO the migrations using "npm run db:generate"
// --- first run the docker file from the db folder --- "docker-compose up"