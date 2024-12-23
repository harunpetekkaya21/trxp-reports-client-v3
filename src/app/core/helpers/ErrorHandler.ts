import { HttpErrorResponse } from '@angular/common/http';
import { ErrorType } from '../models/errors/ErrorType';
import { ErrorModel } from '../models/errors/ErrorModel';


export class ErrorHandler {
  static parseHttpError(error: HttpErrorResponse): ErrorModel {
    let errorType: ErrorType = ErrorType.Unknown;
    let message = 'An unexpected error occurred. Please try again later.';
    const statusCode = error.status;

    switch (statusCode) {
      case 400:
        errorType = ErrorType.BadRequest;
        message = error.error?.message || 'The request is invalid.';
        break;
      case 401:
        errorType = ErrorType.Unauthorized;
        message = 'Unauthorized access. Please log in.';
        break;
      case 403:
        errorType = ErrorType.Forbidden;
        message = 'You do not have permission to perform this action.';
        break;
      case 404:
        errorType = ErrorType.NotFound;
        message = 'The requested resource was not found.';
        break;
      case 500:
        errorType = ErrorType.ServerError;
        message = 'A server error occurred. Please try again later.';
        break;
      default:
        if (error.error?.message) {
          message = error.error.message;
        }
    }

    return {
      message,
      type: errorType,
      statusCode,
    };
  }
}
