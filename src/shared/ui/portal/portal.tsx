import { createPortal } from 'react-dom';

interface IPortal {
    children: React.ReactElement;
    whereToAdd: HTMLElement;
}

const Portal = ({ children, whereToAdd = document.body }: IPortal) => {
    return createPortal(children, whereToAdd);
};

export default Portal;
