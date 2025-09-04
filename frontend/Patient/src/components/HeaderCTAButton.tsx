interface HeaderCTAButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

const HeaderCTAButton = ({ onClick, children, className = "" }: HeaderCTAButtonProps) => {
    return (
        <button
            className={`bg-white text-primary px-2 py-1 text-sm lg:px-4 lg:py-2 lg:text-lg rounded-lg shadow-lg transition-all duration-300 ease-in-out cursor-pointer hover:bg-gray-50 hover:scale-105 ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default HeaderCTAButton;