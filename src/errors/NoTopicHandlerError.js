import { AppError } from "./AppError.js";

export class NoTopicHandlerError extends AppError {
  constructor(message) {
    super(message);
    this.name = "NoTopicHandlerError";
  }
}