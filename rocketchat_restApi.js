const fetch = require("node-fetch");

const HOST = "localhost:3000";
const USERNAME = "MessageBot";
const PASSWORD = "MessageBot";

const connectREST = async () => {
  const res = await fetch(`${HOST}/api/v1/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: USERNAME, password: PASSWORD }),
  });

  const response = await res.json();
  if (response.status !== "success") throw new Error("REST login failed");

  return {
    authToken: response.data.authToken,
    userId: response.data.userId,
  };
};

const renameRoom = async (roomId, newName) => {
  const { authToken, userId } = await connectREST();

  await fetch(`${HOST}/api/v1/rooms.saveRoomSettings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": authToken,
      "X-User-Id": userId,
    },
    body: JSON.stringify({
      rid: roomId,
      roomName: newName,
    }),
  });
};

module.exports = { renameRoom };
