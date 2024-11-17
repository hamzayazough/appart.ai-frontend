import { UserInfo } from "./user.interface";

export interface RoomateRequestSummary {
    id: string;
    user: UserInfo;
    description: string;
    createdAt: Date;
  }
  
  export interface RoomateRequest {
    id: string;
    userId: string;
    description: string;
    createdAt: Date;
  }
  
  export interface RoomateInterest {
    id: string;
    userId: string;
    roomateRequestId: string;
  }
  