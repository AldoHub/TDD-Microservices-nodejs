import { ICatalogRepository } from "../interface/catalogRepository.interface";

export class CatalogService{
    
    //inject the repository
    private _repository: ICatalogRepository

    constructor(
        repository: ICatalogRepository
    ){
        this._repository = repository
    }


    async createProduct(input: any){

        const data = await this._repository.create(input);
        if(!data.id){
            throw new Error("Unable to create product");
        }
        return data;

    }

    async updateProduct(input: any){
        const data = await this._repository.update(input);
        if(!data.id){
            throw new Error("Unable to update product");
        }
        return data;
    }

    async getProducts(limit: number, offset: number){
        const products = await this._repository.findAll(limit, offset);
        return products;
    }

    async getProduct(id: number){
        const product = await this._repository.findOne(id);
        return product;
    }

    async deleteProduct(id: number){
        const product = await this._repository.delete(id);
        return product;
    }

    async getProductStock(ids: number[]){
        const products = await this._repository.findStock(ids);
        if(!products){
            throw new Error("unable to find product stock details")
        }
        return products;
    }
}