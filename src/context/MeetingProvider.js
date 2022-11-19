import { createContext } from "react";
import { useState } from "react";
import { useReducer } from "react";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useSocket from "../hooks/useSocket";

const MeetingContext = createContext({});

const participantsReducer = (state, action) => {
  switch (action.type) {
    case "join_meeting": {
      if (
        !state.find(
          (participant) => participant.peer_id === action.value.peer_id
        )
      ) {
        return [...state, action.value];
      }
      return state;
    }
    case "set_stream": {
      let streamSet = state.map((s) => {
        return {
          ...s,
          stream:
            s.peer_id === action.value.peer_id ? action.value.stream : s.stream,
        };
      });
      return streamSet;
    }
    case "change_video_setting": {
      let prevParticipants = state;
      prevParticipants = prevParticipants.map((participant) => {
        console.log(participant.peer_id);
        console.log(action.peer_id);
        return {
          ...participant,
          video_setting:
            participant.peer_id === action.peer_id
              ? action.value
              : participant.video_setting,
        };
      });
      return prevParticipants;
    }
    case "leave_meeting": {
      return state.filter(
        (participant) => participant.peer_id !== action.value
      );
    }
  }
};

const videoSettingReducer = (state, action) => {
  return {
    ...state,
    [action.changed_video_setting]: !state[action.changed_video_setting],
  };
};

export const MeetingProvider = () => {
  const { id: meetingId } = useParams();
  const { auth } = useAuth();
  const { socket, me } = useSocket();
  const [stream, setStream] = useState();
  const [shareScreenPeerId, setShareScreenPeerId] = useState("");
  const [participants, participantsDispatch] = useReducer(
    participantsReducer,
    []
  );
  const [videoSetting, videoSettingDispatch] = useReducer(videoSettingReducer, {
    sound: true,
    camera: true,
    share_screen: false,
    raise_hand: false,
  });

  useEffect(() => {
    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.error(error);
    }
    socket.on("get-meeting-participants", getMeetingParticipants);
    socket.on("disconnected-participant", participantDisconnected);
    socket.on(
      "participant-change-video-setting",
      participantChangeVideoSetting
    );
    socket.on("start-share-screen-participant", startShareScreenParticipant);
    socket.on("stop-share-screen-participant", stopShareScreenParticipant);
    return () => {
      socket.off("get-meeting-participants", getMeetingParticipants);
      socket.off("disconnected-participant", participantDisconnected);
      socket.off(
        "participant-change-video-setting",
        participantChangeVideoSetting
      );
      socket.off("start-share-screen-participant", startShareScreenParticipant);
      socket.off("stop-share-screen-participant", stopShareScreenParticipant);
      // if (socket !== undefined) {
      //   setStream((prev) => {
      //     let prevStream = prev;
      //     prevStream.getTracks().forEach((track) => {
      //       track.stop();
      //     });
      //     return prevStream;
      //   });
      // }
    };
  }, []);

  useEffect(() => {
    const userJoined = (peerId) => {
      const call = me.call(peerId, stream, {
        metadata: {
          username: auth.username,
          video_setting: videoSetting,
          profile_picture: auth.profile_picture,
        },
      });
      call.on("stream", (peerStream) => {
        participantsDispatch({
          type: "join_meeting",
          value: {
            peer_id: peerId,
            username: auth.username,
            video_setting: videoSetting,
            stream: peerStream,
            profile_picture: auth.profile_picture,
          },
        });
      });
    };
    if (me !== undefined && stream !== undefined) {
      socket.on("user-joined", userJoined);
      me.on("call", (call) => {
        call.answer(stream);
        call.on("stream", (peerStream) => {
          console.log(call.metadata);
          participantsDispatch({
            type: "join_meeting",
            value: {
              peer_id: call.peer,
              username: call.metadata.username,
              video_setting: call.metadata.video_setting,
              stream: peerStream,
              profile_picture: call.metadata.profile_picture,
            },
          });
        });
      });
    }
    return () => {
      socket.off("user-joined", userJoined);
    };
  }, [me, videoSetting, stream]);

  const getMeetingParticipants = (roomInfo) => {
    console.log(roomInfo);
  };

  const startShareScreenParticipant = (peerId) => {
    setShareScreenPeerId(peerId);
  };

  const stopShareScreenParticipant = () => {
    setShareScreenPeerId("");
  };

  const participantDisconnected = (peerId) => {
    participantsDispatch({
      type: "leave_meeting",
      value: peerId,
    });
  };

  const participantChangeVideoSetting = ({ peer_id, video_setting }) => {
    participantsDispatch({
      type: "change_video_setting",
      peer_id,
      value: {
        ...video_setting,
      },
    });
  };

  const changeVideoSetting = (changed, setting) => {
    let switchCaseCorrect = true;
    switch (changed) {
      case "sound": {
        let prevStream = stream;
        stream
          .getAudioTracks()
          .forEach((track) => (track.enabled = !track.enabled));
        setStream((prev) => {
          return prevStream;
        });
        Object.values(me?.connections).forEach((connection) => {
          const audioTrack = prevStream
            ?.getTracks()
            .find((track) => track.kind === "audio");
          connection[0].peerConnection
            .getSenders()[0]
            .replaceTrack(audioTrack)
            .catch((err) => console.error(err));
        });
        break;
      }
      case "camera": {
        if (setting.camera) {
          try {
            navigator.mediaDevices
              .getUserMedia({ video: true, audio: true })
              .then((stream) => {
                stream
                  .getAudioTracks()
                  .forEach((track) => (track.enabled = setting.sound));
                setStream(stream);
                Object.values(me?.connections).forEach((connection) => {
                  const videoTrack = stream
                    ?.getTracks()
                    .find((track) => track.kind === "video");
                  console.log(videoTrack);
                  connection[0].peerConnection
                    .getSenders()[1]
                    .replaceTrack(videoTrack)
                    .catch((err) => console.error(err));
                });
              });
          } catch (err) {
            console.error(err);
          }
        } else {
          let prevStream = stream;
          prevStream
            .getVideoTracks()
            .forEach((track) => (track.enabled = !track.enabled));
          setStream((prev) => {
            return prevStream;
          });
          Object.values(me?.connections).forEach((connection) => {
            const videoTrack = prevStream
              ?.getTracks()
              .find((track) => track.kind === "video");
            connection[0].peerConnection
              .getSenders()[1]
              .replaceTrack(videoTrack)
              .catch((err) => console.error(err));
          });
        }
        break;
      }
      case "share_screen": {
        if (setting.share_screen) {
          navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
            setStream(stream);
            Object.values(me?.connections).forEach((connection) => {
              const videoTrack = stream
                ?.getTracks()
                .find((track) => track.kind === "video");
              connection[0].peerConnection
                .getSenders()[1]
                .replaceTrack(videoTrack)
                .catch((err) => console.error(err));
            });
          });
          setShareScreenPeerId(me._id);
          socket.emit("start-share-screen", {
            meeting_id: meetingId,
            peer_id: me._id,
          });
        } else {
          try {
            navigator.mediaDevices
              .getUserMedia({ video: true, audio: true })
              .then((stream) => {
                stream
                  .getAudioTracks()
                  .forEach((track) => (track.enabled = setting.sound));
                setStream(stream);
                Object.values(me?.connections).forEach((connection) => {
                  const videoTrack = stream
                    ?.getTracks()
                    .find((track) => track.kind === "video");
                  connection[0].peerConnection
                    .getSenders()[1]
                    .replaceTrack(videoTrack)
                    .catch((err) => console.error(err));
                });
              });
            setShareScreenPeerId("");
            socket.emit("stop-share-screen", {
              meeting_id: meetingId,
              peer_id: me._id,
            });
          } catch (err) {
            console.error(err);
          }
        }
        break;
      }
      default: {
        if (changed !== "raise_hand") switchCaseCorrect = false;
        break;
      }
    }
    if (switchCaseCorrect) {
      socket.emit("change-video-setting", {
        meeting_id: meetingId,
        peer_id: me._id,
        video_setting: setting,
      });
    }
  };
  return (
    <MeetingContext.Provider
      value={{
        stream,
        participants,
        participantsDispatch,
        changeVideoSetting,
        shareScreenPeerId,
        videoSetting,
        videoSettingDispatch,
      }}
    >
      {stream !== undefined ? <Outlet /> : null}
    </MeetingContext.Provider>
  );
};

export default MeetingContext;
