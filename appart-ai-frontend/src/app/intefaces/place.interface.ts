import { Address } from "./adress.interface";

export interface Place {
    id: string;
    name: string;
    address: Address;
    weight: number;
}