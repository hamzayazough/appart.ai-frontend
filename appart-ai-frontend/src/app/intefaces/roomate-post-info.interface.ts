import { UserPreferences } from "./user-preferences.interface";
import { UserInfo } from "./user.interface";

export interface RoomatePostInfo {
  id: string;
  description: string;
  preferredNumberRoommate: number;
  createdAt: Date;
  userPreferences: UserPreferences;
  userInfo: UserInfo;
}
