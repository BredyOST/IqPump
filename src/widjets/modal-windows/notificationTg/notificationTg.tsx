import axios from 'axios';
import cls from './notifictionTg.module.scss';
import CustomButton from "../../../shared/ui/custom-button/custom-button.tsx";
import Countdown from "react-countdown";
import {showAttention} from "../../../shared/tostify/attention.ts";
import {useTranslation} from "react-i18next";
import {userStore} from "../../../shared/mobX/store/userStore.ts";
import {observer} from "mobx-react-lite";
import {isLoadingStore} from "../../../shared/mobX/store/isLoadingStore.ts";
import {modalStatesStore} from "../../../shared/mobX/store/modalStatesStore.ts";

const NotificationTg = observer(() => {

    const {wallet, telegramUsername, telegramValid, telegramCode} = userStore.user;
    const { t } = useTranslation();

    /** FUNCTIONS*/
    /** для закрытия модального окна*/
    const closeModalSafetyConnection:() => void = () => {
        modalStatesStore.setState('modalCheckSafetyConnection', {isOpen:false, isClosing: true})
    };

    const closeModalNotifications:() => void = () => {
        modalStatesStore.setState('modalNotifications', {isOpen:false, isClosing: true})
    };

    /** Функция отображения попапа*/
    const showModalNotifications:() => void = () => {
        modalStatesStore.setState('modalNotifications', {isOpen:true, isClosing: false})
    };


    /** проверяем подключены ли телеграмм уведомления*/
    async function checkTelegram(requested:any) {
        try {

            isLoadingStore.setState(true, '');

            const data = { account: wallet };
            const response = await axios.post('https://stt.market/api/notifications/check/', data);
            if (response.status === 200) {
                let responseData:any = response.data;
                userStore.setState('telegramUsername', responseData?.username)

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
            isLoadingStore.setState(false, '');
        }
    }

    async function changeTelegram() {
        try {
            isLoadingStore.setState(true, '');

            const data = { account: wallet };

            const response = await axios.post('https://stt.market/api/notifications/change/', data);
            if (response.status === 200) {
                let responseData = response.data;
                if (responseData.status === 400) {
                    showAttention(responseData?.message, 'warning')
                } else if (responseData.status === 200) {
                    userStore.setState('telegramUsername', '')

                    closeModalSafetyConnection();
                    prepareTelegram();
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            isLoadingStore.setState(false, '');

        }
    }

    async function prepareTelegram() {
        try {

            isLoadingStore.setState(true, '');

            const data = { account: wallet };
            const response = await axios.post('https://stt.market/api/notifications/create/', data);
            if (response.status === 200) {
                let responseData:any = response.data;
                if (responseData.status === 400) {
                    showAttention(responseData?.message, 'warning')
                } else if (responseData.status === 200) {
                    userStore.setState('telegramValid', responseData.valid)
                    userStore.setState('telegramCode', responseData.code)
                    showModalNotifications();
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            isLoadingStore.setState(false, '');
        }
    }




    return (
        <>
            <div className={cls.wallet_header_telegram}>
                <div className={cls.wrapper}>
                    <div className={cls.stt_modal_header}>
                        {telegramUsername !== '' ? (
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
                                        {t('Address')} ****{wallet?.substr(wallet?.length - 4)} {t('linked')}
                                        <br />
                                        Telegram {t('account')}
                                    </div>
                                </div>
                                <div className={cls.cover_body_userName}>
                                    <div>{telegramUsername}</div>
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
                                        <div className={cls.code}>{telegramCode}</div>
                                    </div>
                                    <div className={cls.cover_footer}>
                                        <div>{t('codeExpire')}</div>
                                        <Countdown key={telegramUsername} date={new Date(+telegramValid * 1000)} />

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
});

export default NotificationTg;
