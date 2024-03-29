import { HTTPStatuses } from "../Shared/Models";
import { BaseError } from "./BaseError";

export class APINotFoundError extends BaseError {
  constructor(
    name: string,
    statusCode = HTTPStatuses.NOT_FOUND,
    isOperational = true,
    description = "Not found"
  ) {
    super(name, statusCode, isOperational, description);
  }
}
