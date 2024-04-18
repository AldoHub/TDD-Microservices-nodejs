import request from "supertest";
import express from "express";
import { faker } from "@faker-js/faker";

// routes
import catalogRoutes, { catalogService }  from "../catalog/catalog.routes";
import { ProductFactory } from "../../utils/fixtures";

//express instance
const app = express();
app.use(express.json());

app.use(catalogRoutes);


//mock request
const mockRequest = () => {
    return {
        name: '',
        description: faker.commerce.productDescription(),
        price: +faker.commerce.price(),
        stock: faker.number.int({min:10, max:100}),      
    }
}

describe("Catalog Routes", () => {

    describe("POST /product", () => {

        test("should create product successfully", async() => {
            const reqBody = mockRequest();
            const product = ProductFactory.build();

            jest.spyOn(catalogService, 'createProduct')
            .mockImplementationOnce(() => Promise.resolve(product));

            const response = await request(app)
            .post("/products")
            .send({...reqBody, name: faker.commerce.productName() })
            .set("Accept", "application/json");

            
            expect(response.status).toBe(201);
            expect(response.body).toEqual(product);

        });

        test("should response with validation error 400", async() => {
            const reqBody = mockRequest();
            
            const response = await request(app)
            .post("/products")
            .send({...reqBody, name: "empty"}) //set name to be empty to try to trigger an error
            .set("Accept", "application/json");

            expect(response.status).toBe(400);
            expect(response.body).toEqual('name should not be empty');

        });


        test("should response with internal error 500", async() => {
            const reqBody = mockRequest();
            
            jest.spyOn(catalogService, 'createProduct')
            .mockImplementationOnce(() => Promise.reject(new Error("error ocurred on create product")));

            const response = await request(app)
            .post("/products")
            .send({...reqBody, name: faker.commerce.productName()}) //set name to be empty to try to trigger an error
            .set("Accept", "application/json");

            expect(response.status).toBe(500);
            expect(response.body).toEqual('error ocurred on create product');

        });

    });

    describe("PATCH /products/:id", () => {

        test("should update product successfully", async() => {
            
            const product = ProductFactory.build();

            const reqBody = {
                name: product.name,
                price: product.price,
                stock: product.stock
            };

            jest.spyOn(catalogService, 'updateProduct')
            .mockImplementationOnce(() => Promise.resolve(product));

            const response = await request(app)
            .patch(`/products/${product.id}`)
            .send({...reqBody, name: faker.commerce.productName() })
            .set("Accept", "application/json");

            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(product);

        });

        test("should response with validation error 400", async() => {
            const product = ProductFactory.build();

            const reqBody = {
                name: product.name,
                price: product.price,
                stock: product.stock
            };
            const response = await request(app)
            .patch(`/products/${product.id}`)
            .send({...reqBody, price: -1}) //set price to be -1 to try to trigger an error
            .set("Accept", "application/json");

            expect(response.status).toBe(400);
            expect(response.body).toEqual('price should not be negative');

        });


        test("should response with internal error 500", async() => {
            const product = ProductFactory.build();
            const reqBody = {
                name: product.name,
                price: product.price,
                stock: product.stock
            };
            
            jest.spyOn(catalogService, 'updateProduct')
            .mockImplementationOnce(() => Promise.reject(new Error("error ocurred on product update")));

            const response = await request(app)
            .patch(`/products/${product.id}`)
            .send(reqBody) //set name to be empty to try to trigger an error
            .set("Accept", "application/json");

            expect(response.status).toBe(500);
            expect(response.body).toEqual('error ocurred on product update');

        });

    });


    describe("GET /products?limit=0&offset=0", () => {

        test("should return a range of products based on limit and offset", async() => {
            
            const randomLimit = faker.number.int({min:1, max:50});
            //build a set sof mockup products
            const products = ProductFactory.buildList(randomLimit);

            jest.spyOn(catalogService, 'getProducts')
            .mockImplementationOnce(() => Promise.resolve(products));

            
            const response = await request(app)
            .get(`/products?limit=${randomLimit}&offset=0`)
            .set("Accept", "application/json");

              
            expect(response.status).toBe(200);
            expect(response.body).toEqual(products);
        
        });

        //TODO --- add more cases if you want
    });

    describe("GET /products/:id", () => {

        test("should return a product by id", async() => {
            const product = ProductFactory.build();
         
            jest.spyOn(catalogService, 'getProduct')
            .mockImplementationOnce(() => Promise.resolve(product));

            
            const response = await request(app)
            .get(`/products/${product.id}`)
            .set("Accept", "application/json");

              
            expect(response.status).toBe(200);
            expect(response.body).toEqual(product);
        
        });

        //TODO --- add more cases if you want
    });


    describe("DELETE /products/:id", () => {

        test("should delete a product by id", async() => {
            const product = ProductFactory.build();
         
            jest.spyOn(catalogService, 'deleteProduct')
            .mockImplementationOnce(() => Promise.resolve({id: product.id}));

            
            const response = await request(app)
            .delete(`/products/${product.id}`)
            .set("Accept", "application/json");

              
            expect(response.status).toBe(200);
            expect(response.body).toEqual({id: product.id});
        
        });

        //TODO --- add more cases if you want
    });

});