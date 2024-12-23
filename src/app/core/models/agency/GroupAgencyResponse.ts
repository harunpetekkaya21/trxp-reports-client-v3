import { GroupAgencyDto } from "./GroupAgencyDto";


export interface GroupAgencyResponse{
     data: GroupAgencyDto[];
        errorMessage: string | null;
        totalCount: number;
        pageIndex: number;
        pageSize: number;
}