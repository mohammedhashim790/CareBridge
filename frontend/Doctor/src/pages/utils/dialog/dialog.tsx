import React, {type ReactNode, useEffect, useState} from 'react';
import './Dialog.css';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    isBarrierDismissible?: boolean;
    background?: string;
    children: ReactNode;
    fullScreenOnMobile?: boolean;
}

interface DialogOptions {
    template: React.ComponentType<any>;
    params?: {
        isBarrierDismissible?: boolean;
        onClose?: () => void;
        background?: string;
        fullScreenOnMobile?: boolean;
        [key: string]: any;
    };
    componentProps?: any;
}

const Dialog: React.FC<DialogProps> = ({
                                           isOpen,
                                           onClose,
                                           isBarrierDismissible = true,
                                           background = 'rgba(0, 0, 0, 0.5)',
                                           children,
                                           fullScreenOnMobile = true
                                       }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    if (!isOpen) return null;

    const handleBackdropClick = () => {
        if (isBarrierDismissible && !isMobile) {
            onClose();
        }
    };


    const handleMobileClose = () => {
        onClose();
    };

    return (<div
        className={`dialog-container ${isMobile ? 'mobile' : 'desktop'}`}
        style={{
            backgroundColor: isMobile ? 'white' : background,
        }}
        onClick={handleBackdropClick}
    >
        {isMobile && fullScreenOnMobile ? (<div className="mobile-dialog">
            <div className="mobile-dialog-header">
                <button
                    className="mobile-close-btn"
                    onClick={handleMobileClose}
                    aria-label="Close dialog"
                >
                    &times;
                </button>
            </div>
            <div className="mobile-dialog-content">
                {children}
            </div>
        </div>) : (<div
            className="desktop-dialog"
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>)}
    </div>);
};


const DialogContext = React.createContext<{
    showDialog: (options: DialogOptions) => void; closeDialog: () => void;
}>({
    showDialog: () => {
    }, closeDialog: () => {
    },
});

export const DialogProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState<ReactNode>(null);
    const [dialogOptions, setDialogOptions] = useState<{
        isBarrierDismissible?: boolean; onClose?: () => void; background?: string; fullScreenOnMobile?: boolean;
    }>({});

    const showDialog = ({template: Template, params, componentProps}: DialogOptions) => {
        setDialogContent(<Template {...componentProps} />);
        setDialogOptions({
            isBarrierDismissible: params?.isBarrierDismissible,
            onClose: params?.onClose,
            background: params?.background,
            fullScreenOnMobile: params?.fullScreenOnMobile
        });
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
        if (dialogOptions.onClose) {
            dialogOptions.onClose();
        }
    };

    return (<DialogContext.Provider value={{showDialog, closeDialog}}>
        {children}
        <Dialog
            isOpen={isOpen}
            onClose={closeDialog}
            isBarrierDismissible={dialogOptions.isBarrierDismissible}
            background={dialogOptions.background}
            fullScreenOnMobile={dialogOptions.fullScreenOnMobile}
        >
            {dialogContent}
        </Dialog>
    </DialogContext.Provider>);
};

export const useDialog = () => {
    return React.useContext(DialogContext);
};
