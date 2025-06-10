import { Consumer, Producer } from "kafkajs";
import { CatalogService } from "./catalog.service";
import { MessageBroker } from "../utils/broker";

export class BrokerService {
 
    private producer: Producer | null = null;
    private consumer: Consumer | null = null;
    
    //reference catalog service
    private catalogService: CatalogService;

    //Init the catalog service
    constructor(catalogService: CatalogService){
        this.catalogService = catalogService;
    }

    //Init the broker
    public async InitializeBroker(){
        this.producer = await MessageBroker.connectProducer<Producer>();
        this.producer.on("producer.connect", async() => {
            console.log("Catalog Producer connected successfully");
        });

        this.consumer = await MessageBroker.connectConsumer<Consumer>();
        this.consumer.on("consumer.connect", async() => {
            console.log("Catalog Consumer connected successfully");
        });

    //keep listening to consumer events
    //perform action based on events
    await MessageBroker.subscribe(this.catalogService.handleBrokerMessage.bind(this.catalogService), 'CatalogEvents');

    }


    public async sendDeleteProductMessage(data: any) {

    }
}