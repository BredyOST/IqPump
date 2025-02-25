import cls from './safetyConnection.module.scss';
import {IUserInfo} from "../../../entities/entities.ts";
import CustomButton from "../../../shared/ui/custom-button/custom-button.tsx";
import {useTranslation} from "react-i18next";

interface ISafetyConnection {
    state: IUserInfo
    setModalSafetyConnection: (arg: {isOpen:boolean, isClosing: boolean}) => void
    isLoadingHandler:(arg:{isLoad: boolean,  text: string}) => void
}

const SafetyConnection = ({
                            state,
                            setModalSafetyConnection,
                          }:ISafetyConnection) => {

    const { t } = useTranslation();

    /**Functions*/
    /** для закрытия модального окна*/
    const closeModalSafetyConnection = () => {
        setModalSafetyConnection({isOpen:false, isClosing: true})
    };


    return (
        <>
            <div className={cls.wallet_header_telegram}>
                <div className={cls.wrapper}>
                    <div className={cls.stt_modal_header}>
                        {!state?.wallet && state?.telegramUsername !== '' ? (
                            <>
                                <div className={cls.notification_header}>SAFETY</div>
                                <CustomButton
                                    onClick={closeModalSafetyConnection}
                                    classnameWrapper={cls.wrapper_btn}
                                    classNameBtn={cls.cover_btn}
                                    type='button'
                                >
                                    <div className={cls.close_btn}></div>
                                </CustomButton>
                                <div className={cls.cover_head}>
                                <div>Safe</div>
                                    <div>Connection Check</div>
                                </div>
                                <div className={cls.cover_body}>
                                    <div>{t('safety')}</div>
                                    <div>{t('safetyNext')}</div>
                                    <div className={cls.userName}>{state?.telegramUsername}</div>
                                    <div>{t('notRecieved')}</div>
                                </div>
                                <CustomButton onClick={closeModalSafetyConnection} classNameBtn={cls.btn} type='button'>
                                    ok
                                </CustomButton>
                            </>
                        ) : (
                            <>
                                <div className={cls.notification_header}>SAFETY</div>
                                <div className={cls.cover}>
                                    <CustomButton
                                        onClick={closeModalSafetyConnection}
                                        classnameWrapper={cls.wrapper_btn}
                                        classNameBtn={cls.cover_btn}
                                        type='button'
                                    >
                                        <div className={cls.close_btn}></div>
                                    </CustomButton>
                                    <div className={cls.cover_head}>
                                    <div>{t('check')}</div>
                                        <div>{t('connection')}</div>
                                    </div>
                                    <div className={cls.cover_body}>
                                        <div>{t('checkFunction')}</div>
                                        <div>{t('availableTg')}</div>
                                        <div>{t('enabledTg')}</div>
                                    </div>
                                    <div className={cls.cover_footer}>
                                        <div>@stt_info_bot</div>
                                    </div>
                                    <CustomButton onClick={closeModalSafetyConnection} classNameBtn={cls.btn} type='button'>
                                        ok
                                    </CustomButton>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SafetyConnection;
