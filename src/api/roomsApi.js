import { connectREST } from "./connections/restConnection.js";
import { config } from "../config/index.js";

export const renameRoom = async (roomId, newName) => {
  const { authToken, userId } = await connectREST();

  const res = await fetch(`http://${config.rocketChat.host}/api/v1/rooms.saveRoomSettings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": authToken,
      "X-User-Id": userId,
    },
    body: JSON.stringify({ rid: roomId, roomName: newName }),
  });

  if (!res.ok) throw new Error(`Failed to rename room: ${res.status}`);
  return res.json();
};

