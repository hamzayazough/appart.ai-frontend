import { UserInfo } from "./user.interface";


export interface ContactRequest {
    id: string,
    sender: UserInfo,
    receiver: UserInfo, 
    date: Date,
    relationTypeName: RelationType,
    status: string
}

export interface ContactRequestCreation {
    senderId: string;
    receiverId: string;
    relationTypeName: string;
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