import { useReducer } from "react";
import { ReactComponent as UnmuteSVG } from "../assets/svg/mic-svgrepo-com.svg";
import { ReactComponent as MuteSVG } from "../assets/svg/mic-off-svgrepo-com.svg";
import { ReactComponent as VideoSVG } from "../assets/svg/video-svgrepo-com.svg";
import { ReactComponent as VideoOffSVG } from "../assets/svg/video-off-svgrepo-com.svg";
import { ReactComponent as SharescreenSVG } from "../assets/svg/share-screen-svgrepo-com.svg";
import Button from "../components/Button";

const videoSettingReducer = (state, action) => {
  return {
    ...state,
    [action.changed_video_setting]: !state[action.changed_video_setting],
  };
};

const WaitingRoom = () => {
  const [videoSetting, videoSettingDispatch] = useReducer(videoSettingReducer, {
    sound: false,
    camera: false,
    share_screen: false,
    raise_hand: false,
  });
  return (
    <div className="h-screen flex items-center justify-center px-10">
      <div className="flex items-center w-full gap-5">
        <div className="w-[65%]">
          <div className="w-full aspect-video bg-slate-500 rounded-lg relative flex justify-center items-center">
            <div className="rounded-full bg-white h-[45%] aspect-square" />
            <div className="flex justify-center gap-4 absolute bottom-3 left-0 right-0">
              <div
                className="p-3 rounded-full bg-slate-700"
                onClick={() => {
                  videoSettingDispatch({ changed_video_setting: "sound" });
                }}
              >
                {videoSetting.sound ? (
                  <UnmuteSVG className="w-[1.5em] h-[1.5em]" fill="#cbd5e1" />
                ) : (
                  <MuteSVG className="w-[1.5em] h-[1.5em]" fill="#cbd5e1" />
                )}
              </div>
              <div
                className="p-3 rounded-full bg-slate-700"
                onClick={() => {
                  videoSettingDispatch({ changed_video_setting: "camera" });
                }}
              >
                {videoSetting.camera ? (
                  <VideoSVG className="w-[1.5em] h-[1.5em]" fill="#cbd5e1" />
                ) : (
                  <VideoOffSVG className="w-[1.5em] h-[1.5em]" fill="#cbd5e1" />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-[35%]">
          <div className="flex flex-col items-center">
            <p className="text-2xl font-semibold mb-5">Ready to join?</p>
            <div className="flex gap-3">
              <Button>Ask to join</Button>
              <Button>Present</Button>
            </div>
            <p></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
