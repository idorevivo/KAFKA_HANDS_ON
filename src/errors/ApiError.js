import { AppError } from "./AppError.js";

export class ApiError extends AppError {
  constructor(message) {
    super(message);
    this.name = "ApiError";
  }
}