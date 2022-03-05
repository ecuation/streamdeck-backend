import { HTTPStatuses } from "../Shared/Models";
import { BaseError } from "./BaseError";

export class InternalServerError extends BaseError {
  constructor(
    name: string,
    statusCode = HTTPStatuses.INTERNAL_SERVER_ERROR,
    isOperational = false,
    description = "Internal server error"
  ) {
    super(name, statusCode, isOperational, description);
  }
}
