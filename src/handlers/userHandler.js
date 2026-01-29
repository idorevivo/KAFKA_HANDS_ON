import { sendDirectMessage } from "../api/messagesApi.js";

export const handleConsumedUser = async (message) => {
  const payload = JSON.parse(JSON.parse(message.value.toString()).payload);

  const { operationType } = payload;

  if (operationType !== "insert") return;

  const username = payload.fullDocument?.username;

  if (username) {
    await sendDirectMessage(`Welcome ${username}!`, username);
  }
};


