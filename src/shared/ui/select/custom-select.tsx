import React from 'react';
import {LANGUGES_TYPE} from "../../../entities/entities.ts";
import {LANGUAGES} from "../../../../index.const.ts";
import {useTranslation} from "react-i18next";
import i18next from "i18next";

interface ICustomSelectProps<T> {
    options: T[]
    classNameWrapper:string
    handleOpenMenu?:any
    isOpenMenu:boolean
    classNameChosenValue:string
    chosenValue:any
    classNameIcon:string,
    classNameTextWithImage:string,
    classNameBodyList:string
    classNameShowed:string,
    classNameOption:string
    onSelect:any
    classNameBlockList:string
}

const CustomSelect = ({
    options,
    classNameWrapper,
    handleOpenMenu,
    isOpenMenu,
    classNameChosenValue,
                          classNameIcon,
                          chosenValue,
                          classNameTextWithImage,
    classNameBodyList,
                          classNameShowed,
                          classNameOption,
                          onSelect,

                          classNameBlockList

                      }: ICustomSelectProps<LANGUGES_TYPE>) => {

    const { i18n } = useTranslation();

    return (
        <div className={classNameWrapper} onClick={handleOpenMenu}>
            <button className={classNameChosenValue}>
                <img src={LANGUAGES?.find((item) => item.code == chosenValue)?.url} alt={`languge`} className={classNameIcon}/>
            </button>
            {/*{isOpenMenu && (*/}
                <ul className={`${classNameBodyList} ${isOpenMenu && classNameShowed}`}>
                    {options &&
                        options?.length > 0 &&
                        options?.map((option) => (
                            <div onClick={() => onSelect(option.code)} className={classNameBlockList}>
                                <img className={classNameIcon} src={option?.url} alt={`languge`}/>
                                <li
                                    className={classNameOption}
                                    key={option.code}
                                >
                                    {option?.label}
                                </li>
                            </div>

                        ))}
                </ul>
            {/*)}*/}
        </div>
    );
};

export default CustomSelect;