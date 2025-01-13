import { Address } from "./adress.interface";

export interface Place {
    id: string;
    name: string;
    address: Address;
    weight:  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}