import { ReactComponent as UnmuteSVG } from "../../assets/svg/mic-svgrepo-com.svg";
import { ReactComponent as MuteSVG } from "../../assets/svg/mic-off-svgrepo-com.svg";
import { ReactComponent as VideoSVG } from "../../assets/svg/video-svgrepo-com.svg";
import { ReactComponent as VideoOffSVG } from "../../assets/svg/video-off-svgrepo-com.svg";
import { ReactComponent as SharescreenSVG } from "../../assets/svg/share-screen-svgrepo-com.svg";
import { ReactComponent as RaiseHandSVG } from "../../assets/svg/hand-raise-svgrepo-com.svg";
import { ReactComponent as EndCallSVG } from "../../assets/svg/call-3-svgrepo-com.svg";
import { useNavigate, useParams } from "react-router-dom";
import useMeeting from "../../hooks/useMeeting";

const VideoSettingButtons = ({ clicked }) => {
  const { id: meetingId } = useParams();
  const navigate = useNavigate();
  const { videoSetting } = useMeeting();

  return (
    <>
      <div className="flex w-full justify-center gap-4">
        <div
          className="p-3 rounded-full bg-slate-500 cursor-pointer"
          onClick={() => {
            clicked("sound");
          }}
        >
          {videoSetting.sound ? (
            <UnmuteSVG className="w-[1.5em] h-[1.5em]" fill="#cbd5e1" />
          ) : (
            <MuteSVG className="w-[1.5em] h-[1.5em]" fill="#cbd5e1" />
          )}
        </div>
        <div
          className="p-3 rounded-full bg-slate-500 cursor-pointer"
          onClick={() => {
            clicked("camera");
          }}
        >
          {videoSetting.camera ? (
            <VideoSVG className="w-[1.5em] h-[1.5em]" fill="#cbd5e1" />
          ) : (
            <VideoOffSVG className="w-[1.5em] h-[1.5em]" fill="#cbd5e1" />
          )}
        </div>
        <div
          className="p-3 rounded-full bg-slate-500 cursor-pointer"
          onClick={() => {
            clicked("share_screen");
          }}
        >
          <SharescreenSVG className="w-[1.5em] h-[1.5em]" />
        </div>
        <div
          className="p-3 rounded-full bg-slate-500 cursor-pointer"
          onClick={() => {
            clicked("raise_hand");
          }}
        >
          <RaiseHandSVG className="w-[1.5em] h-[1.5em]" />
        </div>
        <div
          className="p-3 rounded-full bg-red-500 cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          <EndCallSVG className="w-[1.5em] h-[1.5em]" />
        </div>
      </div>
      <div
        className="p-3 rounded-full bg-white cursor-pointer flex items-center absolute right-5"
        onClick={() => {
          navigator.clipboard.writeText(meetingId);
        }}
      >
        <p className="text-sm text-slate-500 font-semibold">Copy Room Id</p>
      </div>
    </>
  );
};

export default VideoSettingButtons;
