import { kafka } from "../kafka/kafkaClient.js";

export const createConsumer = async ({ topics, groupId }) => {
  const consumer = kafka.consumer({ groupId });

  await consumer.connect();
  await consumer.subscribe({ topics, fromBeginning: false });

  return consumer;
};

export const runConsumer = async (consumer, eachMessage) => {
  await consumer.run({ eachMessage });
};
