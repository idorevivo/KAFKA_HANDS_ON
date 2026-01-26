const { Kafka } = require("kafkajs");
const { isAdminUser } = require("../KAFKA_HANDS_ON/db_connection");
const { sendMessage } = require("../KAFKA_HANDS_ON/rocketchat_message_bot");

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
      await sendMessage(roomId, `Most popular word: ${popularWord}. Number of occurrences: ${maxOccurrences}`);
    }
  } else {
    trackWordOccurrences(msg);
  }
};

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: "rocketchat.rocketchat_message",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await handleConsumedMessage(message);
    },
  });
};

run().catch(console.error);
