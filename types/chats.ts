import { TUser } from "./users";

export interface TChat {
  createdAt: Date;
  deletedAt: Date;
  id: string;
  image: string;
  message: string;
  read: boolean;
  chatThreadsId: string;
  usersId: string;
  users: TUser;
}

export interface TChatThread {
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
  id: string;
  name: string | null;
  type: "private" | "public";
  users: TUser[];
  count: number;
  chat?: TChat;
}
