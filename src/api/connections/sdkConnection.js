import { driver } from "@rocket.chat/sdk";
import { config } from "../../config/index.js";

let isConnected = false;

export const connectRocketChat = async () => {
  if (isConnected) return;

  await driver.connect({ host: config.rocketChat.host, useSsl: false });
  await driver.login({ username: config.rocketChat.user, password: config.rocketChat.pass });

  isConnected = true;
};

export { driver };