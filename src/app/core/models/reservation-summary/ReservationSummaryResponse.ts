import { ReservationSummaryDto } from "./ReservationSummaryDto";

export interface ReservationSummaryResponse{
    data:ReservationSummaryDto;
    errorMessage:string;
    isSuccess:string;
    isFail:string;
    status:string;
}

