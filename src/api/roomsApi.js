import { api } from "@rocket.chat/sdk";
import { ApiError } from "../errors/ApiError.js";

export const renameRoom = async (roomId, newName) => {
  const res = await api.post("rooms.saveRoomSettings", {
    rid: roomId,
    roomName: newName,
  });

  if (!res || res.success !== true) {
    throw new ApiError(`Failed to rename room: ${JSON.stringify(res)}`);
  }

  return res;
};

