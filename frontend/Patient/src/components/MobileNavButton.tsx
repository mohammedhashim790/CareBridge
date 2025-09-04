interface MobileNavButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

const MobileNavButton = ({ onClick, children, className = "" }: MobileNavButtonProps) => {
    return (
        <button
            className={`block w-full text-left text-gray-800 text-lg p-2 hover:bg-gray-100 rounded transition duration-300 ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default MobileNavButton;