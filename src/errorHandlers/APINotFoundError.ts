import { HTPPStatuses } from "../Shared/Models";
import { BaseError } from "./BaseError";

export class APINotFoundError extends BaseError {
  constructor(
    name: string,
    statusCode = HTPPStatuses.NOT_FOUND,
    isOperational = true,
    description = "Not found"
  ) {
    super(name, statusCode, isOperational, description);
  }
}
