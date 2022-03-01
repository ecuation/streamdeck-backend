import { BaseError } from "./BaseError";
import { NextFunction, Request, Response } from "express";

export class ErrorHandler {
  public static returnError(
    err: BaseError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    res.status(err.statusCode || 500).json(err);
  }

  public static isOperationalError(error: BaseError) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }

  public static logError(error: BaseError) {
    console.error(error);
  }
}
