import { config } from "../../config/index.js";

let authData = null;

export const connectREST = async () => {
  if (authData) return authData;

  const res = await fetch(`http://${config.rocketChat.host}/api/v1/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: config.rocketChat.user,
      password: config.rocketChat.pass,
    }),
  });

  const response = await res.json();
  if (response.status !== "success") throw new Error("REST login failed");

  authData = {
    authToken: response.data.authToken,
    userId: response.data.userId,
  };

  return authData;
};
