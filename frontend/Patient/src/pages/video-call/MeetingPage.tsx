// src/pages/PatientMeetingPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { useLocation } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff
} from "lucide-react";
import "./MeetingPage.css";

const Controls = () => {
  const { leave, toggleMic, toggleWebcam, localMicOn, localWebcamOn } = useMeeting();

  return (
    <div className="controls-container">
      <div className="controls-panel">
        <button
          onClick={() => toggleMic()}
          className={`control-button mic-button ${!localMicOn ? 'muted' : ''}`}
          title={localMicOn ? "Mute microphone" : "Unmute microphone"}
        >
          {localMicOn ? <Mic /> : <MicOff />}
        </button>

        <button
          onClick={() => toggleWebcam()}
          className={`control-button camera-button ${!localWebcamOn ? 'disabled' : ''}`}
          title={localWebcamOn ? "Turn off camera" : "Turn on camera"}
        >
          {localWebcamOn ? <Video /> : <VideoOff />}
        </button>

        <button
          onClick={() => leave()}
          className="control-button end-call-button"
          title="End call"
        >
          <PhoneOff />
        </button>
      </div>
    </div>
  );
};

const ParticipantView = ({ participantId, isMainView = false }: { participantId: string; isMainView?: boolean }) => {
  const micRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const {
    webcamStream,
    micStream,
    webcamOn,
    micOn,
    isLocal,
    displayName,
  } = useParticipant(participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const stream = new MediaStream();
      stream.addTrack(webcamStream.track);
      return stream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const stream = new MediaStream();
        stream.addTrack(micStream.track);
        micRef.current.srcObject = stream;
        micRef.current.play().catch(console.error);
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micOn, micStream]);

  useEffect(() => {
    if (videoRef.current) {
      if (videoStream) {
        videoRef.current.srcObject = videoStream;
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [videoStream]);

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className={`participant-card ${isMainView ? 'main-participant' : 'secondary-participant'}`}>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn && videoStream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="participant-video"
        />
      ) : (
        <div className="participant-placeholder">
          <div className="participant-avatar">{getInitials(displayName || 'User')}</div>
          <p style={{ margin: 0, fontSize: isMainView ? '16px' : '12px' }}>
            Camera is off
          </p>
        </div>
      )}
      <div className="participant-name-overlay">
        <p className="participant-name">
          {displayName || 'Unknown'} {isLocal && '(You)'}
        </p>
        {isMainView && (
          <div className="participant-status">
            <div className={`status-indicator ${micOn ? 'mic-on' : 'mic-off'}`}>
              {micOn ? <Mic size={12} /> : <MicOff size={12} />}
            </div>
            <div className={`status-indicator ${webcamOn ? 'cam-on' : 'cam-off'}`}>
              {webcamOn ? <Video size={12} /> : <VideoOff size={12} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MeetingView = ({
  meetingId,
  onMeetingLeave,
}: {
  meetingId: string;
  onMeetingLeave: () => void;
}) => {
  const [joined, setJoined] = useState(false);
  const { join, participants } = useMeeting({
    onMeetingJoined: () => setJoined(true),
    onMeetingLeft: onMeetingLeave,
  });

  const participantIds = [...participants.keys()];
  const mainParticipant = participantIds[0];
  const secondaryParticipants = participantIds.slice(1);

  return (
    <div className="meeting-container">
      {joined ? (
        <>
          <div className="meeting-header">
            <h1 className="meeting-title">Patient Consultation</h1>
            <p className="meeting-id">Meeting ID: {meetingId}</p>
          </div>

          <div className="participants-grid">
            {mainParticipant && (
              <ParticipantView 
                key={mainParticipant} 
                participantId={mainParticipant} 
                isMainView={false}
              />
            )}
            
            {secondaryParticipants.map((id) => (
              <ParticipantView 
                key={id} 
                participantId={id} 
                isMainView={true}
              />
            ))}
          </div>

          <Controls />
        </>
      ) : (
        <div className="join-screen">
          <div className="join-card">
            <div className="join-icon">
              <Video />
            </div>
            <h2 className="join-title">Ready for your consultation?</h2>
            <p className="join-subtitle">
              Click below to connect with your doctor.
            </p>
            <button onClick={() => join()} className="join-button">
              Join Meeting
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const MeetingPage = () => {
  const location = useLocation();
  const { meetingId, token } = location.state || {};

  const onMeetingLeave = () => {
    window.history.back();
  };

  if (!meetingId || !token) {
    return (
      <div className="error-screen">
        <div className="error-card">
          <div className="error-icon">
            <PhoneOff />
          </div>
          <h2 className="error-title">Connection Error</h2>
          <p className="error-message">
            Missing meeting credentials. Please try again.
          </p>
          <button onClick={() => window.history.back()} className="error-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "Patient",
        debugMode: true,
      }}
      token={token}
    >
      <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
    </MeetingProvider>
  );
};

export default MeetingPage;
