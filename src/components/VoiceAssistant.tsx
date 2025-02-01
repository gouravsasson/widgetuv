import React, { useState, useEffect } from "react";
import { Mic, MicOff, Send } from "lucide-react";
import axios from "axios";
import { UltravoxSession } from "ultravox-client";
import { useWidgetContext } from "../constexts/WidgetContext";

interface VoiceAssistantProps {
  onMessageSend?: (message: string) => void;
  onVoiceStart?: () => void;
  onVoiceStop?: () => void;
}

export function VoiceAssistant({
  onMessageSend,
  onVoiceStart,
  onVoiceStop,
}: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcripts, setTranscripts] = useState();
  const [message, setMessage] = useState("");

  const { agent_id, schema } = useWidgetContext();
  // const agent_id = "92242812-bc5a-40c3-adae-e8e5f2e56ad9";
  // const schema = "6af30ad4-a50c-4acc-8996-d5f562b6987f";

  const session = new UltravoxSession();

  // Toggle local listening state
  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      onVoiceStart?.();
    } else {
      onVoiceStop?.();
    }
  };

  // Handle message submission
  const handleSubmit = () => {
    console.log(message);

    session.sendText("gourav");
  };

  // Handle mic button click
  const handleMicClick = async () => {
    try {
      const response = await axios.post(
        "https://app.snowie.ai/api/start-ultravox/",
        {
          agent_code: agent_id,
          schema_name: schema,
        }
      );

      const wssUrl = response.data.joinUrl;
      console.log("Mic button clicked!", wssUrl);

      if (wssUrl) {
        session.joinCall(wssUrl);
      } else {
        console.error("WebSocket URL is not set");
      }

      toggleVoice();
    } catch (error) {
      console.error("Error in handleMicClick:", error);
    }
  };

  session.addEventListener("transcripts", (event) => {
    console.log("Transcripts updated: ", session.transcripts);

    // Get all transcripts from the session
    const alltrans = session.transcripts;

    // Initialize a variable to hold the concatenated transcripts
    let combinedTrans = "";

    // Loop through each transcript in the array
    for (let index = 0; index < alltrans.length; index++) {
      // Assuming each transcript has a 'text' or similar property
      const currentTranscript = alltrans[index];

      // Append the text to our running string
      combinedTrans = currentTranscript.text;

      // If this transcript is marked as final, we update our state or variable
      if (currentTranscript) {
        setTranscripts(combinedTrans);
      }
    }
  });

  // Listen for status changing events
  session.addEventListener("status", (event) => {
    console.log("Session status changed: ", session.status);
  });

  return (
    <div className="voice-assistant">
      <div className="voice-assistant-inner">
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
        <div className="voice-orb-container">
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
        <div className="interaction-container">
          <div className={`transcription-box ${isListening ? "active" : ""}`}>
            {/* {isListening ? "Listening..." : "Click the mic to start"} */}
            {transcripts}
          </div>

          {/* Message Form */}

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
          <button type="button" onClick={handleSubmit} className="send-button">
            <Send className="send-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
