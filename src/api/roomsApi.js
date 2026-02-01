import { api } from "@rocket.chat/sdk";

export const renameRoom = async (roomId, newName) => {
  const res = await api.post("rooms.saveRoomSettings", {
    rid: roomId,
    roomName: newName,
  });

  if (!res || res.success !== true) {
    throw new Error(`Failed to rename room: ${JSON.stringify(res)}`);
  }

  return res;
};

