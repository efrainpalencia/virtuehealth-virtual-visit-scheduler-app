import React, { useEffect, useState } from "react";
import {
  DailyProvider,
  useDaily,
  useDailyEvent,
  useLocalSessionId,
} from "@daily-co/daily-react";
import { Row, Col, Card, Typography } from "antd";

const { Text } = Typography;

interface VideoCallProps {
  roomUrl: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomUrl }) => {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const [participants, setParticipants] = useState<any[]>([]);

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

  useDailyEvent("participant-joined", () => {
    setParticipants(Object.values(daily?.participants() || {}));
  });

  useDailyEvent("participant-updated", () => {
    setParticipants(Object.values(daily?.participants() || {}));
  });

  useDailyEvent("participant-left", () => {
    setParticipants(Object.values(daily?.participants() || {}));
  });

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        {participants.map((participant) => (
          <Col key={participant.session_id} xs={24} sm={12} md={8} lg={6}>
            <Card
              title={
                participant.session_id === localSessionId
                  ? "You"
                  : participant.user_name || "Participant"
              }
              bordered={false}
              style={{ background: "#f0f2f5" }}
            >
              <video
                autoPlay
                muted={participant.session_id === localSessionId}
                ref={(ref) => {
                  if (ref && participant.videoTrack) {
                    const mediaStream = new MediaStream([
                      participant.videoTrack,
                    ]);
                    ref.srcObject = mediaStream;
                  }
                }}
                style={{ width: "100%", height: "150px", background: "black" }}
              />
            </Card>
          </Col>
        ))}
      </Row>
      {participants.length === 0 && (
        <Text>No participants in the room yet.</Text>
      )}
    </div>
  );
};

// Wrap the component in DailyProvider
const VideoCallWrapper: React.FC<VideoCallProps> = ({ roomUrl }) => (
  <DailyProvider>
    <VideoCall roomUrl={roomUrl} />
  </DailyProvider>
);

export default VideoCallWrapper;
