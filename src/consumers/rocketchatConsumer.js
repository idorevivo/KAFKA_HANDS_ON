import { handleConsumedMessage } from "../handlers/messageHandler.js";
import { handleConsumedRoom } from "../handlers/roomHandler.js";
import { handleConsumedUser } from "../handlers/userHandler.js";
import { config } from "../config/index.js";
import { connectRocketChat } from "../apiConnections/apiConnection.js";
import { createConsumer, runConsumer } from "./genericConsumer.js";

const topicHandlers = {
  [config.kafka.topics.message]: handleConsumedMessage,
  [config.kafka.topics.room]: handleConsumedRoom,
  [config.kafka.topics.users]: handleConsumedUser,
};

export const runRocketchatConsumer = async () => {
  await connectRocketChat();

  const consumer = await createConsumer({
    topics: Object.values(config.kafka.topics),
    groupId: config.kafka.consumerGroupId,
  });

  await runConsumer(consumer, async ({ topic, message }) => {
    const topicHandler = topicHandlers[topic];
    await topicHandler(message);
  });
};
