

export interface IUserInfo {
    loggedIn:boolean;
    wallet:string;
    telegramUsername: string;
    hasAccountIpPump:boolean;
    telegramCode:string | null;
    telegramValid:boolean;
    balanceStt:string | ''
}