interface DesktopNavButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}

const DesktopNavButton = ({ onClick, children }: DesktopNavButtonProps) => {
    return (
        <button
            className="text-white text-lg px-6 py-2 transition-all duration-300 ease-in-out cursor-pointer hover:bg-white/10 hover:-translate-y-0.5 hover:text-secondary"
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default DesktopNavButton;