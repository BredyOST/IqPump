

export interface IUserInfo {
    loggedIn:boolean;
    wallet:string;
    telegramUsername: string;
    telegramId:string;
    hasAccountIpPump:boolean;
    telegramCode:string | null;
    telegramValid:boolean;
    balanceStt:string | '',
    provider: any
}

export interface  ModalIndicators {
    isOpen: boolean;
    isClosing: boolean;
}

export interface ILoadingState {
    isLoad: boolean;
    text: string;
}

export interface IModalWindows {
    modalNotifications: ModalIndicators,
    modalCheckSafetyConnection: ModalIndicators,
    modalWithdrawalAccess: ModalIndicators,
}

export type LANGUGES_TYPE = {code:string, label:string, url:string}

export type FuncType<T,U> = (arg:T) => U

export const SEND_MSG_TO_TELEGRAM = ' Notification sent, please check the connected Telegram account.'
export const ERROR_CHECK_TG='Error checking notifications, try again'