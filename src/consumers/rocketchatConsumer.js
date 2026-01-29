import { kafka } from "../kafka/kafkaClient.js";
import { handleConsumedMessage } from "../handlers/messageHandler.js";
import { handleConsumedRoom } from "../handlers/roomHandler.js";
import { handleConsumedUser } from "../handlers/userHandler.js";
import { config } from "../config/index.js";

const consumer = kafka.consumer({ groupId: config.kafka.consumerGroupId });

export const runConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: config.kafka.messageTopic,
    fromBeginning: false,
  });
  await consumer.subscribe({
    topic: config.kafka.roomTopic,
    fromBeginning: false,
  });
  await consumer.subscribe({
    topic: config.kafka.usersTopic,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (topic === config.kafka.messageTopic)
        await handleConsumedMessage(message);
      if (topic === config.kafka.roomTopic) await handleConsumedRoom(message);
      if (topic === config.kafka.usersTopic) await handleConsumedUser(message);
    },
  });
};
