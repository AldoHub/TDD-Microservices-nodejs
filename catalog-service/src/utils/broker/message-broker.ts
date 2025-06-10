import { Consumer, Kafka, logLevel, Partitioners, Producer } from "kafkajs";
import { MessageBrokerType, MessageHandler, PublishType } from "./broker.type";
import { MessageType, CatalogEvent, TOPIC_TYPE } from "../../types";

//config properties
const CLIENT_ID = process.env.CLIENT_ID || "catalog-service";
const GROUP_ID = process.env.GROUP_ID || "catalog-service-group";
const BROKERS = [process.env.BROKER_1 || "localhost:9092"];

//kafka
const kafka = new Kafka({
    clientId: CLIENT_ID,
    brokers: BROKERS,
    logLevel: logLevel.INFO
});

let producer: Producer;
let consumer: Consumer;


//create the topics
const createTopic = async(topic: string[]) => {

    const topics = topic.map((t) => ({
        topic: t,
        numPartitions: 2,
        replicationFactor: 1 //based on available brokers
    }));


    const admin = kafka.admin();
    await admin.connect();
    const topicExists = await admin.listTopics();
    console.log("topicExists", topicExists)

    for (const t of topics){
        if(!topicExists.includes(t.topic)){
            await admin.createTopics({
                topics: [t],
            })
        }
    }

    await admin.disconnect();

}


//create/connect producer
const connectProducer = async <T>(): Promise<T> => {
    await createTopic(["CatalogEvents"]);

    if(producer) {
        console.log("producer already connected");
        return producer as unknown as T;
    }

    //create the producer
    producer = kafka.producer({
        createPartitioner: Partitioners.DefaultPartitioner,
    });

    await producer.connect();
    console.log("new producer connected")
    //will return the producer casted as the type we are passing
    return producer as unknown as T;

}

//disconnect producer
const disconnectProducer = async(): Promise<void> => {
    if(producer){
        await producer.disconnect();
    }
}

const publish = async(data: PublishType): Promise<boolean> => {
    //function will return a type "producer" since we are passing that type
    const producer = await connectProducer<Producer>();
    const result = await producer.send({
        topic: data.topic,
        messages: [
            {
                headers: data.headers,
                key: data.event,
                value: JSON.stringify(data.message)
            },
        ]
    });

    console.log("result: ", result);
    return result.length > 0;

}


//create/connect the consumer
const connectConsumer = async <T>(): Promise<T> => {
    if(consumer){
        return consumer as unknown as T;
    }

    //create the consumer
    consumer = kafka.consumer({
        groupId: GROUP_ID,
    });

    await consumer.connect();
    return consumer as unknown as T;

}

//disconnect the consumer
const disconnectConsumer = async (): Promise<void> => {
    if(consumer){
        await consumer.disconnect();
    }
}


const subscribe = async(messageHandler: MessageHandler, topic: TOPIC_TYPE): Promise<void> => {
    const consumer = await connectConsumer<Consumer>();
    await consumer.subscribe({topic, fromBeginning: true});
    
    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            if(topic !== "CatalogEvents") {
                return;
            }

            if(message.key && message.value){
                const inputMessage: MessageType = {
                    headers: message.headers,
                    event: message.key.toString() as CatalogEvent,
                    data: message.value ? JSON.parse(message.value.toString()): null,
                }

                await messageHandler(inputMessage);
                await consumer.commitOffsets([
                    {
                        topic,
                        partition,
                        offset: (Number(message.offset) + 1).toString()
                    }
                ]);
            }

        }
    });

}


export const MessageBroker: MessageBrokerType = {
    connectProducer,
    disconnectProducer,
    publish,
    connectConsumer,
    disconnectConsumer,
    subscribe
}