import React from 'react';
import DonHaveAccount from '../donHaveAccount/donHaveAccount';
import { useAppSelector } from '../../shared/redux/hooks/hooks';
import HaveAccount from '../haveAccount/haveAccount';

export const isHaveAccount = true;

const IqPumpMainWindow = () => {
    const { telegramUsername, loggedIn } = useAppSelector(({ authSlice }) => authSlice);

    return (
        <>
            {/*<DonHaveAccount />*/}
            {loggedIn && <HaveAccount />}
        </>
    );
};

export default IqPumpMainWindow;
