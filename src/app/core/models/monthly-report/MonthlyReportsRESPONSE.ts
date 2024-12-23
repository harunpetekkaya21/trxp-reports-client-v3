import { MonthlyReportsDTO } from "./MonthlyReportsDTO";

export interface MonthlyReportsRESPONSE{
    data: MonthlyReportsDTO[];
    errorMessage: string | null;
    
}

