import { renameRoom } from "../api/roomsApi.js";
import { config } from "../config/index.js";
import { getMessagePayload } from "../utils/topicMessageUtils.js";

const reverseWord = (word) => word.split("").reverse().join("");

const reverseRoomName = (roomName) => {
  return roomName
    .split(" ")
    .map((word) => reverseWord(word))
    .join(" ");
};

const handleRoomRenameIfNeeded = async (roomId, roomName) => {
  if (
    roomName &&
    config.handlers.specialRoomWords.some((word) => roomName.includes(word))
  ) {
    const newName = reverseRoomName(roomName);
    await renameRoom(roomId, newName);
  }
};

export const handleConsumedRoom = async (message) => {
  const payload = getMessagePayload(message);
  const roomId = payload.documentKey?._id;
  const { operationType } = payload;

  if (operationType !== "insert" && operationType !== "update") {
    return;
  }

  const roomName =
    payload.fullDocument?.fname ||
    payload.updateDescription?.updatedFields?.fname;

  await handleRoomRenameIfNeeded(roomId, roomName);
};
