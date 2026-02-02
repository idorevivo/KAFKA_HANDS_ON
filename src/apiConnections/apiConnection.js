import { driver, api } from "@rocket.chat/sdk";
import { config } from "../config/index.js";
import { ApiConnectionError } from "../errors/ApiConnectionError.js";

let isConnected = false;

export const connectRocketChat = async () => {
  if (isConnected) return;

  try {
    await driver.connect({ host: config.rocketChat.host, useSsl: false });
    await driver.login({
      username: config.rocketChat.user,
      password: config.rocketChat.pass,
    });
    await api.login({
      username: config.rocketChat.user,
      password: config.rocketChat.pass,
    });

    isConnected = true;
  } catch (err) {
    throw new ApiConnectionError("RocketChat API connection failed");
  }
};
