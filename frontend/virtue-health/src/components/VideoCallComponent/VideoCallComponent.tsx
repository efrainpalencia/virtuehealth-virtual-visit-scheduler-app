import React, { useEffect } from "react";
import {
  DailyProvider,
  useDaily,
  useLocalSessionId,
} from "@daily-co/daily-react";

interface VideoCallComponentProps {
  roomUrl: string; // The Daily room URL
}

const VideoCallComponent: React.FC<VideoCallComponentProps> = ({ roomUrl }) => {
  const daily = useDaily();
  const localSessionId = useLocalSessionId(); // Get the local session ID

  // Join the call when the component mounts
  useEffect(() => {
    if (daily) {
      daily.join({ url: roomUrl });
    }
    return () => {
      if (daily) {
        daily.leave();
      }
    };
  }, [daily, roomUrl]);

  // Get all participants (local and remote)
  const participants = daily?.participants();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <h2>Video Call</h2>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {/* Render participants */}
        {participants &&
          Object.values(participants).map((participant: any) => (
            <video
              key={participant.session_id}
              autoPlay
              muted={participant.session_id === localSessionId} // Mute the local participant's audio
              ref={(ref) => {
                if (ref && participant.videoTrack) {
                  const mediaStream = new MediaStream([participant.videoTrack]);
                  ref.srcObject = mediaStream;
                  ref.play();
                }
              }}
              style={{
                width: "200px",
                height: "150px",
                margin: "10px",
                background: "black",
              }}
            />
          ))}
      </div>
    </div>
  );
};

// Wrap the VideoCallComponent with DailyProvider
const VideoCallWrapper: React.FC<VideoCallComponentProps> = ({ roomUrl }) => (
  <DailyProvider>
    <VideoCallComponent roomUrl={roomUrl} />
  </DailyProvider>
);

export default VideoCallWrapper;
