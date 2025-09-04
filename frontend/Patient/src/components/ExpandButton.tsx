interface ExpandButtonProps {
    onClick: () => void;
    isExpanded?: boolean;
}

const ExpandButton = ({ onClick, isExpanded = false }: ExpandButtonProps) => {
    return (
        <button
            className="absolute top-2 right-2 text-gray-500 text-xl transition-all duration-300 ease-in-out cursor-pointer hover:scale-120 hover:text-primary focus:outline-none"
            onClick={onClick}
        >
            {isExpanded ? '−' : '+'}
        </button>
    );
};

export default ExpandButton;