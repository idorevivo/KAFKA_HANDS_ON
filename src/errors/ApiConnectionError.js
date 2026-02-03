import { AppError } from "./AppError.js";

export class ApiConnectionError extends AppError {
  constructor(message) {
    super(message);
    this.name = "ApiConnectionError";
  }
}