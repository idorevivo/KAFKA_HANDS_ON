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

const shouldRenameRoom = (roomName) => {
  return (
    roomName &&
    config.handlers.specialRoomWords.some((word) => roomName.includes(word))
  );
};

const handleRoomRename = async (roomId, roomName) => {
  const newName = reverseRoomName(roomName);
  await renameRoom(roomId, newName);
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

  if (!shouldRenameRoom(roomName)) {
    return;
  }

  await handleRoomRename(roomId, roomName);
};
