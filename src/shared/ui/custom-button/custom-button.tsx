import React  from 'react';

interface ICustomButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    type: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    children?: React.ReactNode;
    classnameWrapper?: string;
    classNameBtn?: string;
}

const CustomButton = ({ type, onClick, children, classnameWrapper, classNameBtn }: ICustomButtonProps) => {


    return (
        <label className={classnameWrapper}>
            <button className={classNameBtn} type={type} onClick={onClick}>
                {children}
            </button>
        </label>
    );

};

export default CustomButton;
