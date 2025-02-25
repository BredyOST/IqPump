import React from 'react';
import cls from './dontHaveAccont.module.scss';
import { ReactComponent as SvgBrain } from './../../../assets/svg/brain.svg';
import CustomButton from '../../../shared/ui/сustomButton/CustomButton';
import { useAppSelector } from '../../../shared/redux/hooks/hooks';
import { isHaveAccount } from '../iqPumpService/iqPumpMainWindow.tsx';

const DonHaveAccount = () => {
    const { telegramUsername, loggedIn } = useAppSelector(({ authSlice }) => authSlice);

    if (telegramUsername && loggedIn && isHaveAccount) {
        return null;
    }

    return (
        <div className={cls.wrapper}>
            <div className={cls.title_cover}>
                <SvgBrain className={cls.svg_brain} />
                <h3 className={cls.title}>IQ PUMP</h3>
            </div>
            <div className={cls.balance_block}>
                {!loggedIn && (
                    <h3 className={cls.subtitle_block}>
                        Для работы <br />
                        с функционалом пополнения <br />
                        и вывода монет, пожалуйста <br />
                        авторизуйтесь на сайте и подключите <br />
                        уведомления в Telegram <br />
                    </h3>
                )}

                {!isHaveAccount && loggedIn && (
                    <h3 className={cls.subtitle_block}>
                        У вас нет <br />
                        зарегистрированного аккаунта <br />в IQ PUMP
                    </h3>
                )}

                {isHaveAccount && loggedIn && !telegramUsername && (
                    <h3 className={cls.subtitle_block}>
                        Для работы <br />
                        с функционалом пополнения <br />
                        и вывода монет, пожалуйста <br />
                        авторизуйтесь и подключите <br />
                        уведомления в Telegram <br />
                    </h3>
                )}
            </div>
            <div className={cls.cover_btn_send_cover}>
                <CustomButton classNameBtn={cls.btn_send} type='button'>
                    Перейти в игру
                </CustomButton>
            </div>
        </div>
    );
};

export default DonHaveAccount;
