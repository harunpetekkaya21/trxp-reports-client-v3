import { GroupByAreaDto } from "./GroupByAreaDto";


export interface GroupByAreaDtoResponse{
     data: GroupByAreaDto[];
        errorMessage: string | null;
        totalCount: number;
        pageIndex: number;
        pageSize: number;
}