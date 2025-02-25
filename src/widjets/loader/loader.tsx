import cls from './styled/loader.module.scss';

interface ILoaderProps {
    isLoading: boolean;
    text?:string
}

const Loader = ({
                    isLoading,
                    text
}: ILoaderProps) => {

    if (!isLoading) return null;

    return (
        <div className={`${cls.loaderWrapper} ${text && cls.backgraund}`}>
            <div className={cls.loader}></div>
            <div className={cls.loadingText}>{text}</div>
        </div>
    );
};

export default Loader;
