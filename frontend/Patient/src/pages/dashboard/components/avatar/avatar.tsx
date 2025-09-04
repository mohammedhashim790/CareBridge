type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export const Avatar: React.FC<AvatarProps> = ({ className, children, ...props }) => (
  <div
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className || ""}`}
    {...props}
  >
    {children}
  </div>
);

type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  className?: string;
};

export const AvatarImage: React.FC<AvatarImageProps> = ({ className, src, alt, ...props }) => (
  <img
    className={`aspect-square h-full w-full object-cover ${className || ""}`}
    src={src}
    alt={alt}
    {...props}
  />
);

type AvatarFallbackProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ className, children, style, ...props }) => (
  <div
    className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600 ${className || ""}`}
    style={style}
    {...props}
  >
    {children}
  </div>
);