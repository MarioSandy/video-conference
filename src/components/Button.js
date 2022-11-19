import { BeatLoader } from "react-spinners";

const Button = ({
  children,
  className = "",
  bgColor = "bg-sky-400",
  size = "md",
  block = false,
  loading = false,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      className={`
                    rounded-lg py-2 px-4 ${bgColor} text-white font-medium
                    text-${size} 
                    disabled:bg-slate-100 disabled:text-slate-500
                    focus:ring-4 focus:ring-sky-300
                    ${block ? "w-full" : ""}
                    ${className}
                `}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <BeatLoader size="0.5em" color="gray" /> : children}
    </button>
  );
};

export default Button;
