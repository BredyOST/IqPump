import CustomInput from "../../../shared/ui/custom-Input/custom-Input.tsx";
import cls from './WithdrawalAccess.module.scss';
import CustomButton from "../../../shared/ui/custom-button/custom-button.tsx";
import {observer} from "mobx-react-lite";
import {modalStatesStore} from "../../../shared/mobX/store/modalStatesStore.ts";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {showAttention} from "../../../shared/tostify/attention.ts";


const WithdrawalAccess = observer(({tokens}: {tokens: string}) => {

    const [transferTokens, setTransferTokens] = useState<string>('')
    const { t } = useTranslation();

    const closeModalWithdrawal = () => {
        modalStatesStore.setState('modalWithdrawalAccess', {isOpen:false, isClosing: true})
    }

    const sendRequset = () => {
        // Регулярка: минимум 6 символов, можно буквы, цифры и разрешённые спецсимволы
        const isValid = /^[a-zA-Z0-9!@#$%^&*()-_=+]{6,}$/.test(transferTokens) && /[a-zA-Z0-9]/.test(transferTokens);

        if (isValid) {

        } else {
            showAttention(
                "Неверный ввод: минимум 6 символов, без пробелов, только буквы, цифры и спецсимволы",
                "warning"
            );
        }
    }

    const changeValueInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim(); // Убираем пробелы в начале и конце
        setTransferTokens(value)

    };


    return (
        <div className={cls.wrapper}>
            <div className={cls.stt_modal_header}>
                <div className={cls.header}>{t('withdraw').toUpperCase()}</div>
                <CustomButton
                    onClick={closeModalWithdrawal}
                    classnameWrapper={cls.wrapper_btn}
                    classNameBtn={cls.cover_btn}
                    type='button'
                >
                    <div className={cls.close_btn}></div>
                </CustomButton>
                <div className={cls.text}>
                    Придумайте ключевое слово.
                    Это слово необходимо будет ввести в приложении iq Pump для подтверждения транзкации
                    в течении 24 ч с момента отправки заявки.
                    Без подтверждения вывод токенов будет отклонен.
                </div>
                <CustomInput
                    type='text'
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => changeValueInput(e)}
                    placeholder='введите ключевое слово'
                    value={transferTokens}
                    classNameWrapper={cls.wrap_inp}
                    classNameInput={cls.inp}
                />
            </div>
            <div className={cls.cover_btn}>
                <CustomButton onClick={sendRequset} classNameBtn={cls.btn} type='button'>
                    {t('access')}
                </CustomButton>
            </div>
        </div>
            );
            });

            export default WithdrawalAccess;