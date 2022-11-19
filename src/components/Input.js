const Input = ({
  size = "sm",
  placeholder = "",
  className = "",
  value,
  maxLength,
  onFocus,
  onChange,
  error = false,
  touched,
}) => {
  return (
    <input
      type="text"
      className={`
                   bg-gray-50 border text-gray-600 rounded-lg p-2.5 ${
                     "text-" + size
                   } font-medium
                   w-full
                   transition ease-out delay-150 
                   ${className}
                   ${
                     error
                       ? "border-pink-500 focus:border-pink-500 focus:ring-pink-500"
                       : "border-gray-300 focus:ring-1 focus:ring-sky-400 focus:border-sky-400 focus:outline-none"
                   }
                   disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
               `}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => {
        onFocus();
      }}
      onBlur={() => touched(true)}
      value={value}
      placeholder={placeholder}
    />
  );
};

export default Input;
