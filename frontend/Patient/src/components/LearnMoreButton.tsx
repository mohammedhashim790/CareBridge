interface LearnMoreButtonProps {
    onClick: () => void;
    children?: React.ReactNode;
    className?: string;
}

const LearnMoreButton = ({ onClick, children = "Learn more", className = "" }: LearnMoreButtonProps) => {
    return (
        <button
            className={`text-primary transition-all duration-200 ease-in-out cursor-pointer hover:translate-x-1 hover:text-blue-800 text-left ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default LearnMoreButton;