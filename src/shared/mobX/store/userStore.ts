import {IUserInfo} from "../../../entities/entities.ts";
import { makeAutoObservable } from "mobx"


class UserStore {
    user:IUserInfo = {
        loggedIn:false,
        wallet:'',
        telegramUsername: '',
        telegramId:'',
        hasAccountIpPump:false,
        telegramCode:null,
        telegramValid:false,
        balanceStt:'',
        provider: null
    }

    constructor() {
        makeAutoObservable(this);
    }

    setState<K extends keyof IUserInfo>(key: K, value: IUserInfo[K]) {
        this.user[key] = value;
    }
}

export const userStore = new UserStore();