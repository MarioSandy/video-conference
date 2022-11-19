import Peer from "peerjs";
import { createContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { v4 as uuidV4 } from "uuid";

const SocketContext = createContext({});

export const SocketProvider = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState();
  const [me, setMe] = useState();

  useEffect(() => {
    const s = io(process.env.REACT_APP_SERVER_URL);
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket !== undefined) {
      const peer = new Peer(uuidV4());
      setMe(peer);
      socket.on("meeting-created", redirectRoom);
      console.log("socket-provider-connect");
      return () => {
        console.log("socket-provider-disconnected");
        socket.off("meeting-created", redirectRoom);
      };
    }
  }, [socket]);

  const redirectRoom = (meetingId) => {
    navigate(`/meeting/${meetingId}`);
  };

  return (
    <SocketContext.Provider value={{ socket, me }}>
      {socket !== undefined && me !== undefined ? <Outlet /> : null}
    </SocketContext.Provider>
  );
};

export default SocketContext;
