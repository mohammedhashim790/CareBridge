interface CloseButtonProps {
    onClick: () => void;
}

const CloseButton = ({ onClick }: CloseButtonProps) => {
    return (
        <button
            className="text-gray-800 text-2xl absolute top-4 right-4 transition-all duration-300 ease-in-out cursor-pointer hover:rotate-90 hover:text-primary focus:outline-none"
            onClick={onClick}
        >
            ×
        </button>
    );
};

export default CloseButton;