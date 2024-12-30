import { DailyByDateReservationDto } from "./DailyByDateReservationDto";

export interface DailyByDateReservationResponse{
     data: DailyByDateReservationDto;
        errorMessage: string | null;
        totalCount: number;
        pageIndex: number;
        pageSize: number;
}