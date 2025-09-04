type InputProps = {
  type: string;
  placeholder: string;
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
};

const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      className="w-80 h-10 border border-border rounded-md pl-3 text-sm lg:w-120 lg:h-13"
      type= {props.type}
      placeholder= {props.placeholder}
      value={props.value}
      onChange={props.onChange}
    />
  );
};

export default Input;
