import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send } from "lucide-react";
import axios from "axios";
import { UltravoxSession } from "ultravox-client";
import { useWidgetContext } from "../constexts/WidgetContext";

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(null);
  const [transcripts, setTranscripts] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [callid, setcallid] = useState("");
  const [callsessionid, setcallsessionid] = useState("");

  const { agent_id, schema } = useWidgetContext();
  const baseurl = "https://app.snowie.ai";
  // const agent_id = "6a3d9ea6-cb58-461e-8996-09e7e3a28686";
  // const schema = "0c133d26-972a-47ea-8050-51a943f2d1d0";

  const sessionRef = useRef<UltravoxSession | null>(null);
  if (!sessionRef.current) {
    sessionRef.current = new UltravoxSession();
  }

  const session = sessionRef.current;

  // Toggle local listening state
  const toggleVoice = (data) => {
    setIsListening(data);
  };

  // Handle message submission
  const handleSubmit = () => {
    console.log(status);
    console.log(message);

    if (status != "disconnected") {
      session.sendText(`${message}`);
      setMessage("");
    }
  };

  // Handle mic button click
  const handleMicClick = async () => {
    try {
      if (!isListening) {
        const response = await axios.post(`${baseurl}/api/start-ultravox/`, {
          agent_code: agent_id,
          schema_name: schema,
        });

        const wssUrl = response.data.joinUrl;
        setcallid(response.data.callId);
        setcallsessionid(response.data.call_session_id);
        console.log("Mic button clicked!", wssUrl);

        if (wssUrl) {
          session.joinCall(wssUrl);
        } else {
          console.error("WebSocket URL is not set");
        }
        toggleVoice(true);
      } else {
        await session.leaveCall();
        const response = await axios.post(
          `${baseurl}/api/end-call-session-ultravox/`,
          {
            call_session_id: callsessionid,
            call_id: callid,
            schema_name: schema,
          }
        );

        console.log("Call left successfully");
        setTranscripts(null);
        toggleVoice(false);
      }
    } catch (error) {
      console.error("Error in handleMicClick:", error);
    }
  };

  session.addEventListener("transcripts", (event) => {
    console.log("Transcripts updated: ", session);

    const alltrans = session.transcripts;

    let Trans = "";

    for (let index = 0; index < alltrans.length; index++) {
      const currentTranscript = alltrans[index];

      Trans = currentTranscript.text;

      if (currentTranscript) {
        setTranscripts(Trans);
      }
    }
  });

  // Listen for status changing events
  session.addEventListener("status", (event) => {
    setStatus(session.status);
    console.log("Session status changed: ", session.status);
  });

  return (
    <div className="voice-assistant">
      <div className=" voice-assistant-inner">
        {/* Floating particles */}
        <div className="particles" style={{ pointerEvents: "none" }}>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`particle ${i % 2 === 0 ? "particle-large" : ""}`}
              style={
                {
                  "--delay": `${i * 0.3}s`,
                  "--position": `${Math.random() * 100}%`,
                  "--speed": `${10 + Math.random() * 5}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Voice Orb */}
        <div className=" w-full  voice-orb-container">
          <div className={`voice-orb ${isListening ? "listening" : ""}`}>
            {/* Orb rings */}
            <div className="orb-rings" style={{ pointerEvents: "none" }}>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="orb-ring"
                  style={{ "--index": i } as React.CSSProperties}
                />
              ))}
            </div>

            {/* Mic Button */}
            <button
              onClick={handleMicClick}
              className="mic-button"
              aria-label="Toggle voice input"
              style={{
                position: "relative",
                zIndex: 10,
                pointerEvents: "auto",
              }}
            >
              {isListening ? (
                <MicOff className="mic-icon" />
              ) : (
                <Mic className="mic-icon" />
              )}
            </button>
          </div>

          {/* Glow effect */}
          <div className="glow-effect" style={{ pointerEvents: "none" }} />

          {/* Aurora lines */}
          <div className="aurora-lines" style={{ pointerEvents: "none" }}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aurora-line"
                style={
                  {
                    "--index": i,
                    animationDelay: `${i * 0.15}s`,
                    opacity: 1 - i * 0.1,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          {/* Energy field */}
          <div className="energy-field" style={{ pointerEvents: "none" }}>
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="energy-ring"
                style={
                  {
                    "--rotation": `${i * 30}deg`,
                    "--delay": `${i * 0.1}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        </div>

        {/* Interaction Elements */}
        <div className="interaction-container ">
          <div className={`transcription-box ${isListening ? "active" : ""}`}>
            {/* {isListening ? "Listening..." : "Click the mic to start"} */}
            {transcripts}
          </div>

          {/* Message Form */}
          <div className=" flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(e.target.value);
                }
              }}
              placeholder="Type your message..."
              className="message-input"
            />
            <button
              type="button"
              onClick={handleSubmit}
              className="send-button"
            >
              <Send className="send-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
