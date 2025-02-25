import axios from 'axios';
import React from 'react';
import cls from './notifictionTg.module.scss';
import CustomButton from "../../../shared/ui/custom-button/custom-button.tsx";
import Countdown from "react-countdown";
import {IUserInfo} from "../../../entities/entities.ts";
import {showAttention} from "../../../shared/tostify/attention.ts";
import {useTranslation} from "react-i18next";

interface INotificationTg {
    state: IUserInfo
    setState: React.Dispatch<React.SetStateAction<IUserInfo>>;
    setModalNotifications: (arg: {isOpen:boolean, isClosing: boolean}) => void
    setModalSafetyConnection: (arg: {isOpen:boolean, isClosing: boolean}) => void
    isLoadingHandler:(arg:{isLoad: boolean,  text: string}) => void
}

const NotificationTg = ({
                    state,

                    setState,
                    setModalNotifications,
                    setModalSafetyConnection,
                            isLoadingHandler
                        }: INotificationTg) => {


    /** FUNCTIONS*/
    /** для закрытия модального окна*/
    const closeModalSafetyConnection:() => void = () => {
        setModalSafetyConnection({isOpen:false, isClosing: true})
    };

    const closeModalNotifications:() => void = () => {
        setModalNotifications({isOpen:false, isClosing: true})
    };

    /** Функция отображения попапа*/
    const showModalNotifications:() => void = () => {
        setModalNotifications({isOpen:true, isClosing: false})
    };


    /** проверяем подключены ли телеграмм уведомления*/
    async function checkTelegram(requested:any) {
        try {
            isLoadingHandler({isLoad: true,  text: ''})

            const data = { account: state?.wallet };
            const response = await axios.post('https://stt.market/api/notifications/check/', data);
            if (response.status === 200) {
                let responseData:any = response.data;
                setState((prev) =>({...prev, telegramUsername: responseData?.username}));

                if (requested) {
                    if (responseData.username !== '') {
                        closeModalSafetyConnection();
                    } else {
                        showAttention('Are you sure you have sent the code?', 'warning')
                    }
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            isLoadingHandler({isLoad: false,  text: ''})
        }
    }

    async function changeTelegram() {
        try {
            isLoadingHandler({isLoad: true,  text: ''})
            const data = { account: state?.wallet };
            const response = await axios.post('https://stt.market/api/notifications/change/', data);
            if (response.status === 200) {
                let responseData = response.data;
                if (responseData.status === 400) {
                    showAttention(responseData?.message, 'warning')
                } else if (responseData.status === 200) {
                    setState((prev) => ({ ...prev, telegramUsername: '' }));
                    closeModalSafetyConnection();
                    prepareTelegram();
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            isLoadingHandler({isLoad: false,  text: ''})
        }
    }

    async function prepareTelegram() {
        try {
            isLoadingHandler({isLoad: true,  text: ''})
            const data = { account: state?.wallet };
            const response = await axios.post('https://stt.market/api/notifications/create/', data);
            if (response.status === 200) {
                let responseData:any = response.data;
                if (responseData.status === 400) {
                    showAttention(responseData?.message, 'warning')
                } else if (responseData.status === 200) {
                    setState((prev) => ({ ...prev, telegramValid: responseData.valid, telegramCode: responseData.code }));
                    showModalNotifications();
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            isLoadingHandler({isLoad: false,  text: ''})
        }
    }
    const { t } = useTranslation();

    return (
        <>
            <div className={cls.wallet_header_telegram}>
                <div className={cls.wrapper}>
                    <div className={cls.stt_modal_header}>
                        {state?.telegramUsername !== '' ? (
                            <>
                                <div className={cls.notification_header}>NOTIFICATIONS</div>
                                <CustomButton
                                    onClick={closeModalNotifications}
                                    classnameWrapper={cls.wrapper_btn}
                                    classNameBtn={cls.cover_btn}
                                    type='button'
                                >
                                    <div className={cls.close_btn}></div>
                                </CustomButton>
                                <div className={cls.cover_head}>
                                    <div>
                                        {' '}
                                        {t('Address')} ****{state?.wallet?.substr(state?.wallet?.length - 4)} {t('linked')}
                                        <br />
                                        Telegram {t('account')}
                                    </div>
                                </div>
                                <div className={cls.cover_body_userName}>
                                    <div>{state?.telegramUsername}</div>
                                </div>
                                <div className={cls.cover_footer}></div>
                                <CustomButton onClick={changeTelegram} classNameBtn={cls.btn} type='button'>
                                    {t('Disable')}
                                </CustomButton>
                            </>
                        ) : (
                            <>
                                <div className={cls.notification_header}>NOTIFICATIONS</div>
                                <div className={cls.cover}>
                                    <CustomButton
                                        onClick={closeModalNotifications}
                                        classnameWrapper={cls.wrapper_btn}
                                        classNameBtn={cls.cover_btn}
                                        type='button'
                                    >
                                        <div className={cls.close_btn}></div>
                                    </CustomButton>
                                    <div className={cls.cover_head}>
                                    <div>{t('join')}</div>
                                        <div>{t('linkBelow')}</div>
                                    </div>
                                    <div className={cls.linkCover}>
                                        <a href={'https://t.me/stt_info_bot'} target='_blank' rel='noopener noreferrer'>
                                            @stt_info_bot
                                        </a>
                                    </div>
                                    <div className={cls.cover_body}>
                                        <div> {t('sendCode')}</div>
                                        <div> {t('CodeBelow')}</div>
                                        <div className={cls.code}>{state?.telegramCode}</div>
                                    </div>
                                    <div className={cls.cover_footer}>
                                        <div>{t('codeExpire')}</div>
                                        <Countdown date={new Date(+state?.telegramValid * 1000)} />
                                    </div>
                                    <CustomButton onClick={() => checkTelegram(true)} classNameBtn={cls.btn} type='button'>
                                        {' '}
                                        {t('Isent')}
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

export default NotificationTg;
