import { kafka } from "../kafka/kafkaClient.js";
import { KafkaError } from "../errors/KafkaError.js";

export class KafkaConsumer {
  constructor({ topics, groupId }) {
    this.topics = topics;
    this.groupId = groupId;
    this.consumer = kafka.consumer({ groupId });
  }

  async connect() {
    try {
      await this.consumer.connect();
      for (const topic of this.topics) {
        await this.consumer.subscribe({ topic, fromBeginning: false });
      }
    } catch (err) {
      throw new KafkaError(`Kafka consumer connection failed: ${err.message}`);
    }
  }

  async run(eachMessage) {
    try {
      await this.consumer.run({ eachMessage });
    } catch (err) {
      throw new KafkaError(`Kafka consumer run failed: ${err.message}`);
    }
  }

  async disconnect() {
    try {
      await this.consumer.disconnect();
    } catch (err) {
      throw new KafkaError(`Kafka consumer disconnection failed: ${err.message}`);
    }
  }
}
