const { Kafka } = require("kafkajs");
 
const kafka = new Kafka({
  clientId: "rocketchat-consumer",
  brokers: ["localhost:9092"],
});
 
const consumer = kafka.consumer({ groupId: "rocketchat-consumers" });

const wordOccurrences = {};

const trackWordOccurrences = (msg) => {
    const words = msg.split(/(\s+)/);
    words.forEach(word => {
        wordOccurrences[word] = (word[word] || 0) + 1;
    });
};

const getPopularWord = () => {
    let popularWord = '';
  let maxCount = 0;

  for (const [word, count] of Object.entries(wordCounts)) {
    if (count > maxCount) {
      popularWord = word;
      maxCount = count;
    }
  }

  return { popularWord, maxCount };
};


const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "rocketchat.rocketchat_message", fromBeginning: true });
 
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      
        const value = JSON.parse(message.value.toString());
        // const msgValue = value.fullDocument ? value.fullDocument.msg : null;

        console.log(value.payload);
    },
  });
};
 
run().catch(console.error);