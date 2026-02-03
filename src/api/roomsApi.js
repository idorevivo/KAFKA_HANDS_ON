import { api } from "@rocket.chat/sdk";
import { ApiError } from "../errors/ApiError.js";

export const renameRoom = async (roomId, newName) => {
  try {
    const res = await api.post("rooms.saveRoomSettings", {
      rid: roomId,
      roomName: newName,
    });

    return res;
  } catch (err) {
    throw new ApiError(`Error renaming room ${roomId}: ${err.message}`);
  }
};