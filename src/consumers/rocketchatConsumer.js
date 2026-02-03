import { handleConsumedMessage } from "../handlers/messageHandler.js";
import { handleConsumedRoom } from "../handlers/roomHandler.js";
import { handleConsumedUser } from "../handlers/userHandler.js";
import { config } from "../config/index.js";
import { connectRocketChat } from "../apiConnections/apiConnection.js";
import { KafkaConsumer } from "./KafkaConsumer.js";
import { NoTopicHandlerError } from "../errors/NoTopicHandlerError.js";

const topicHandlers = {
  [config.kafka.topics.message]: handleConsumedMessage,
  [config.kafka.topics.room]: handleConsumedRoom,
  [config.kafka.topics.users]: handleConsumedUser,
};

export const runRocketchatConsumer = async () => {
  await connectRocketChat();

  const consumer = new KafkaConsumer({
    topics: Object.values(config.kafka.topics),
    groupId: config.kafka.consumerGroupId,
  });

  await consumer.connect();

  await consumer.run(async ({ topic, message }) => {
    const topicHandler = topicHandlers[topic];

    if (!topicHandler) {
      throw new NoTopicHandlerError(`No handler defined for topic: ${topic}`);
    }

    await topicHandler(message);
  });
};
