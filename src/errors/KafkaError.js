import { AppError } from "./AppError.js";

export class KafkaError extends AppError {
  constructor(message) {
    super(message);
    this.name = "KafkaError";
  }
}