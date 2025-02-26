import {LANGUGES_TYPE} from "../../../entities/entities.ts";
import {LANGUAGES} from "../../../../index.const.ts";

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

    classNameBodyList,
                          classNameShowed,
                          classNameOption,
                          onSelect,

                          classNameBlockList

                      }: ICustomSelectProps<LANGUGES_TYPE>) => {

    return (
        <div className={classNameWrapper} onClick={handleOpenMenu}>
            <button className={classNameChosenValue}>
                <img src={LANGUAGES?.find((item) => item.code == chosenValue)?.url} alt={`languge`} className={classNameIcon}/>
            </button>
                <ul className={`${classNameBodyList} ${isOpenMenu && classNameShowed}`}>
                    {options &&
                        options?.length > 0 &&
                        options?.map((option) => (
                            <div key={option?.code} onClick={() => onSelect(option.code)} className={classNameBlockList}>
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
        </div>
    );
};

export default CustomSelect;