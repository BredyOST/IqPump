import React, { HTMLAttributes } from 'react';

interface ICustomInputProps extends HTMLAttributes<HTMLInputElement> {
    type: 'text' | 'password';
    placeholder: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    classNameWrapper?: string;
    classNameInput?: string;
    inAppSelector?: boolean;
    disable?: boolean;
    onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showLength?: true;
}

const CustomInput = ({
    type = 'text',
    placeholder,
    value,
    onChange,
    disable,
    onBlur,
    classNameWrapper,
    classNameInput,
}: ICustomInputProps) => {


    return (
        <div className={classNameWrapper}>
            <input
                className={classNameInput}
                placeholder={placeholder}
                type={type}
                onBlur={onBlur}
                value={value}
                onChange={onChange && onChange}
                disabled={disable}
            />
        </div>
    );

    return null;
};

export default CustomInput;
