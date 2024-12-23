import { FileListDTO } from "./FileListDTO";

export interface FileListRESPONSE{
    data: FileListDTO[];
    errorMessage: string | null;
    totalCount: number;
    pageIndex: number;
    pageSize: number;
}

