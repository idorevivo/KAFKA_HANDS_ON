import { Kafka } from "kafkajs";
import { config } from "../config/index.js";

export const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: [config.kafka.host],
});

