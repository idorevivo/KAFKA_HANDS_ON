import { getCollection } from "../connection/mongoClient.js";

const getMessageCollection = () => getCollection("rocketchat_message");

export const getMessageById = async (messageId) => {
  const messageCollection = await getMessageCollection();
  return messageCollection.findOne({ _id: messageId });
};

