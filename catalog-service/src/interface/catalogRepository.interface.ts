import { Product } from "../models/product.model";

export interface ICatalogRepository {
    create(data: Product): Promise<Product>;
    update(data: Product): Promise<Product>;
    delete(id: number ): Promise<unknown>;
    findAll(limit:number, offset: number): Promise<Product[]>; 
    findOne(id: number): Promise<Product>;
    findStock(ids: number[]): Promise<Product[]>;
}