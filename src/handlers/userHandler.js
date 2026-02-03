import { sendDirectMessage } from "../api/messagesApi.js";
import { getMessagePayload } from "../utils/topicMessageUtils.js";

export const handleConsumedUser = async (message) => {
  const payload = getMessagePayload(message);

  const { operationType } = payload;

  if (operationType !== "insert") return;

  const username = payload.fullDocument?.username;

  if (username) {
    await sendDirectMessage(`Welcome ${username}!`, username);
  }
};


