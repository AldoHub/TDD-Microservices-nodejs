import { ICatalogRepository } from "../../interface/catalogRepository.interface";
import { Product } from "../../models/product.model";
import { MockCatalogRepository } from "../../repository/mockCatalog.repository";
import { CatalogService } from "../catalog.service";
import { ProductFactory } from "../../utils/fixtures/index";
//import { Factory } from "rosie";

//faker
import { faker } from "@faker-js/faker";
/*
const productFactory = new Factory<Product>()
    .attr("id", faker.number.int({min:1, max:1000}))
    .attr("name", faker.commerce.productName())
    .attr("description", faker.commerce.productDescription())
    .attr("stock", faker.number.int({min:10, max:100}))
    .attr("price", +faker.commerce.price())

*/
const mockProduct = (extra_data: any) => {
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: +faker.commerce.price(),
        stock: faker.number.int({min:10, max:100}),
        ...extra_data
    }
}


describe("catalogService", () => {
    
    //import the services
    let repository: ICatalogRepository;


    //runs before each test
    beforeEach(() => {
        //create a mockup catalog
        repository = new MockCatalogRepository();
    });

    //runs after each test
    afterEach(() => {
        //clean a mockup catalog
        repository = {} as MockCatalogRepository;
    });

    //group products test

    //---PRODUCT CREATION
    describe("createProduct", () => {

        test("should create product", async() => {
            //instance of the service
            const service = new CatalogService(repository);
            //mock product input
            const reqBody = mockProduct({});
            //send data to the mock catalog
            const result = await service.createProduct(reqBody);

            expect(result).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                price: expect.any(Number),
                stock: expect.any(Number),
            })

        });

        test("should throw error if the product cannot be created", async() => {
            //instance of the service
            const service = new CatalogService(repository);
            //mock product input
            const reqBody = mockProduct({});

            //mimic server response
            jest.spyOn(repository, 'create')
            .mockImplementationOnce(() => Promise.resolve({} as Product));

            await expect(service.createProduct(reqBody)).rejects.toThrow("Unable to create product");

        });



        test("should throw error if product already exists", async() => {
            //instance of the service
            const service = new CatalogService(repository);
            //mock product input
            const reqBody = mockProduct({});

            //mimic server response
            jest.spyOn(repository, 'create')
            .mockImplementationOnce(() => Promise.reject(new Error("Product already exists")));

            await expect(service.createProduct(reqBody)).rejects.toThrow("Product already exists");

        });

    });


    //---PRODUCT UPDATE
    describe("updateProduct", () => {
        
        test("should update product", async() => {
           
            const service = new CatalogService(repository);
            const reqBody = mockProduct({
                id: faker.number.int({min:10, max:1000}),
            });
            const result = await service.updateProduct(reqBody);

            expect(result).toMatchObject(reqBody);
        });

        test("should throw error if product doesnt exist", async() => {
            //instance of the service
            const service = new CatalogService(repository);
         
            //mimic server response
            jest.spyOn(repository, 'update')
            .mockImplementationOnce(() => Promise.reject(new Error("Product doesnt exist")));

            await expect(service.updateProduct({})).rejects.toThrow("Product doesnt exist");

        });

    
    });


    
    //---PRODUCTS RETRIEVAL
    describe("getProducts", () => {

        //pagination
        test("should get products by offset and limit", async() => {
            const service = new CatalogService(repository);
            const randomLimit = faker.number.int({min:1, max:50});
           
            //build a set sof mockup products
            const products = ProductFactory.buildList(randomLimit);


            jest.spyOn(repository, 'findAll')
            .mockImplementationOnce(() => Promise.resolve(products));
           
            const result = await service.getProducts(randomLimit,0);

            expect(result.length).toEqual(randomLimit);
            expect(result).toMatchObject(products);

        });


        test("should throw error if products set is empty ", async() => {
            //instance of the service
            const service = new CatalogService(repository);
         
            //mimic server response
            jest.spyOn(repository, 'findAll')
            .mockImplementationOnce(() => Promise.reject(new Error("Products list is empty")));

            await expect(service.getProducts(0,0)).rejects.toThrow("Products list is empty");

        });


    });
    
    //---PRODUCT RETRIEVAL
    describe("getProduct", () => {

        test("should get products by id", async() => {
            const service = new CatalogService(repository);
            
            //build a set sof mockup products
            const product = ProductFactory.build();

            jest.spyOn(repository, 'findOne')
            .mockImplementationOnce(() => Promise.resolve(product));
           
            const result = await service.getProduct(product.id!);
            expect(result).toMatchObject(product);

        });


        test("should throw error if product doesnt exist ", async() => {
            //instance of the service
            const service = new CatalogService(repository);
            
            //build a set sof mockup products
            const product = ProductFactory.build();

            //mimic server response
            jest.spyOn(repository, 'findOne')
            .mockImplementationOnce(() => Promise.reject(new Error("Product doesnt exist")));

            await expect(service.getProduct(product.id!)).rejects.toThrow("Product doesnt exist");

        });


    });



     //---PRODUCT REMOVAL
     describe("deleteProduct", () => {

     
        test("should delete product by id", async() => {
            const service = new CatalogService(repository);
            
            //build a set sof mockup products
            const product = ProductFactory.build();

            jest.spyOn(repository, 'delete')
            .mockImplementationOnce(() => Promise.resolve({id: product.id}));
           
            const result = await service.deleteProduct(product.id!);
            expect(result).toMatchObject({
                id: product.id
            });

        });


    });

});