import {IModalWindows} from "../../../entities/entities.ts";
import {makeAutoObservable} from "mobx";


class ModalStatesStore {
        modals:IModalWindows = {
            modalNotifications: {isOpen: false, isClosing: false},
            modalCheckSafetyConnection: {isOpen: false, isClosing: false},
            modalWithdrawalAccess: {isOpen: true, isClosing: false},
        }

    constructor() {
        makeAutoObservable(this);
    }

    setState<K extends keyof IModalWindows>(key: K, value: IModalWindows[K]) {
        this.modals[key] = value;
    }
}

export const modalStatesStore = new ModalStatesStore();