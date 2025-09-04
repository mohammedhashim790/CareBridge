type ButtonProps = {
  title: string;
  onClick: () => void;
  loading: boolean;
};

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <div
      onClick={props.onClick}
      className="w-80 h-12 bg-primary hover:bg-hover active:bg-active flex justify-center items-center rounded-lg shadow-md mb-2 lg:w-120 lg:h-15"
    >
      {props.loading ? (
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <p className="text-white tracking-wider text-center">{props.title}</p>
      )}
    </div>
  );
};
export default Button;
