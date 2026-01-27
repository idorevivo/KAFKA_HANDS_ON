const { Kafka } = require("kafkajs");
const { isAdminUser } = require("./db_connection");
const { sendMessage } = require("./rocketchat_sdk");
const { renameRoom } = require("./rocketchat_restApi");

const kafka = new Kafka({
  clientId: "rocketchat-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "rocketchat-consumers" });

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

const reverseWord = (word) => word.split("").reverse().join("");

const reverseRoomName = (roomName) => {
  return roomName
    .split(" ")
    .map((word) => reverseWord(word))
    .join(" ");
};

const handleRoomRenameIfNeeded = async (roomId, roomName) => {
  if (roomName && (roomName.includes("cat") || roomName.includes("black"))) {
    const newName = reverseRoomName(roomName);
    await renameRoom(roomId, newName);
  }
};

const handleConsumedMessage = async (message) => {
  const TRIGGER_POPULAR_WORD_MSG = "log popular word";

  const payload = JSON.parse(JSON.parse(message.value.toString()).payload);
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

const handleConsumedRoom = async (message) => {
  const payload = JSON.parse(JSON.parse(message.value.toString()).payload);
  const roomId = payload.documentKey?._id;
  const { operationType } = payload;

  if (operationType !== "insert" && operationType !== "update") {
    return;
  }

  const roomName =
    payload.fullDocument?.fname ||
    payload.updateDescription?.updatedFields?.fname;

  await handleRoomRenameIfNeeded(roomId, roomName);
};

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: "rocketchat.rocketchat_message",
    fromBeginning: false,
  });

  await consumer.subscribe({
    topic: "rocketchat.rocketchat_room",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic === "rocketchat.rocketchat_message") {
        await handleConsumedMessage(message);
      }

      if (topic === "rocketchat.rocketchat_room") {
        await handleConsumedRoom(message);
      }
    },
  });
};

run().catch(console.error);
