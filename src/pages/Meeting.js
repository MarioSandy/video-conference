import { useEffect } from "react";
import useSocket from "../hooks/useSocket";
import { useParams } from "react-router-dom";
import useMeeting from "../hooks/useMeeting";
import Video from "../components/Video";
import VideoSettingButtons from "../components/meeting/VideoSettingButtons";
import Chat from "../components/meeting/Chat";
import useAuth from "../hooks/useAuth";
import UserVideoInfoDisplay from "../components/meeting/UserVideoInfoDisplay";

const Meeting = () => {
  const { auth } = useAuth();
  const { socket, me } = useSocket();
  const {
    stream,
    participants,
    participantsDispatch,
    changeVideoSetting,
    shareScreenPeerId,
    videoSetting,
    videoSettingDispatch,
  } = useMeeting();
  const { id: meetingId } = useParams();

  useEffect(() => {
    socket.emit("join-meeting", {
      meeting_id: meetingId,
      peer_id: me._id,
      username: auth.username,
      video_setting: videoSetting,
    });

    return () => {
      socket.emit("leave-meeting", { meeting_id: meetingId, peer_id: me._id });
    };
  }, []);

  const onChangeVideoSetting = (changedVideoSetting) => {
    if (
      changeVideoSetting === "share_screen" &&
      (Object.keys(shareScreenPeerId).length < 1 ||
        shareScreenPeerId.peer_id !== me._id)
    )
      return;
    participantsDispatch({
      type: "change_video_setting",
      peer_id: me._id,
      changed: changedVideoSetting,
      value: {
        ...videoSetting,
        [changedVideoSetting]: !videoSetting[changedVideoSetting],
      },
    });
    videoSettingDispatch({
      changed_video_setting: changedVideoSetting,
    });
    changeVideoSetting(changedVideoSetting, {
      ...videoSetting,
      [changedVideoSetting]: !videoSetting[changedVideoSetting],
    });

    if (Object.keys(shareScreenPeerId).length > 0) {
      if (shareScreenPeerId.peer_id !== me._id) {
        socket.emit("start-share-screen", {
          meeting_id: meetingId,
          peer_id: me._id,
        });
      } else {
        socket.emit("stop-share-screen", {
          meeting_id: meetingId,
          peer_id: me._id,
        });
      }
    }
  };

  return (
    <div className="h-screen bg-slate-800 flex flex-wrap items-stretch">
      <div className="grid grid-cols-8 w-full">
        <div className="col-span-6 flex flex-col flex-wrap items-stretch">
          {shareScreenPeerId.length > 0 ? (
            <div className="grow w-full aspect-video flex justify-center rounded-full">
              <Video
                stream={
                  shareScreenPeerId === me._id
                    ? stream
                    : participants.find((i) => i.peer_id === shareScreenPeerId)
                        .stream
                }
              />
            </div>
          ) : null}
          <div
            className={`gap-2 items-center ${
              shareScreenPeerId.length > 0
                ? "flex"
                : participants.length === 0
                ? "grow grid grid-cols-1"
                : participants.length > 0 && participants.length <= 3
                ? "grow grid grid-cols-2"
                : participants.length > 3 && participants.length <= 8
                ? "grow grid grid-cols-3"
                : participants.length > 8
                ? "grow grid grid-cols-4"
                : "grow grid grid-cols-1"
            }`}
          >
            {shareScreenPeerId}
            {videoSetting.camera && stream !== undefined ? (
              <div className="relative aspect-video w-full p-4 flex flex-wrap justify-center">
                <Video stream={stream} />
                <UserVideoInfoDisplay
                  userVideoInfo={{
                    username: auth.username,
                    video_setting: videoSetting,
                  }}
                />
              </div>
            ) : (
              <div className="relative aspect-video w-full p-4 flex flex-wrap justify-center items-center">
                {/* <div className="rounded-full bg-white h-[45%] aspect-square" /> */}
                <img
                  src={auth.profile_picture}
                  className="rounded-full aspect-square object-contain"
                />
                <UserVideoInfoDisplay
                  userVideoInfo={{
                    username: auth.username,
                    video_setting: videoSetting,
                  }}
                />
              </div>
            )}

            {participants.map((participant) => (
              <>
                {participant.video_setting.camera ? (
                  <div className="relative aspect-video w-full p-4 flex flex-wrap justify-center">
                    <Video stream={participant.stream} />
                    <UserVideoInfoDisplay userVideoInfo={participant} />
                  </div>
                ) : (
                  <div className="relative aspect-video w-full p-4 flex flex-wrap justify-center items-center">
                    <img
                      src={participant.profile_picture}
                      className="rounded-full aspect-square object-contain"
                    />
                    <UserVideoInfoDisplay userVideoInfo={participant} />
                  </div>
                )}
              </>
            ))}
          </div>
          <div className="flex bg-slate-700 py-4 relative">
            <VideoSettingButtons
              clicked={(videoSettingsClicked) =>
                onChangeVideoSetting(videoSettingsClicked)
              }
            />
          </div>
        </div>
        <div className="col-span-2 bg-white h-screen">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default Meeting;
