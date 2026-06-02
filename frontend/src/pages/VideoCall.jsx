import { JitsiMeeting } from "@jitsi/react-sdk";

function VideoCall() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Video Consultation</h1>

      <JitsiMeeting
        roomName="MediVerse-Consultation"
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "700px";
          iframeRef.style.width = "100%";
        }}
      />
    </div>
  );
}

export default VideoCall;
