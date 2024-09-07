import { UserInfo } from "./user.interface";

export interface ContactRequestCreation {
    senderId: string;
    receiverId: string;
    relationType: string;
}

export interface ContactRequest {
    id: string,
    user: UserInfo, // la personne qu'on veut ajouter en contact
    status: string,
    relationType: RelationType
}

export interface Contact {
    id: string, // id du contact
    userName: string, // le username du contact (ou)
    firstName: string,
    lastName: string,
    contactDate: Date,
    relationType: RelationType
}


export interface RelationType {
    id: string,
    typeName: string
}