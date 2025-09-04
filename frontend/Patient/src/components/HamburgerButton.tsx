interface HamburgerButtonProps {
    onClick: () => void;
}

const HamburgerButton = ({ onClick }: HamburgerButtonProps) => {
    return (
        <button
            className="text-4xl p-3 leading-none transition-all duration-300 ease-in-out cursor-pointer hover:scale-110 hover:text-secondary focus:outline-none lg:hidden"
            onClick={onClick}
        >
            ≡
        </button>
    );
};

export default HamburgerButton;