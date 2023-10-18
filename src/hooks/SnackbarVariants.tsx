import { useSnackbar, SnackbarMessage } from 'notistack';

export const useSnackbarVariants = () => {

    const { enqueueSnackbar } = useSnackbar();
    
    const pushNotice = (message: SnackbarMessage, variant: any) => {
        enqueueSnackbar(message, { variant });
    };
    
    const success = ( message: SnackbarMessage ) => pushNotice(message, 'success');
    const error = ( message: SnackbarMessage ) => pushNotice(message, 'error');
    const warning = ( message: SnackbarMessage ) => pushNotice(message, 'warning');
    const info = ( message: SnackbarMessage ) => pushNotice(message, 'info');
    
    return ({
        success,
        error,
        warning,
        info
    });
};