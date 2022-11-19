import { ReactComponent as VideoSVG } from "../assets/svg/video-svgrepo-com.svg";
import { ReactComponent as AddSVG } from "../assets/svg/add-svgrepo-com.svg";
import Input from "../components/Input";
import { useReducer } from "react";
import useSocket from "../hooks/useSocket";
import { useEffect } from "react";
import Profile from "../components/Profile";
import { useNavigate } from "react-router-dom";

const meetingCodeReducer = (state, action) => {
  switch (action.field) {
    case "meeting_code": {
      return {
        ...state,
        [action.field]: action.value,
      };
    }
    case "error": {
      let prevError = state[action.field];
      prevError[action.sub_field] = true;
      return {
        ...state,
        [action.field]: prevError,
      };
    }
  }
};

const Home = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [meetingCode, meetingCodeDispatch] = useReducer(meetingCodeReducer, {
    meeting_code: "",
    error: {
      not_found: false,
    },
  });
  const onJoinMeeting = () => {
    navigate(`/meeting/${meetingCode.meeting_code}`);
    if (meetingCode.meeting_code.length > 0) {
      meetingCodeDispatch({ field: "meeting_code", value: "" });
    }
  };

  useEffect(() => {
    console.log("home-connect");
    return () => {
      console.log("home-disconnect");
    };
  });
  return (
    <div className="flex flex-col gap-4 h-screen">
      <div className="flex justify-end">
        <Profile />
      </div>
      <div className="flex items-center justify-center grow">
        <div>
          <div className="mb-2">
            <p className="font-medium mb-2">Meeting Code</p>
            <Input
              onChange={(value) => {
                meetingCodeDispatch({ field: "meeting_code", value });
              }}
              value={meetingCode.meeting_code}
              placeholder="Enter meeting code"
              error={meetingCode.error.not_found}
            />
            {meetingCode.error.not_found ? (
              <p className="text-danger text-[#eb0e14] text-sm">
                No meeting found!
              </p>
            ) : null}
          </div>
          <div className="flex gap-10">
            <div
              className={`p-4 flex flex-col items-center gap-3  rounded-lg cursor-pointer ${
                meetingCode.meeting_code.length < 1
                  ? "bg-slate-100 text-slate-500"
                  : "bg-sky-400 text-white"
              }`}
              onClick={() => {
                onJoinMeeting();
              }}
            >
              <VideoSVG
                className="w-[3em] h-[3em]"
                fill={meetingCode.meeting_code.length < 1 ? "#64748b" : "white"}
              />
              <p>Join Meeting</p>
            </div>
            <div
              className="p-4 flex flex-col items-center gap-3 bg-sky-400 rounded-lg cursor-pointer"
              onClick={() => {
                socket.emit("create-meeting");
              }}
            >
              <AddSVG className="w-[3em] h-[3em]" fill="white" />
              <p className="text-white">Create Meeting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
