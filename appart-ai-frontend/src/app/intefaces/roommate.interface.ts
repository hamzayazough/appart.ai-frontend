import { UserPreferences } from "./user-preferences.interface";
import { UserInfo } from "./user.interface";

export interface RoommatePostInfo {
  id: string;
  description: string;
  preferredNumberRoommate: number;
  createdAt: Date;
  userPreferences: UserPreferences;
  userInfo: UserInfo;
}

export interface RoommatePost {
id: string;
userId: string;
description: string;
preferredNumberRoommate: number;
isActive: boolean;
createdAt: Date;
}
  
  