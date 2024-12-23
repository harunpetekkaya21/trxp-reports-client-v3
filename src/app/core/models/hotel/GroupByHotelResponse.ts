import { GroupByHotelDto } from "./GroupByHotelDto";


export interface GroupByHotelResponse{
     data: GroupByHotelDto[];
        errorMessage: string | null;
        totalCount: number;
        pageIndex: number;
        pageSize: number;
}