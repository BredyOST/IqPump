import cls from './styled/loader.module.scss';
import {observer} from "mobx-react-lite";
import {isLoadingStore} from "../../shared/mobX/store/isLoadingStore.ts";

const Loader = observer(() => {

    const {isLoad, text} = isLoadingStore.loading

    if (!isLoad) return null;

    return (
        <div className={`${cls.loaderWrapper} ${text && cls.backgraund}`}>
            <div className={cls.loader}></div>
            <div className={cls.loadingText}>{text}</div>
        </div>
    );
});

export default Loader;
