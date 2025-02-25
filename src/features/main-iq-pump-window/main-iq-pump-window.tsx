import React  from 'react';
import NotAuthorizedUser from "../not-authorized-user/not-authorized-user.tsx";
import {ERROR_CHECK_TG, IUserInfo, ModalIndicators, SEND_MSG_TO_TELEGRAM} from "../../entities/entities.ts";
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
import {b} from "vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P";

const MainIqPumpWindow = () => {

    const [authoriedInfo, setAuthoriedInfo] = React.useState<IUserInfo>({
        loggedIn:false,
        wallet:'',
        telegramUsername:'',
        hasAccountIpPump:false,
        telegramCode:null,
        telegramValid:false,
        balanceStt:'',
        provider:null
    })

    const [modalNotifications, setModalNotifications] = React.useState<ModalIndicators>({isOpen:false, isClosing: false})
    const [modalCheckSafetyConnection, setsModalCheckSafetyConnection] = React.useState<ModalIndicators>({isOpen:false, isClosing: false})
    const [isLoading, setIsLoading] = React.useState<{isLoad:boolean, text: string}>({isLoad:false, text: ''})
    const [isLoadingCheckingBalance, setIsLoadingCheckingBalance] = React.useState<boolean>(false)
    const [transactionSuccess, setTransactionSuccess] = React.useState<boolean>(false)
    const [showSelectMenu, setShowSelectMenu] = React.useState<boolean>(false)

    const { t } = useTranslation();

    /** appkit*/
    const { isConnected} = useAppKitAccount();
    const { walletProvider } = useAppKitProvider('eip155');
    const { chainId, switchNetwork,  } = useAppKitNetwork();
    const { open } = useAppKit();

    /** проверка подключения уведомлений и отправка сообщения в тг о входе в аккаунт*/
    async function checkNotifications(): Promise<boolean> {
        try {
            setIsLoading((prev) => ({...prev, isLoad: true,  text: ''}))
            const data: { account: string } = { account: authoriedInfo?.wallet };
            const response: any = await axios.post('https://stt.market/api/notifications/check/', data);

            if (response?.status === 200) {
                const responseData:any = response?.data;

                setAuthoriedInfo((prev) => ({...prev, telegramUsername:responseData?.username}));

                /** отправка уведомления*/
                const data: { username: string } = { username: responseData?.username };
                await axios.post('https://stt.market/api/notifications/safety/', data);
                showAttention(SEND_MSG_TO_TELEGRAM, 'success')
            }
            return true
        } catch (err) {
            showAttention(ERROR_CHECK_TG, 'error')
            console.error('Error checking notifications:', err);
            return true
        } finally {
            setIsLoading({isLoad: false,  text: ''})
        }
    }

    /** открытие попапа уведомлений*/
    async function  openModalSafetyConnection ():Promise<void> {
        if (authoriedInfo?.telegramUsername) {
            setIsLoading((prev) => ({...prev, isLoad: true,  text: ''}))
            const result = await checkNotifications();
            if(result){
                setIsLoading((prev) => ({...prev, isLoad: false,  text: ''}))
                setsModalCheckSafetyConnection({isOpen:true, isClosing: false})
            }
        } else {
            setsModalCheckSafetyConnection({isOpen:true, isClosing: false})
        }
    };

    /** авторизация через кошелек*/
    async function connectAccount(): Promise<void> {
        try {
            const res = await open();
            console.log(res)
        } catch (error) {
            console.log('Error handle loginThunk', error);
        }
    }

    /** создание провайдера и получение адреса кошелька*/
    async function getInfo(providerWallet: any): Promise<void> {
        try {
            const ethersProvider = new BrowserProvider(providerWallet);
            const signer = await ethersProvider.getSigner();
            const userAddress = await signer.getAddress();
            setAuthoriedInfo((prev) => ({...prev, loggedIn:true,  wallet:userAddress, provider: ethersProvider}));

        } catch (err) {
            console.log(err);
        }
    }

    /** Функция проверки телеграмма*/
    async function prepareTelegram(): Promise<void> {
        try {
            setIsLoading({isLoad: true,  text: ''})
            const data: { account: string } = { account: authoriedInfo?.wallet };
            const response = await axios.post('https://stt.market/api/notifications/create/', data);

            if (response.status === 200) {
                let responseData:any = response.data;
                setModalNotifications({isOpen:true, isClosing: false})

                if (responseData.status === 400) {
                    setModalNotifications({isOpen:true, isClosing: false})
                    showAttention(responseData?.message, 'error')
                } else if (responseData.status === 200) {
                    setAuthoriedInfo((prev) => ({...prev, telegramValid:responseData?.valid,  telegramCode:responseData?.code}));
                    setModalNotifications({isOpen:true, isClosing: false})
                }
            }
        } catch (err) {
            showAttention(ERROR_CHECK_TG, 'error')
            console.log(err);
        } finally {
            setIsLoading({isLoad: false,  text: ''})
        }
    }

    /** при смене сети или входе через кошелек проверяем chainid и меняем на арбитрум если требуется*/
    React.useEffect(() => {
        if (!isConnected) {
            setAuthoriedInfo((prev) => ({...prev, loggedIn: false, wallet: ''}));
        } else if (chainId !== arbitrum?.id) {
            showAttention(`Please, connect to Arbitrum Network (${arbitrum?.id})`, 'error');
            switchNetwork(arbitrum);
        }
    }, [chainId, isConnected]);

    /** проверяем при авторизации к какой сети подключается пользователь*/
    React.useEffect(() => {
        if (walletProvider && chainId === arbitrum?.id) {
            getInfo(walletProvider);
        }
    }, [walletProvider, chainId]);


   React.useEffect(() => {
        if (authoriedInfo?.wallet) checkNotifications();
       setTimeout(() => setAuthoriedInfo((prev:IUserInfo)=> ({...prev, hasAccountIpPump:false})), 500)

   }, [authoriedInfo?.wallet]);

    /** получаем токены*/
    const fetchBalanceData = async (providerChain: any) => {
        try {
            if (!providerChain) return;
            const provider = new BrowserProvider(providerChain);

            const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider);

            const stBalance = +(Number(await contract.balanceOf(authoriedInfo.wallet)) / Math.pow(10, 9) - 0.01).toFixed(2);
            setAuthoriedInfo((prev) => ({...prev, balanceStt: stBalance.toString()}));

        } catch (err) {
            console.log(err);
        } finally {
            setIsLoadingCheckingBalance(false)
        }
    };

    React.useEffect(() => {
        setIsLoadingCheckingBalance(true)
        fetchBalanceData(walletProvider);
    }, [isConnected, authoriedInfo.wallet]);


    const openMenu:() => void = () => {
        setShowSelectMenu(prev => !prev)
    }
    const changeLanguage = (value:string) => {
        i18next.changeLanguage(value);
    }

    React.useEffect(() => {
        fetchBalanceData(walletProvider)
    },[transactionSuccess])

    /** для теста*/
    const change:(arg:boolean) => void = (value) => {
       setAuthoriedInfo((prev:IUserInfo)=> ({...prev, hasAccountIpPump:value}))

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
                        <CustomButton onClick={prepareTelegram} classNameBtn={cls.btn_stt} type='button'>
                            <img src="./../../../src/assets/svg/notifications.svg" className={cls.icon_notifications}
                                 alt=""/>
                        </CustomButton>
                        <CustomButton classNameBtn={cls.btn_stt} type='button' onClick={openModalSafetyConnection}>
                            <img src="./../../../src/assets/svg/safety.svg" alt=""/>
                        </CustomButton>
                        <CustomButton classNameBtn={cls.btn_connect_login} type='button' onClick={connectAccount}>
                            {isConnected ? t('logout') : t('connect')}
                        </CustomButton>
                    </div>
                </div>
                {!authoriedInfo?.hasAccountIpPump &&
                    <NotAuthorizedUser
                        loggedIn={authoriedInfo.loggedIn}
                        telegramUsername={authoriedInfo.telegramUsername}
                        hasAccountIpPump={authoriedInfo.hasAccountIpPump}
                        test={change}
                    />
                }
                {authoriedInfo?.loggedIn && authoriedInfo?.hasAccountIpPump &&
                    <HaveAccount
                        wallet={authoriedInfo?.wallet}
                        telegramUsername={authoriedInfo?.telegramUsername}
                        hasAccountIpPump={authoriedInfo?.hasAccountIpPump}
                        loggedIn={authoriedInfo?.loggedIn}
                        balanceStt={authoriedInfo?.balanceStt}
                        isloadingCheckBalance={isLoadingCheckingBalance}
                        provider={authoriedInfo?.provider}
                        setIsLoading={setIsLoading}
                        setTransactionSuccess={setTransactionSuccess}
                        test={change}
                    />
                }
            </div>
            <Portal whereToAdd={document.body}>
                <Modal show={modalNotifications?.isOpen} closing={modalNotifications?.isClosing}>
                    <NotificationTg
                        state={authoriedInfo}
                        setModalNotifications={setModalNotifications}
                        setModalSafetyConnection={setsModalCheckSafetyConnection}
                        setState={setAuthoriedInfo}
                        isLoadingHandler={setIsLoading}
                    />
                </Modal>
            </Portal>
            <Portal whereToAdd={document.body}>
                <Modal show={modalCheckSafetyConnection?.isOpen} closing={modalCheckSafetyConnection?.isClosing}>
                    <SafetyConnection
                        state={authoriedInfo}
                        setModalSafetyConnection={setsModalCheckSafetyConnection}
                        isLoadingHandler={setIsLoading}
                    />
                </Modal>
            </Portal>
            <Portal whereToAdd={document.body}>
                <Loader isLoading={isLoading?.isLoad} text={isLoading?.text}></Loader>
            </Portal>
        </div>
    );
};

export default MainIqPumpWindow;