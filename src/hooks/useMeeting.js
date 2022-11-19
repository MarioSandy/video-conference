import { useContext } from "react";
import MeetingContext from "../context/MeetingProvider";

const useMeeting = () => {
  return useContext(MeetingContext);
};

export default useMeeting;
