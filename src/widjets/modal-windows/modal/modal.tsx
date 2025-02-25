// import React from 'react';
// import cls from './modal.module.scss';
//
// import { ReactComponent as SvgClose } from '../../assets/svg/close.svg';
//
// import VideoCard from '../../feautures/videoCard/videoCard';
// import CustomButton from '../../shared/ui/сustomButton/CustomButton';
// import { useAppSelector } from '../../shared/redux/hooks/hooks';
// import { ReactComponent as SvgSoundOff } from './../../assets/svg/soundOffvg.svg';
// import { ReactComponent as SvgSoundOn } from './../../assets/svg/sounOn.svg';
// import { ReactComponent as SvgGenerationLink } from '../../assets/svg/share.svg';
// import { ReactComponent as SvgReceivePayment } from './../../assets/svg/receivePayment.svg';
// import { ReactComponent as SvgFavourite } from '../../assets/svg/favorites.svg';
// import { ReactComponent as SvgChain } from './../../assets/svg/chainLink.svg';
// import { ForFunc } from '../../entities/others';
// import { useAuthState, useModal, useProfile } from '../../shared/helpers/hooks';
// import { needToAuth } from '../../shared/helpers/functions';
// import IqPumpMainWindow from '../iqPumpService/iqPumpMainWindow';
//
// interface ISliderVideoProps {
//     show: boolean;
// }
//
// const SliderVideo = ({ show }: ISliderVideoProps) => {
//     /** states */
//     const [hideMenu, setHideMenu] = React.useState<boolean>(false);
//     const { profilesForShowing, chosenFavouritesIdReals, chosenServiceId, isOpen, services } = useAppSelector(
//         (state) => state.userProfiles
//     );
//     const { loggedIn } = useAppSelector((state) => state.authSlice);
//
//     const [value, setValue] = React.useState<number>(0);
//     const [showSoundLine, setShowSoundLine] = React.useState<boolean>(false);
//     const [currentSlide, setCurrentSlide] = React.useState(0);
//
//     /** управление модальными окнами*/
//     const { openModal, closeModal } = useModal();
//     /** изменение состояний authSlice*/
//     const updateAuthState = useAuthState();
//     /** изменение состояний profileServiceSlice*/
//     const updateProfileServiceState = useProfile();
//
//     /** для закрытия попапа*/
//     const closeRealsList = () => {
//         closeModal('modalReals');
//     };
//     /** меняем активный слайд*/
//     const handleSlideChange = (swiper) => {
//         setCurrentSlide(swiper.activeIndex);
//     };
//
//     /** Определяем индекс начального слайда когда выбрали из меню конкретный */
//     let initialSlideIndex = 0;
//     if (isOpen === 'service') {
//         initialSlideIndex = profilesForShowing?.findIndex((video) => video.profile_data.id === chosenFavouritesIdReals) || 0;
//     } else if (isOpen === 'reals') {
//         initialSlideIndex = services?.findIndex((service) => service.profile_data.id === chosenServiceId) || 0;
//     }
//
//     const [swiperInstance, setSwiperInstance] = React.useState<any>(null);
//
//     /** Устанавливаем активный слайд при изменении `chosenFavouritesIdReals` */
//     React.useEffect(() => {
//         if (swiperInstance) {
//             const newIndex = profilesForShowing?.findIndex((video) => video.profile_data.id === chosenFavouritesIdReals);
//             if (newIndex !== -1) {
//                 swiperInstance.slideTo(newIndex); // Переключаем слайд
//             }
//         }
//     }, [chosenFavouritesIdReals, swiperInstance]);
//
//     const hideOrShowMenuReals = () => {
//         setHideMenu((prevState) => !prevState);
//     };
//
//     if (!show) return null;
//
//     /** блок функциональных кнопок*/
//     /** Функция отображения попапа stt bonus*/
//     const openModalSttBonus: ForFunc<string, void> = (wallet) => {
//         if (!loggedIn) {
//             needToAuth();
//             return;
//         }
//
//         updateAuthState('erc20FromReals', wallet);
//         closeModal('modalReals');
//         setTimeout(() => {
//             openModal('modalSttBonus');
//         }, 1000);
//     };
//
//     const openModalTransferToTheShop: ForFunc<string, void> = (wallet) => {
//         if (!loggedIn) {
//             needToAuth();
//             return;
//         }
//
//         updateAuthState('donateWalletFromReals', wallet);
//         updateAuthState('transferToTheShop', true);
//         closeModal('modalReals');
//         setTimeout(() => {
//             openModal('modalSendTokens');
//         }, 1000);
//     };
//
//     const addProfileToMyFavourites: ForFunc<string, void> = (wallet) => {
//         if (!loggedIn) {
//             needToAuth();
//             return;
//         }
//     };
//
//     /** изменить значение mlm*/
//     const changeSound: ForFunc<React.ChangeEvent<HTMLInputElement>, void> = (e) => {
//         setValue(+e.target.value);
//     };
//
//     const switchSound = () => {
//         if (value == 0) {
//             setValue(100);
//         }
//         if (value == 100) {
//             setValue(0);
//         }
//     };
//
//     return (
//         <div className={`${cls.overlay} ${show && cls.open}`}>
//             <CustomButton onClick={closeRealsList} classnameWrapper={cls.wrapper_btn} classNameBtn={cls.cover_btn} type='button'>
//                 <SvgClose className={cls.close_svg} />
//             </CustomButton>
//             <Swiper
//                 modules={[Navigation, Mousewheel]} // Подключаем модули
//                 direction={'vertical'}
//                 slidesPerView={1}
//                 spaceBetween={5}
//                 mousewheel={{ forceToAxis: true, sensitivity: 0.5 }}
//                 pagination={{ clickable: true }}
//                 style={{ height: '100vh' }}
//                 className={cls.swiper}
//                 initialSlide={initialSlideIndex}
//                 onSwiper={setSwiperInstance}
//                 touchRatio={1}
//                 simulateTouch={true}
//                 threshold={20}
//                 onSlideChange={handleSlideChange}
//             >
//                             <div className={cls.body}>
//                                 <div className={cls.item_video_cover}>
//                                     {service.profile_data.title === 'iq Pump' && <IqPumpMainWindow />}
//                                     <div className={cls.btn_cover_block}>
//                                         <div className={`${cls.basic} ${hideMenu ? cls.show : cls.hide}`}>
//                                             <CustomButton
//                                                 onClick={() => openModalSttBonus(service?.profile_data?.wallet_number)}
//                                                 type='button'
//                                                 classnameWrapper={cls.wrapperSvg}
//                                                 classNameBtn={``}
//                                             >
//                                                 <SvgChain className={`${cls.svg} ${cls.sizeChain}`} />
//                                             </CustomButton>
//                                             <CustomButton
//                                                 onClick={() => openModalTransferToTheShop(service?.profile_data?.wallet_number)}
//                                                 type='button'
//                                                 classnameWrapper={cls.wrapperSvg}
//                                                 classNameBtn={``}
//                                             >
//                                                 <SvgReceivePayment className={`${cls.svg} ${cls.sizePayment}`} />
//                                             </CustomButton>
//                                             <CustomButton
//                                                 onClick={switchSound}
//                                                 type='button'
//                                                 classnameWrapper={cls.wrapperSvg}
//                                                 classNameBtn={``}
//                                             >
//                                                 <>
//                                                     {value === 0 && <SvgSoundOff className={`${cls.svg} ${cls.sizeSound}`} />}
//                                                     {value === 100 && <SvgSoundOn className={`${cls.svg} ${cls.sizeSound}`} />}
//
//                                                     {showSoundLine && (
//                                                         <div className={cls.wrapper}>
//                                                             <div className={cls.coverLine}>
//                                                                 <div
//                                                                     className={cls.line}
//                                                                     style={{
//                                                                         width: `${+value === 0 ? '0' : `${value}%`}`,
//                                                                     }}
//                                                                 />
//                                                             </div>
//                                                             <input
//                                                                 type='range'
//                                                                 min='0'
//                                                                 max='100'
//                                                                 value={value}
//                                                                 className={cls.input}
//                                                                 onChange={changeSound}
//                                                             />
//                                                         </div>
//                                                     )}
//                                                 </>
//                                             </CustomButton>
//                                             <CustomButton type='button' classnameWrapper={cls.wrapperSvg} classNameBtn={``}>
//                                                 <SvgGenerationLink className={`${cls.svg} ${cls.sizeLink}`} />
//                                             </CustomButton>
//                                             <div className={cls.cover_btn_followers}>
//                                                 <CustomButton
//                                                     onClick={() => addProfileToMyFavourites(service?.profile_data?.wallet_number)}
//                                                     type='button'
//                                                     classnameWrapper={cls.wrapperSvg}
//                                                     classNameBtn={``}
//                                                 >
//                                                     <SvgFavourite className={`${cls.svg} ${cls.sizeFavourite}`} />
//                                                 </CustomButton>
//                                                 <div className={cls.followers}>1000</div>
//                                             </div>
//                                         </div>
//                                         <CustomButton
//                                             onClick={hideOrShowMenuReals}
//                                             type='button'
//                                             classnameWrapper={cls.wrapperSvg}
//                                             classNameBtn={`${cls.svg}`}
//                                         >
//                                             <div className={hideMenu ? cls.expand_icon_show : cls.expand_icon_hide}></div>
//                                         </CustomButton>
//                                     </div>
//                                 </div>
//                             </div>
//                     ))}
//         </div>
//     );
// };
//
// export default SliderVideo;
