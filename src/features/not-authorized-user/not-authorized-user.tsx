import cls from './not-authorized-user.module.scss';
import {IUserInfo} from "../../entities/entities.ts";
import {useState} from "react";
import React from 'react';
import {useTranslation} from "react-i18next";

export interface INotAuthorizedUserProps extends Pick<IUserInfo,
    'telegramUsername' |
    'loggedIn' |
    'hasAccountIpPump'> {}


const NotAuthorizedUser = ({
                               loggedIn,
                               telegramUsername,
                               hasAccountIpPump,
                           }: INotAuthorizedUserProps) => {


    const [textInfo, setTextInfo] = useState<string>('');
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
            <div className={cls.title_cover}>
                <img src="./../../../public/svg/brain.svg" className={cls.icon} alt="icons"/>
                <h3 className={cls.title}>IQ PUMP</h3>
            </div>
            <div className={cls.cover}>
                <div className={cls.balance_block}>
                    <h3 className={cls.subtitle_block}>
                        {textInfo}
                    </h3>
                </div>
                <div className={cls.cover_btn_send_cover}>
                    <a href='https://web.telegram.org/a/#7893128019'
                       target='_blank'
                        className={cls.btn_send}
                        type='button'
                    >
                        {t('toIqPump')}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NotAuthorizedUser;
