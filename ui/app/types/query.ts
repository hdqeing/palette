import type { Company } from "./company";

export interface Query {
    id: number;
    deadline: string | null;
    buyer: Company;
    isClosed: boolean | null;
}

export interface QuerySeller {
    id: number;
    query: Query;
    seller: Company;
}