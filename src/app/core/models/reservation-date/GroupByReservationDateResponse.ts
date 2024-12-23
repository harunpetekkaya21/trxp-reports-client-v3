import { GroupByReservationDateDto } from "./GroupByReservationDateDto";


export interface GroupByReservationDateResponse{
    data: GroupByReservationDateDto[];
    errorMessage: string | null;
    totalCount: number;
    pageIndex: number;
    pageSize: number;
}