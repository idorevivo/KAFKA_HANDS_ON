import { driver, api } from "@rocket.chat/sdk";
import { ApiError } from "../errors/ApiError.js";


export const sendMessage = async (roomId, message) => {
  await driver.joinRoom(roomId);
  await driver.sendToRoomId(message, roomId);
};

export const sendDirectMessage = async (message, username) => {
  await driver.sendDirectToUser(message, username);
};

export const getMessageById = async (messageId) => {
  const res = await api.get("chat.getMessage", { msgId: messageId });

  if (!res || res.success !== true) {
    throw new ApiError(`Failed to fetch message: ${JSON.stringify(res)}`);
  }

  return res.message;
};
