import React from "react";
import VideoCallWrapper from "../VideoCallComponent/VideoCallComponent"; // Your component file

const VideoCallPage = () => {
  const roomUrl = "https://virtuehealth.daily.co/VzRpB3BbHCofKKr61rsA"; // Replace with your test room URL

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <VideoCallWrapper roomUrl={roomUrl} />
    </div>
  );
};

export default VideoCallPage;
