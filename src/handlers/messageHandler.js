import { isAdminUser } from "../db/repositories/userRepository.js";
import { getMessageById } from "../db/repositories/messageRepository.js";
import { sendMessage, sendDirectMessage } from "../api/messagesApi.js";

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
  const TRIGGER_POPULAR_WORD_MSG = "log popular word";

  const msg = payload.fullDocument?.msg;
  const userId = payload.fullDocument?.u?._id;
  const roomId = payload.fullDocument?.rid;

  if (msg === TRIGGER_POPULAR_WORD_MSG) {
    const isAdmin = await isAdminUser(userId);

    if (isAdmin) {
      const { popularWord, maxOccurrences } = getPopularWord();
      await sendMessage(
        roomId,
        `Most popular word: ${popularWord}. Number of occurrences: ${maxOccurrences}`,
      );
    }
  } else {
    trackWordOccurrences(msg);
  }
};

const handleUpdateMessage = async (payload) => {
  const updatedMessage = payload.updateDescription?.updatedFields?.msg;

  if (!updatedMessage) return;

  const messageId = payload.documentKey?._id;

  if (!messageId) return;

  const messageDocument = await getMessageById(messageId);

  const messageOwnerUsername = messageDocument?.u?.username;
  if (!messageOwnerUsername) return;

  await sendDirectMessage(
    `Your message has been updated to ${updatedMessage}`,
    messageOwnerUsername,
  );
};

export const handleConsumedMessage = async (message) => {
  const payload = JSON.parse(JSON.parse(message.value.toString()).payload);

  const { operationType } = payload;

  if (operationType === "insert") {
    await handleInsertMessage(payload);
  }

  if (operationType === "update") {
    await handleUpdateMessage(payload);
  }
};


