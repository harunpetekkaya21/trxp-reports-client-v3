import { GroupBySupplierDto } from "./GroupBySupplierDto";


export interface GroupBySupplierResponse{
     data: GroupBySupplierDto[];
        errorMessage: string | null;
        totalCount: number;
        pageIndex: number;
        pageSize: number;
}