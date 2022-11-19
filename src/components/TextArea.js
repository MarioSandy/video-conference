const TextArea = ({
  rows = 4,
  size = "sm",
  placeholder = "",
  touched,
  onChange,
  value,
  error = false,
}) => {
  return (
    <textarea
      className={`
                     bg-gray-50 border text-gray-600 rounded-lg p-2.5 ${
                       "text-" + size
                     } font-medium
                     w-full
                     ${
                       error
                         ? "border-pink-500 focus:border-pink-500 focus:ring-pink-500"
                         : "border-gray-300 focus:ring-1 focus:ring-sky-400 focus:border-sky-400 focus:outline-none"
                     }
                     transition ease-out delay-150 
                 `}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      value={value}
      onBlur={() => touched(true)}
    />
  );
};

export default TextArea;
