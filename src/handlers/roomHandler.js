import { renameRoom } from "../api/roomsApi.js";

const reverseWord = (word) => word.split("").reverse().join("");

const reverseRoomName = (roomName) => {
  return roomName
    .split(" ")
    .map((word) => reverseWord(word))
    .join(" ");
};

const handleRoomRenameIfNeeded = async (roomId, roomName) => {
  if (roomName && (roomName.includes("cat") || roomName.includes("black"))) {
    const newName = reverseRoomName(roomName);
    await renameRoom(roomId, newName);
  }
};

export const handleConsumedRoom = async (message) => {
  const payload = JSON.parse(JSON.parse(message.value.toString()).payload);
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

