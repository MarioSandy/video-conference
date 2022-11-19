const Checkbox = ({ label = null, checked = false, value, onChange }) => {
  return (
    <div className="flex items-center">
      <input
        id="checkbox"
        type="checkbox"
        className="
                        w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 
                        focus:ring-blue-500 focus:ring-2
                   "
        onChange={(e) => onChange(e)}
        value={value}
        {...(checked && { checked: true })}
      />
      <label
        htmlFor="checkbox"
        className="ml-2 text-sm font-medium text-gray-900"
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
