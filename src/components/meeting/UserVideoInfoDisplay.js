import { ReactComponent as UnmuteSVG } from "../../assets/svg/mic-svgrepo-com.svg";
import { ReactComponent as MuteSVG } from "../../assets/svg/mic-off-svgrepo-com.svg";
import { ReactComponent as VideoSVG } from "../../assets/svg/video-svgrepo-com.svg";
import { ReactComponent as VideoOffSVG } from "../../assets/svg/video-off-svgrepo-com.svg";
import { ReactComponent as RaiseHandColorSVG } from "../../assets/svg/hand-raise-color-svgrepo-com.svg";

const UserVideoInfoDisplay = ({ userVideoInfo }) => {
  return (
    <>
      {userVideoInfo.video_setting.raise_hand ? (
        <RaiseHandColorSVG className="w-[2em] h-[2em] absolute top-0 right-0" />
      ) : null}
      <div className="flex items-center absolute left-0 bottom-0 pl-6 pb-4 gap-2">
        <div className="p-1 rounded-full bg-slate-500">
          {userVideoInfo.video_setting.sound ? (
            <UnmuteSVG className="w-[1em] h-[1em]" fill="#cbd5e1" />
          ) : (
            <MuteSVG className="w-[1em] h-[1em]" fill="#cbd5e1" />
          )}
        </div>
        <div className="p-1 rounded-full bg-slate-500 mr-1">
          {userVideoInfo.video_setting.camera ? (
            <VideoSVG className="w-[1em] h-[1em]" fill="#cbd5e1" />
          ) : (
            <VideoOffSVG className="w-[1em] h-[1em]" fill="#cbd5e1" />
          )}
        </div>
        <p className="text-md text-white">{userVideoInfo.username}</p>
      </div>
    </>
  );
};

export default UserVideoInfoDisplay;
