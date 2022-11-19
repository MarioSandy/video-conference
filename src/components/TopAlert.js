import { forwardRef, useImperativeHandle, useState } from "react";

const Alert = forwardRef(({ children }, ref) => {
  const [visible, setVisible] = useState(false);
  useImperativeHandle(ref, () => ({
    showAlert() {
      setVisible(true);
    },
    hideAlert() {
      setVisible(false);
    },
  }));
  const preventBubbling = (e) => {
    e.stopPropagation();
  };
  return (
    <>
      {visible ? (
        <div
          className="absolute top-5 w-[400px] bg-white rounded-md z-[10] p-5"
          onClick={(e) => {
            preventBubbling(e);
          }}
        >
          {children}
        </div>
      ) : null}
    </>
  );
});

export default Alert;
