export interface UserState {
  userId: number;
  token: string;
  roleId: number;
  roles: string[] | null;
  userName: string;
  nickName: string;
  avatar: string;
  accessToken:string
  tokenPrefix:string
  initPassword:boolean
  tokenHeader:string
}
