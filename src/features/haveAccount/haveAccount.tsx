import React, { useState } from 'react';
import {BrowserProvider, ethers} from 'ethers';
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

export interface IHaveAccountProps{
    telegramUsername:string
    loggedIn: boolean
    hasAccountIpPump: boolean
    balanceStt:string
    wallet:string
    provider : any
    setIsLoading:(arg:{isLoad:boolean, text: string}) => void
    isloadingCheckBalance:boolean;
    setTransactionSuccess:(arg:boolean) => void;
}


const HaveAccount = ({
                    telegramUsername,
                    balanceStt,
                     isloadingCheckBalance,
                         setIsLoading,
                         provider,
                         setTransactionSuccess,
                    wallet,
                     }: IHaveAccountProps) => {

    const [transferTokens, setTransferTokens] = useState<string>('0');

    /** для ввода токенов для отправки*/
    const setTokensForTransfer = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Проверка на допустимые символы (цифры и точка)
        const isValidInput = /^\d*\.?\d{0,3}$/.test(inputValue);

        if (!isValidInput) {
            return; // Если введены недопустимые символы, просто игнорируем
        }

        const number = parseFloat(inputValue);

        if (+number > +balanceStt) {
            setTransferTokens(balanceStt.toString());
            // calculateReceivedAmount(balanceStt, walletProvider);
        } else if (inputValue.length === 0) {
            setTransferTokens('0');
            // setSendTokensValue('0');
        } else {
            setTransferTokens(inputValue);
            // calculateReceivedAmount(inputValue, walletProvider);
        }
    };

    /** Функция расчета итоговой суммы с учетом комиссии */
    // async function calculateReceivedAmount(amount, providerWallet:any) {
    //     // if (!amount) {
    //     //     setSendTokensValue('0');
    //     //     return;
    //     // }
    //
    //     try {
    //         const provider = new BrowserProvider(providerWallet);
    //
    //         const signer = await provider.getSigner();
    //         // Контракт для получения decimals (обычно токена)
    //         const contractCommon = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer);
    //
    //         // Получаем количество десятичных знаков токена
    //         const decimals = await contractCommon.decimals();
    //         // Преобразуем введённое значение в BigNumber с учетом decimals
    //         const tokenAmount = ethers.parseUnits(amount.toString(), parseInt(decimals));
    //
    //         // Вычисляем внешнюю комиссию ( 1% от суммы)
    //         const externalFee = (tokenAmount * BigInt(1)) / BigInt(100);
    //         // Определяем сумму после вычета внешней комиссии
    //         const paymentBase = tokenAmount - externalFee;
    //
    //         // Форматируем итоговую сумму для отображения (до 2 знаков после запятой)
    //         const result = ethers.formatUnits(paymentBase, parseInt(decimals));
    //
    //         // setSendTokensValue(String(+Number(result).toFixed(2)));
    //     } catch (error) {
    //         console.error('Error calculating received amount:', error);
    //         return null;
    //     }
    // }

    /**Функция отправки токенов*/
    async function sendTokens(amount, providerWallet:any) {

        if (+transferTokens <= 0) {
            // showAttention(`Please enter tokens for transfer`, 'error');
            return;
        }
        try {
        setIsLoading((prev) => ({...prev, isLoad:true, text: 'preparation for the transaction'}))

        const signer = await provider.getSigner();

        // Контракт токена STT
        const contractCommon = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer);
        const contract = new ethers.Contract(sttAffiliateAddress, tokenContractAbiCb31, signer);

        // Получаем decimals для токена
        const decimals = await contractCommon.decimals();
        const tokenAmount = ethers.parseUnits(amount.toString(), parseInt(decimals)); // Преобразуем в нужный формат

        // Проверяем allowance (разрешение) перед approve
        const allowanceBefore = await contractCommon.allowance(await signer.getAddress(), FUNDING_WALLET_IQ_PUMP);
        console.log('Allowance before approve:', allowanceBefore.toString());
        setIsLoading({isLoad:true, text: 'Waiting for approve transaction confirmation'})

        // Выполняем approve
        // const txApprove = await contractCommon.approve(receiver, tokenAmount);
        const txApprove = await contractCommon.approve(sttAffiliateAddress, tokenAmount);

        console.log('Approve transaction sent:', txApprove.hash);
        const receiptApprove = await txApprove.wait();
        console.log('Approve transaction confirmed:', receiptApprove);

        setIsLoading((prev) => ({isLoad:true, text: 'Approve transaction confirmed:'}))

        // Проверяем allowance после approve
        const allowanceAfter = await contractCommon.allowance(await signer.getAddress(), FUNDING_WALLET_IQ_PUMP);
        console.log('Allowance after approve:', allowanceAfter.toString());

        // Проверяем баланс подписанта
        const balance = await contractCommon.balanceOf(await signer.getAddress());
        console.log('Balance:', balance.toString());

        // Выполняем перевод токенов


            setIsLoading({isLoad:true, text: 'Preparing token transfer'})

            const tx = await contract.paymentToTheShop(FUNDING_WALLET_IQ_PUMP, tokenAmount); // Используем transfer для перевода токенов
            console.log('Transaction sent:', tx?.hash);
            // showAttention(`Transaction sent`, 'success');

            setIsLoading((prev) => ({...prev, isLoad:true, text: 'Transaction sent'}))

            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt);

            setIsLoading((prev) => ({...prev, isLoad:true, text: 'Transaction confirmed'}))
            setTransferTokens('0');

            setTransactionSuccess(prev => !prev)

        } catch (error) {
            // showAttention(`Error sending tokens`, 'error');
            console.error('Error sending tokens:', error);
            showAttention(`Error sending tokens:`, error);
            setIsLoading({isLoad:false, text: ''})
        } finally {
            // dispatch(addSuccessTransferToken(!successTransferTokens));
            // dispatch(addLoader(false));
            setIsLoading({isLoad:false, text: ''})
        }
    }

    const formatNumber = (num) => {
        return num.toLocaleString('en-US', { minimumFractionDigits: 0 });
    };

    const { t } = useTranslation();

    return (
        <div className={cls.wrapper}>
            <div className={cls.title_cover}>
                <h3 className={cls.title}>IQ PUMP</h3>
                <img src="./../../../public/svg/brain.svg" className={cls.icon} alt="icons"/>
                <div className={cls.th_info}>
                    <div className={cls.user_name_tg}>{telegramUsername}</div>
                    <div className={cls.adress}>{`${wallet?.slice(0, 10)}...${wallet?.slice(35)}`}</div>
                </div>
            </div>
            <div className={cls.balance_body_block}>
                <div className={cls.balance_block}>
                    <h3 className={cls.subtitle_block}>{t('balance')}</h3>
                    <div className={cls.balance_stt}>{isloadingCheckBalance ? 'checking...' : formatNumber(balanceStt).toString()} STT</div>
                    <div className={cls.btns_block}>
                        <CustomButton onClick={() => sendTokens(transferTokens, provider)} type='button'
                                      classNameBtn={`${cls.btn_cash} ${cls.left}`}>
                            <div className={cls.text_in_btn}>
                                <div className={cls.add_money}>{t('funding')}</div>
                            </div>
                        </CustomButton>
                        <CustomButton type='button' classNameBtn={`${cls.btn_cash} ${cls.right}`}>
                            <div className={cls.text_in_btn}>
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
                    <div className={cls.range}>Min 1,000 - Max 5, 467 STT</div>
                </div>
                <div className={cls.cover_btn}>
                    <div className={cls.cover_btn_send_cover}>
                        <CustomButton classNameBtn={cls.btn_send} type='button'>
                            {t('access')}
                        </CustomButton>
                    </div>
                    <div className={cls.cover_btn_send_cover}>
                        <CustomButton classNameBtn={cls.btn_cancel} type='button'>
                            {t('cancel')}
                        </CustomButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HaveAccount;
