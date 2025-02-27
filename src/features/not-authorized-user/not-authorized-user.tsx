import cls from './not-authorized-user.module.scss';
import {useState} from "react";
import React from 'react';
import {useTranslation} from "react-i18next";
import {userStore} from "../../shared/mobX/store/userStore.ts";
import {observer} from "mobx-react-lite";

export interface INotAuthorizedUserProps {
    test:(arg:boolean) => void;
}

const NotAuthorizedUser = observer(({
                               test
                           }: INotAuthorizedUserProps) => {

    const [textInfo, setTextInfo] = useState<string>('');
    const {loggedIn, telegramUsername, hasAccountIpPump} = userStore.user;

    const { t, i18n } = useTranslation();

    React.useEffect(() => {

        setTextInfo(
            !loggedIn
                ? t('needToGetAccess')
                : !telegramUsername
                    ? t('needToGetAccess')
                    : !hasAccountIpPump
                        ? t('dontHaveAnAccount')
                        : ''
        );
    }, [loggedIn, telegramUsername, hasAccountIpPump,i18n.language]);

    return (
        <div className={cls.wrapper}>
            <div className={cls.cover_for_position}>
                <div className={cls.title_cover}>
                    <img src="./svg/brain.svg" className={cls.icon} alt="icons"/>
                    <div className={cls.background}></div>
                </div>
            </div>
            <div className={cls.cover}>
                <div className={cls.balance_block}>
                    <h3 className={cls.title}>IQ PUMP</h3>
                    <p className={cls.subtitle_block}>
                        {textInfo}
                    </p>
                </div>
                <div className={cls.cover_btn_send_cover}>
                    <button onClick={() => test(true)}
                            className={cls.btn_send}
                            type='button'
                    >
                        {t('toIqPump')}
                    </button>
                    {/*<a href='https://web.telegram.org/a/#7893128019'*/}
                    {/*   target='_blank'*/}
                    {/*   className={cls.btn_send}*/}
                    {/*   type='button'*/}
                    {/*>*/}
                    {/*    {t('toIqPump')}*/}
                    {/*</a>*/}
                </div>
            </div>
        </div>
    );
})

export default NotAuthorizedUser;
