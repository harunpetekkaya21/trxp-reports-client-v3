import { ErrorType } from "./ErrorType";


export interface ErrorModel {
  message: string;
  type: ErrorType;
  statusCode: number;
}
