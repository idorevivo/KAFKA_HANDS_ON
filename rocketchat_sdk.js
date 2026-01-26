const { driver } = require("@rocket.chat/sdk");

const HOST = "localhost:3000";
const USERNAME = "MessageBot";
const PASSWORD = "MessageBot";

let isConnected = false;

const connectRocketChat = async () => {
  if (isConnected) return;

  await driver.connect({
    host: HOST,
    useSsl: false,
  });

  await driver.login({
    username: USERNAME,
    password: PASSWORD,
  });

  isConnected = true;
};

const sendMessage = async (roomId, message) => {
  await connectRocketChat();

  await driver.joinRoom(roomId);
  await driver.sendToRoomId(message, roomId);
};

module.exports = { sendMessage };
