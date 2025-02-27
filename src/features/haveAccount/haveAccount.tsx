import React, { useState } from 'react';
import {ethers} from 'ethers';
import cls from './haveAccount.module.scss';
import CustomButton from "../../shared/ui/custom-button/custom-button.tsx";
import CustomInput from "../../shared/ui/custom-Input/custom-Input.tsx";
import {FUNDING_WALLET_IQ_PUMP} from "../../App.tsx";
import {
    sttAffiliateAddress,
    tokenContractAbi,
    tokenContractAbiCb31,
    tokenContractAddress
} from "../../../index.const.ts";
import {useTranslation} from "react-i18next";
import {showAttention} from "../../shared/tostify/attention.ts";
import {userStore} from "../../shared/mobX/store/userStore.ts";
import {observer} from "mobx-react-lite";
import {isLoadingStore} from "../../shared/mobX/store/isLoadingStore.ts";
import {modalStatesStore} from "../../shared/mobX/store/modalStatesStore.ts";
import Modal from "../../shared/ui/modal/modal.tsx";
import Portal from "../../shared/ui/portal/portal.tsx";
import WithdrawalAccess from "../../widjets/modal-windows/withdrawalAccess/withdrawalAccess.tsx";

export interface IHaveAccountProps{
    isloadingCheckBalance:boolean;
    setTransactionSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    test:(arg:boolean) => void;
}

const HaveAccount = observer(({

                     isloadingCheckBalance,
                         test,
                         setTransactionSuccess,
                     }: IHaveAccountProps) => {

    const [transferTokens, setTransferTokens] = useState<string>('')
    const [chooseBtn, setChooseBtn] = React.useState<'funding' | 'withdraw' | ''>()
    const [accessWithdraw, setAccessWithdraw ] = React.useState<boolean | null>(null)
    const [accessFunding, setAccessFunding ] = React.useState<boolean | null>(null)
    const [gameBalance, setGameBalance] = React.useState<string>('2220')

    const {telegramUsername,wallet, provider, balanceStt} = userStore.user;
    const {modalWithdrawalAccess} = modalStatesStore.modals

    const { t } = useTranslation();

    /** для ввода токенов для отправки*/
    const setTokensForTransfer = (e: React.ChangeEvent<HTMLInputElement>) => {

        if(!chooseBtn) {
            showAttention('выберите действие, "пополнить или вывести" ', 'warning')
            return;
        }
        const inputValue = e.target.value

        // Проверка на допустимые символы (цифры и точка)
        const isValidInput = /^\d*\.?\d{0,3}$/.test(inputValue)

        if (!isValidInput) {
            return;
        }

        const number = parseFloat(inputValue);

        /**проверка*/
        if(chooseBtn === 'funding') {
            if(!balanceStt || balanceStt === '0' || +balanceStt <= 0) {
                showAttention('У вас недостаточно на балансе для пополнения', 'warning')
                return;
            }
            if (+number > +balanceStt) {
                setTransferTokens(balanceStt.toString());
                setAccessFunding(true)
            } else if (inputValue.length === 0) {
                setTransferTokens('0');
                setAccessFunding(null)
            }  else {
                setAccessFunding(true)
                setTransferTokens(inputValue);
            }
        } else {
            if((!gameBalance || gameBalance == '0') || +gameBalance <= 0) {
                showAttention('На балансе игры не достаточно токенов для вывода', 'warning')
                return;
            }
            if (+number > +gameBalance ) {
                setTransferTokens(gameBalance.toString());
                setAccessWithdraw(true)
            } else if (inputValue.length === 0) {
                setTransferTokens('0');
                setAccessWithdraw(false)
            } else {
                setAccessWithdraw(true)
                setTransferTokens(inputValue);
            }
        }
    };

    const handleBalance = () => {
        if(chooseBtn === 'funding') {
            if(accessFunding) {
                    return true
            } else {
                showAttention('Введите сумму токенов в поле ввода','warning')
                return false
            }
        } else if(chooseBtn === 'withdraw') {
            if(accessWithdraw) {
                return true
            } else {
                showAttention('Введите сумму токенов в поле ввода','warning')
                return false
            }
        } else {
            showAttention('Для вывода или пополнения баланса игры необходимо ввести сумму токенов и выбрать действие "пополнить или вывести"','warning')
            return false
        }
    }


    // const accessBtnHandler = (amount: string) => {
    //     if(chooseBtn === 'funding') {
    //         sendTokens(amount)
    //     } else {
    //         withdrawal()
    //     }
    // }

    /**Функция отправки токенов*/
    async function sendTokens(amount: string) {

        if(chooseBtn === 'funding' && +balanceStt < 1000) {
            showAttention(`На вашем балансе ${balanceStt} STT, минимальная сумма для пополнения 1000 STT`,'warning')
            return
        } else if (chooseBtn === 'withdraw' && +gameBalance < 1000) {
            showAttention(`На вашем игровом балансе ${gameBalance} STT, минимальная сумма для вывода 1000 STT`,'warning')
            return
        }
        if(+transferTokens == 0 || !transferTokens) {
            showAttention(`Введите сумму токенов для пополнения или вывода, минимальная сумма - 1000 STT`,'warning')
            return
        }

        if(+transferTokens < 1000) {
            showAttention(` Минимальная сумма токенов для вывода  пополнения - 1000 STT`,'warning')
            return
        }

        const result = handleBalance()

        if(!result) return result

        if (+transferTokens <= 0) {
            return;
        }

        if(chooseBtn === 'withdraw') {
            openModalWithdrawal()
            return
        }


        try {

            isLoadingStore.setState(true, 'Preparation for the transaction');

            const signer = await provider.getSigner();
            const userAddress = await signer.getAddress();

            const contractCommon = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer);
            const contract = new ethers.Contract(sttAffiliateAddress, tokenContractAbiCb31, signer);

            const decimals = await contractCommon.decimals();
            const tokenAmount = ethers.parseUnits(amount.toString(), parseInt(decimals));

            // Проверяем allowance
            const allowanceBefore = await contractCommon.allowance(userAddress, FUNDING_WALLET_IQ_PUMP);
            console.log('Allowance before approve:', allowanceBefore.toString());

            // Если allowance меньше необходимого количества, выполняем approve
            if (allowanceBefore < tokenAmount) {
                isLoadingStore.setState(true, 'Waiting for approve transaction confirmation');

                const txApprove = await contractCommon.approve(sttAffiliateAddress, tokenAmount);
                console.log('Approve transaction sent:', txApprove.hash);

                await txApprove.wait();
                console.log('Approve transaction confirmed');
            } else {
                console.log('Approve not required, allowance is sufficient');
            }

            isLoadingStore.setState(true, 'Preparing token transfer');

            // Выполняем перевод токенов
            const tx = await contract.paymentToTheShop(FUNDING_WALLET_IQ_PUMP, tokenAmount);
            console.log('Transaction sent:', tx?.hash);

            isLoadingStore.setState(true, 'Transaction sent');

            await tx.wait();
            console.log('Transaction confirmed');
            isLoadingStore.setState(true, 'Transaction confirmed');

            setTransferTokens('0');
            setTransactionSuccess(prev => !prev);

        } catch (error) {
            console.error('Error sending tokens:', error);
            showAttention(`Error sending tokens`, 'error');

        } finally {
            isLoadingStore.setState(false, '');        }
    }

    /** вывод токенов*/
    const openModalWithdrawal: ()=> void = () => {
        modalStatesStore.setState('modalWithdrawalAccess', {isOpen: true, isClosing: false})
    }

    const formatNumber = (num:number):string => {
        return num.toLocaleString('en-US', { minimumFractionDigits: 0 });
    };

    const changeChoose = (text: 'funding' | 'withdraw') => {
        if(text === chooseBtn) {
            setChooseBtn('');
        } else {
            if(text === 'funding') {
                if(transferTokens < balanceStt) {
                    setAccessFunding(false)
                } else if(transferTokens > balanceStt) {
                    setAccessFunding(true);
                } else {
                    setAccessFunding(null)
                }
            } else {
                if(transferTokens < gameBalance) {
                    setAccessFunding(false)
                } else if(transferTokens > gameBalance) {
                    setAccessFunding(true)
                } else {
                    setAccessFunding(null)
                }
            }
            setChooseBtn(text);
        }
    }

    React.useEffect(() => {
      if(chooseBtn === '' || !chooseBtn) {
          setAccessWithdraw(null)
          setAccessFunding(null)
      }
        setTransferTokens('')
    },[chooseBtn])


    return (
        <div className={cls.wrapper}>
            <div>
                <h3 className={cls.title}>IQ PUMP</h3>
                <div className={cls.title_cover_main}>
                    <div className={cls.cover_for_position}>
                        <div className={cls.title_cover}>
                            <img src="./svg/brain.svg" className={cls.icon} alt="icons"/>
                            <div className={cls.background}></div>
                        </div>
                    </div>
                    <div className={cls.th_info}>
                        <div className={cls.user_name_tg}>{telegramUsername}</div>
                        <div className={cls.adress}>{`${wallet?.slice(0, 10)}...${wallet?.slice(35)}`}</div>
                    </div>
                </div>
            </div>
            <div className={cls.balance_body_block}>
                <div className={cls.balance_block}>
                    <h3 className={cls.subtitle_block}>{t('balance')}</h3>
                    <div
                        className={cls.balance_stt}>{isloadingCheckBalance ? 'checking...' : formatNumber(+gameBalance)?.toString()} STT
                    </div>
                    <div className={cls.btns_block}>
                        <CustomButton onClick={() => changeChoose('funding')} type='button'
                                      classNameBtn={`${cls.btn_cash} ${cls.left} ${chooseBtn === 'funding' ? cls.active : ''}`}>
                            <div className={cls.text_in_btn}>
                                <div>+</div>
                                <div className={cls.add_money}>{t('funding')}</div>
                            </div>
                        </CustomButton>
                        <CustomButton onClick={() => changeChoose('withdraw')} type='button' classNameBtn={`${cls.btn_cash} ${cls.right} ${chooseBtn === 'withdraw' ? cls.active : ''}`}>
                            <div className={cls.text_in_btn}>
                                <div>—</div>
                                <div>{t('withdraw')}</div>
                            </div>
                        </CustomButton>
                    </div>
                </div>
                <div className={cls.input_block}>
                    <CustomInput
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTokensForTransfer(e)}
                        type='text'
                        placeholder='0.00'
                        value={+transferTokens > 0 ? transferTokens : ''}
                        classNameWrapper={cls.wrap_inp}
                        classNameInput={cls.inp}
                    />
                    {chooseBtn === 'funding' && +balanceStt >= 1000 && <div className={cls.range}>Min {formatNumber(1000)?.toString()} - Max {formatNumber(+balanceStt)?.toString()} STT</div>}
                    {chooseBtn === 'funding' && +balanceStt < 1000 && <div className={`${cls.range} ${cls.red}`}>Your balance less then 1000 STT</div>}

                    {chooseBtn === 'withdraw' && +gameBalance >= 1000 && <div className={cls.range}>Min {formatNumber(1000)?.toString()} - Max {formatNumber(+gameBalance)?.toString()} STT</div>}
                    {chooseBtn === 'withdraw' && +gameBalance < 1000 && <div className={`${cls.range} ${cls.red}`}>Your balance less then 1000 STT</div>}
                </div>
                <div className={cls.cover_btn}>
                    <div className={cls.cover_btn_send_cover}>
                        <CustomButton classNameBtn={`${cls.btn_send} ${((accessFunding || accessWithdraw) && +transferTokens >= 1000) ? cls.acess : ''}`} type='button' onClick={() => sendTokens(transferTokens)}>
                            {t('access')}
                        </CustomButton>
                    </div>
                    <div className={cls.cover_btn_send_cover}>
                        <CustomButton onClick={() => test(false)} classNameBtn={cls.btn_cancel} type='button'>
                            {t('cancel')}
                        </CustomButton>
                    </div>
                </div>
            </div>
            <Portal whereToAdd={document.body}>
                <Modal show={modalWithdrawalAccess?.isOpen} closing={modalWithdrawalAccess?.isClosing}>
                    <WithdrawalAccess tokens={transferTokens}/>
                </Modal>
            </Portal>
        </div>
    );
});

export default HaveAccount;
