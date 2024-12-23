import { GroupByNationalityDto } from "./GroupByNationalityDto";

export interface GroupByNationalityResponse{
     data: GroupByNationalityDto[];
        errorMessage: string | null;
        totalCount: number;
        pageIndex: number;
        pageSize: number;
}