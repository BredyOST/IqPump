import React  from 'react';
import NotAuthorizedUser from "../not-authorized-user/not-authorized-user.tsx";
import {ERROR_CHECK_TG} from "../../entities/entities.ts";
import {useAppKit} from "@reown/appkit/react";
import cls from './main-iq-pump-window.module.scss';
import CustomButton from "../../shared/ui/custom-button/custom-button.tsx";
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react';
import { arbitrum, } from '@reown/appkit/networks'
import {BrowserProvider, ethers} from "ethers";
import axios from "axios";
import Portal from "../../shared/ui/portal/portal.tsx";
import Modal from "../../shared/ui/modal/modal.tsx";
import NotificationTg from "../../widjets/modal-windows/notificationTg/notificationTg.tsx";
import SafetyConnection from "../../widjets/modal-windows/safetyConnection/safetyConnection.tsx";
import {showAttention} from "../../shared/tostify/attention.ts";
import {LANGUAGES, tokenContractAbi, tokenContractAddress} from "../../../index.const.ts";
import HaveAccount from "../haveAccount/haveAccount.tsx";
import Loader from "../../widjets/loader/loader.tsx";
import { useTranslation } from 'react-i18next';
import CustomSelect from "../../shared/ui/select/custom-select.tsx";
import i18next from "i18next";
import {userStore} from "../../shared/mobX/store/userStore.ts";
import {isLoadingStore} from "../../shared/mobX/store/isLoadingStore.ts";
import {observer} from "mobx-react-lite";
import {modalStatesStore} from "../../shared/mobX/store/modalStatesStore.ts";

const MainIqPumpWindow = observer(() => {

    const [isLoadingCheckingBalance, setIsLoadingCheckingBalance] = React.useState<boolean>(false)
    const [transactionSuccess, setTransactionSuccess] = React.useState<boolean>(false)
    const [showSelectMenu, setShowSelectMenu] = React.useState<boolean>(false)

    const {loggedIn, telegramUsername, hasAccountIpPump, wallet} = userStore.user;
    const {modalCheckSafetyConnection, modalNotifications} = modalStatesStore.modals

    const { t } = useTranslation();

    /** appkit*/
    const {  isConnected} = useAppKitAccount();
    const { walletProvider } = useAppKitProvider('eip155');
    const { chainId, switchNetwork } = useAppKitNetwork();
    const {  open,  } = useAppKit();
    
    /** проверка подключения уведомлений и отправка сообщения в тг о входе в аккаунт*/
    async function checkNotifications(): Promise<boolean> {
        try {
            isLoadingStore.setState(true, '');

            const data: { account: string } = { account: wallet };
            const response: any = await axios.post('https://stt.market/api/notifications/check/', data);
            console.log('проверка тг')
            console.log(response);
            if (response?.status === 200) {
                const responseData:any = response?.data;

                userStore.setState('telegramUsername', responseData?.username);

                /** отправка уведомления*/
                const data: { username: string } = { username: responseData?.username };
                await axios.post('https://stt.market/api/notifications/safety/', data);
            }
            return true
        } catch (err) {
            showAttention(ERROR_CHECK_TG, 'error')
            console.error('Error checking notifications:', err);
            return true
        } finally {
            isLoadingStore.setState(false, '');
        }
    }

    /** открытие попапа уведомлений*/
    async function  openModalSafetyConnection ():Promise<void> {

        if(!loggedIn) {
            showAttention(t('needLogIn'), 'error')
            return;
        }

        if (telegramUsername) {
            isLoadingStore.setState(true, '');

            const result = await checkNotifications();
            if(result){
                isLoadingStore.setState(false, '')
                modalStatesStore.setState('modalCheckSafetyConnection', {isOpen:true, isClosing: false})
            }
        } else {
            modalStatesStore.setState('modalCheckSafetyConnection', {isOpen:true, isClosing: false})
        }
    };

    /** авторизация через кошелек*/
    async function connectAccount(): Promise<void> {
        try {
            await open();
        } catch (error) {
            console.log('Error handle loginThunk', error);
        }
    }

    /** создание провайдера и получение адреса кошелька*/
    async function getInfo(providerWallet: any): Promise<void> {
        try {
            console.log('getInfo')
            const ethersProvider = new BrowserProvider(providerWallet);
            const signer = await ethersProvider.getSigner();
            const userAddress = await signer.getAddress();

            userStore.setState('loggedIn', true)
            userStore.setState('wallet', userAddress)
            userStore.setState('provider', ethersProvider)
            console.log('wallet')
            console.log(userAddress)

        } catch (err) {
            console.log(err);
        }
    }

    /** Функция проверки телеграмма*/
    async function prepareTelegram(): Promise<void> {
        try {

            if(!loggedIn) {
                showAttention(t('needLogIn'), 'error')
                return;
            }

            isLoadingStore.setState(true, '');

            const data: { account: string } = { account: wallet };
            const response = await axios.post('https://stt.market/api/notifications/create/', data);
            console.log('prepareTelegram')
            console.log(response?.data)

            if (response.status === 200) {
                let responseData:any = response.data;

                modalStatesStore.setState('modalNotifications', {isOpen:true, isClosing: false})

                if (responseData.status === 400) {
                    modalStatesStore.setState('modalNotifications', {isOpen:true, isClosing: false})

                } else if (responseData.status === 200) {
                    userStore.setState('telegramValid', responseData?.valid)
                    userStore.setState('telegramCode', responseData?.code)
                    modalStatesStore.setState('modalNotifications', {isOpen:true, isClosing: false})
                }
            }
        } catch (err) {
            showAttention(ERROR_CHECK_TG, 'error')
            console.log(err);
        } finally {
            isLoadingStore.setState(false, '');
        }
    }

    /** получаем токены на кошельке*/
    const fetchBalanceData = async (providerChain: any) => {
        try {
            if (!providerChain) return;
            const provider = new BrowserProvider(providerChain);

            const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider);

            const stBalance = +(Number(await contract.balanceOf(wallet)) / Math.pow(10, 9) - 0.01).toFixed(2);
            userStore.setState('balanceStt', stBalance.toString())

        } catch (err) {
            console.log(err);
        } finally {
            setIsLoadingCheckingBalance(false)
        }
    };

    const openMenu:() => void = () => {
        setShowSelectMenu(prev => !prev)
    }
    const changeLanguage = (value:string) => {
        i18next.changeLanguage(value);
    }

    /** при смене сети или входе через кошелек проверяем chainid и меняем на арбитрум если требуется*/
    React.useEffect(() => {
        if (!isConnected) {
            userStore.setState('loggedIn', false)
            userStore.setState('wallet', '')
            userStore.setState('provider', '')

        } else if (chainId !== arbitrum?.id) {
            showAttention(`Please, connect to Arbitrum Network (${arbitrum?.id})`, 'error');
            switchNetwork(arbitrum);
        }
    }, [chainId, isConnected]);

    /** проверяем при авторизации к какой сети подключается пользователь*/
    React.useEffect(() => {
        console.log('provider')
        console.log(walletProvider)
        if (walletProvider && chainId === arbitrum?.id) {
            getInfo(walletProvider);
        }
    }, [walletProvider, chainId]);

   React.useEffect(() => {
        if (wallet) checkNotifications();
        /** pапрос на бек*/
       // userStore.setState('hasAccountIpPump', false)

   }, [wallet]);

    React.useEffect(() => {
        setIsLoadingCheckingBalance(true)
        fetchBalanceData(walletProvider);
    }, [wallet]);

    React.useEffect(() => {
        fetchBalanceData(walletProvider)
    },[transactionSuccess])

    /** для теста*/
    const change:(arg:boolean) => void = (value) => {
        userStore.setState('hasAccountIpPump', !hasAccountIpPump)
        userStore.setState('hasAccountIpPump', value)
    }

    return (
        <div className={cls.overlay}>
            <div className={cls.cover}>
                <div className={cls.notification_actions_btn}>
                    <CustomSelect
                        options={LANGUAGES}
                        classNameWrapper={cls.select_wrap}
                        classNameChosenValue={cls.select_chosen_value}
                        classNameOption={cls.select_option}
                        classNameShowed={cls.select_show_list}
                        chosenValue={i18next.language}
                        classNameBodyList={cls.selet_list}
                        classNameTextWithImage={cls.select_text}
                        onSelect={changeLanguage}
                        classNameIcon={cls.icon}
                        handleOpenMenu={openMenu}
                        isOpenMenu={showSelectMenu}
                        classNameBlockList={cls.bllock_list}
                    />
                    <div className={cls.cover_btns}>
                        <CustomButton classnameWrapper={cls.wrapper_btn} onClick={prepareTelegram} classNameBtn={cls.btn_stt} type='button'>
                            <img src="./svg/notifications.svg" className={cls.icon_notifications} alt="svg_icon"/>
                        </CustomButton>
                        <CustomButton classnameWrapper={cls.wrapper_btn}  classNameBtn={cls.btn_stt} type='button' onClick={openModalSafetyConnection}>
                            <img className={cls.icon_check} src="./svg/safety.svg" alt="svg_icon"/>
                        </CustomButton>
                        <CustomButton classNameBtn={cls.btn_connect_login} type='button' onClick={connectAccount}>
                            {isConnected ? t('logout') : t('connect')}
                        </CustomButton>
                    </div>
                </div>
                {!hasAccountIpPump &&
                    <NotAuthorizedUser
                        test={change}
                    />
                }
                {loggedIn && hasAccountIpPump &&
                    <HaveAccount
                        isloadingCheckBalance={isLoadingCheckingBalance}
                        setTransactionSuccess={setTransactionSuccess}
                        test={change}
                    />
                }
            </div>
            <Portal whereToAdd={document.body}>
                <Modal show={modalNotifications?.isOpen} closing={modalNotifications?.isClosing}>
                    <NotificationTg/>
                </Modal>
            </Portal>
            <Portal whereToAdd={document.body}>
                <Modal show={modalCheckSafetyConnection?.isOpen} closing={modalCheckSafetyConnection?.isClosing}>
                    <SafetyConnection/>
                </Modal>
            </Portal>
            <Portal whereToAdd={document.body}>
                <Loader/>
            </Portal>
        </div>
    );
});

export default MainIqPumpWindow;