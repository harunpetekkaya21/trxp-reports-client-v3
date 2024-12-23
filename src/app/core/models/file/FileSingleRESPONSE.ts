import { FileDTO } from "./FileDTO";

export interface FileSingleRESPONSE{
    data: FileDTO;
    errorMessage: string | null;
    isSuccess: boolean;
    isFail: boolean;
    status: number;
}