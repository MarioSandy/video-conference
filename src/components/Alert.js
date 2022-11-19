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
          className="fixed top-0 bottom-0 left-0 right-0 bg-black/50 z-[10] flex items-center justify-center"
          onClick={() => {
            setVisible(false);
          }}
        >
          <div
            className="absolute w-[400px] bg-white rounded-md z-[11] p-5"
            onClick={(e) => {
              preventBubbling(e);
            }}
          >
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
});

export default Alert;
