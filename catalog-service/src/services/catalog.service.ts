import { ICatalogRepository } from "../interface/catalogRepository.interface";
import { OrderWithLineItems } from "../types/messate.type";

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

    async handleBrokerMessage(message: any){
        console.log("Received message: ", message)
        const orderData = message.data.order as OrderWithLineItems;
        const {orderItems} = orderData;

        orderItems.forEach(async(item) => {
            console.log("updating the stock for product ", item.productId, item.qty);
            const product = await this.getProduct(item.productId);

            if(!product){
                console.log("Error updating the product", item.productId)
            }else{
                //perform stock update operation
                const updatedStock = product.stock - item.qty;
                await this.updateProduct({...product, stock: updatedStock});
            }
           
        });
    }
}