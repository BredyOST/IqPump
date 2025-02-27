import {ILoadingState} from "../../../entities/entities.ts";
import {makeAutoObservable} from "mobx";


class IsLoadingStore  {
    loading:ILoadingState = {
        isLoad: false,
        text: ''
}

    constructor() {
        makeAutoObservable(this);
    }

    setState(isLoad: boolean, text: string) {
        this.loading = { isLoad, text};
    }
}

export const isLoadingStore = new IsLoadingStore();