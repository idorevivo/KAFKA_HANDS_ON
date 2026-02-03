import { driver, api } from "@rocket.chat/sdk";
import { ApiError } from "../errors/ApiError.js";

export const sendMessage = async (roomId, message) => {
  try {
    await driver.joinRoom(roomId);
    await driver.sendToRoomId(message, roomId);
  } catch (err) {
    throw new ApiError(
      `Error sending message to room ${roomId}: ${err.message}`,
    );
  }
};

export const sendDirectMessage = async (message, username) => {
  try {
    await driver.sendDirectToUser(message, username);
  } catch (err) {
    throw new ApiError(
      `Error sending direct message to ${username}: ${err.message}`,
    );
  }
};

export const getMessageById = async (messageId) => {
  try {
    const res = await api.get("chat.getMessage", { msgId: messageId });
    return res.message;
  } catch (err) {
    throw new ApiError(`Error fetching message ${messageId}: ${err.message}`);
  }
};
