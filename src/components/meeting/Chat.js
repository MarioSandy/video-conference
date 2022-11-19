import { useState } from "react";
import { ReactComponent as SendSVG } from "../../assets/svg/send-svgrepo-com.svg";
import TextArea from "../../components/TextArea";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import useSocket from "../../hooks/useSocket";
import { useEffect } from "react";
import { parseTime } from "../../function/parseTime";

const Chat = () => {
  const { id: meetingId } = useParams();
  const { auth } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (socket !== undefined) {
      socket.on("get-message", getMessage);
    }
    return () => {
      socket.off("get-message", getMessage);
    };
  }, [socket]);

  const onSendMessage = () => {
    const time = parseTime(new Date());
    if (typed !== "") {
      setMessages((prev) => {
        return [
          ...prev,
          {
            sender: "me",
            username: auth.username,
            profile_picture: auth.profile_picture,
            message: typed,
            time,
          },
        ];
      });
      socket.emit("send-message", {
        meeting_id: meetingId,
        message: {
          sender: "other",
          username: auth.username,
          profile_picture: auth.profile_picture,
          message: typed,
          time,
        },
      });
      setTyped("");
    }
  };

  const getMessage = (message) => {
    setMessages((prev) => {
      return [...prev, message];
    });
  };

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className="flex flex-col divide-y h-full">
      <div className="p-3">
        <p className="font-semibold">Chat</p>
      </div>
      <div className="p-3 h-full overflow-y-hidden">
        {messages.map((message) => {
          if (message.sender === "me") {
            return (
              <div className="p-2 bg-slate-500 rounded-lg max-w-[60%] ml-auto mb-2">
                <p className="text-slate-300">{message.message}</p>
                <p className="text-xs text-slate-400">{message.time}</p>
              </div>
            );
          } else if (message.sender === "other") {
            return (
              <div className="max-w-[60%] w-full mb-2">
                <div className="flex gap-2 items-start w-fit min-h-0">
                  {/* <div className="p-2 rounded-full bg-slate-500 w-[1.5em] aspect-square" />
                   */}
                  <img
                    src={message.profile_picture}
                    className="rounded-full w-[1.5em] aspect-square border-2 border-slate-500"
                  ></img>
                  <div className="w-full">
                    <p className="text-sm mb-2">{message.username}</p>
                    <div className="p-2 bg-slate-500 rounded-lg w-full">
                      <p className="text-slate-300">{message.message}</p>
                      <p className="text-xs text-slate-400">{message.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
      <div className="p-3 flex items-center gap-3">
        <TextArea
          placeholder="Enter a message"
          rows={2}
          onChange={(value) => {
            setTyped(value);
          }}
          value={typed}
        />
        <div
          className="p-2 rounded-full bg-slate-500"
          onClick={() => {
            onSendMessage();
          }}
        >
          <SendSVG className="w-[1em] h-[1em]" />
        </div>
      </div>
    </div>
  );
};

export default Chat;
