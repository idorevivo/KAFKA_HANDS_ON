import { isAdminUser } from "../api/usersApi.js";
import { getMessageById } from "../api/messagesApi.js";
import { sendMessage, sendDirectMessage } from "../api/messagesApi.js";
import { config } from "../config/index.js";
import { getMessagePayload } from "../utils/topicMessageUtils.js";

const wordOccurrences = {};

const trackWordOccurrences = (msg) => {
  if (typeof msg !== "string" || msg.trim() === "") {
    return;
  }

  const words = msg.split(/\s+/);
  words.forEach((word) => {
    wordOccurrences[word] = (wordOccurrences[word] || 0) + 1;
  });
};

const getPopularWord = () => {
  let popularWord = "";
  let maxOccurrences = 0;

  for (const [word, occurrences] of Object.entries(wordOccurrences)) {
    if (occurrences > maxOccurrences) {
      popularWord = word;
      maxOccurrences = occurrences;
    }
  }

  return { popularWord, maxOccurrences };
};

const handleInsertMessage = async (payload) => {
  const msg = payload.fullDocument?.msg;
  const userId = payload.fullDocument?.u?._id;
  const roomId = payload.fullDocument?.rid;

  if (
    msg === config.handlers.triggerPopularWordMsg &&
    (await isAdminUser(userId))
  ) {
    const { popularWord, maxOccurrences } = getPopularWord();
    await sendMessage(
      roomId,
      `Most popular word: ${popularWord}. Number of occurrences: ${maxOccurrences}`,
    );

    return;
  }
  trackWordOccurrences(msg);
};

const handleUpdateMessage = async (payload) => {
  const updatedMessage = payload.updateDescription?.updatedFields?.msg;

  if (!updatedMessage) return;

  const messageId = payload.documentKey?._id;

  if (!messageId) return;

  const messageDocument = await getMessageById(messageId);
  const messageOwnerId = messageDocument?.u?._id;
  const editedByUserId = messageDocument?.editedBy?._id;

  if (!messageOwnerId || !editedByUserId) return;

  if (messageOwnerId !== editedByUserId) {
    const messageOwnerUsername = messageDocument?.u?.username;
    if (!messageOwnerUsername) return;

    await sendDirectMessage(
      `Your message has been updated to ${updatedMessage}`,
      messageOwnerUsername,
    );
  }
};

export const handleConsumedMessage = async (message) => {
  const payload = getMessagePayload(message);

  const { operationType } = payload;

  switch (operationType) {
    case "insert":
      await handleInsertMessage(payload);
      break;

    case "update":
      await handleUpdateMessage(payload);
      break;

    default:
      break;
  }
};
