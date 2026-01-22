const { Kafka } = require("kafkajs");
 
const kafka = new Kafka({
  clientId: "rocketchat-consumer",
  brokers: ["localhost:9092"],
});
 
const consumer = kafka.consumer({ groupId: "rocketchat-consumers" });


const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "rocketchat.rocketchat_message", fromBeginning: true });
 
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });
    },
  });
};
 
run().catch(console.error);