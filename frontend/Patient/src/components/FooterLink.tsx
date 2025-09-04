interface FooterLinkProps {
    href?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

const FooterLink = ({ href = "#", children, onClick }: FooterLinkProps) => {
    return (
        <p className="text-secondary text-base transition-colors duration-300 cursor-pointer hover:text-white">
            <a href={href} onClick={onClick}>
                {children}
            </a>
        </p>
    );
};

export default FooterLink;