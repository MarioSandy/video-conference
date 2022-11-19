import { forwardRef } from "react";
import Button from "../Button";

const AskToJoinTopAlert = forwardRef(({}, ref) => {
  useImperativeHandle(ref, () => ({
    showAlert() {
      alertRef.current.showAlert();
    },
  }));
  return (
    <TopAlert>
      <p>Someone wants to join this meeting</p>
      <div className="flex items-center">
        <div className="w-5 aspect-square rounded-full" />
        <p>Dan Smith</p>
      </div>
      <div className="flex gap-3 justify-end">
        <Button>Deny entry</Button>
        <Button>Admit</Button>
      </div>
    </TopAlert>
  );
});

export default AskToJoinTopAlert;
