import { useEffect } from "react";
import { useRef } from "react";

const Video = ({ stream, muted = "muted" }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (stream !== undefined) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return <video ref={videoRef} autoPlay muted={muted} className="rounded-lg" />;
};

export default Video;
