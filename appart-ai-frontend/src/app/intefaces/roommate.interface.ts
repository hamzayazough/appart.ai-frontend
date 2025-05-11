import { UserPreferences } from "./user-preferences.interface";
import { UserInfo } from "./user.interface";

export interface RoommatePostInfo {
  roommatePost: RoommatePost;
  userPreferences: UserPreferences;
  userInfo: UserInfo;
}

export interface RoommatePost {
id?: string;
userId: string;
description: string;
numberPreferredRoommates: number;
active: boolean;
createdAt: Date;
}
  
  