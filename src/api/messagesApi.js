import { driver, connectRocketChat } from "./connections/sdkConnection.js";

export const sendMessage = async (roomId, message) => {
  await connectRocketChat();
  await driver.joinRoom(roomId);
  await driver.sendToRoomId(message, roomId);
};

export const sendDirectMessage = async (message, username) => {
  await connectRocketChat();
  await driver.sendDirectToUser(message, username);
};

