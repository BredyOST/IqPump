import { toast } from 'react-toastify';

export const showAttention = (message: string, indicator: 'error' | 'success' | 'warning' | 'info'): void => {
    if (indicator === 'error') {
        const notify = () => toast.error(message);
        notify();
    }
    if (indicator === 'success') {
        const notify = () => toast.success(message);
        notify();
    }

    if (indicator === 'warning') {
        const notify = () => toast.warning(message);
        notify();
    }
};
