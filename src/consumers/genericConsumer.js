import { kafka } from "../kafka/kafkaClient.js";
import { KafkaError } from "../errors/KafkaError.js";

export const createConsumer = async ({ topics, groupId }) => {
  try {
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topics, fromBeginning: false });

    return consumer;
  } catch (err) {
    throw new KafkaError(`Kafka consumer creation failed: ${err.message}`);
  }
};

export const runConsumer = async (consumer, eachMessage) => {
  try {
    await consumer.run({ eachMessage });
  } catch (err) {
    throw new KafkaError(`Kafka consumer run failed: ${err.message}`);
  }
};
