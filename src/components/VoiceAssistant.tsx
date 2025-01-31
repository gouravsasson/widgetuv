import React, { useState } from "react";
import { Mic, MicOff, Send } from "lucide-react";
import axios from "axios";
import { UltravoxSession } from "ultravox-client";

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
  const [message, setMessage] = useState("");
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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | string) => {
    if (typeof e !== "string") {
      e.preventDefault(); // Prevent form submission if event is passed
    }

    if (message.trim()) {
      session.sendText(message); // Send the message
      setMessage(""); // Clear input after sending
      onMessageSend?.(message); // Call optional callback
    }
  };

  // Handle mic button click
  const handleMicClick = async () => {
    try {
      const response = await axios.post(
        "https://xjs6k34l-8000.inc1.devtunnels.ms/api/start-ultravox/",
        {
          agent_code: "6a3d9ea6-cb58-461e-8996-09e7e3a28686",
          schema_name: "0c133d26-972a-47ea-8050-51a943f2d1d0",
          voice_name: "Om",
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
            {isListening ? "Listening..." : "Click the mic to start"}
          </div>

          {/* Message Form */}
          <form onSubmit={handleSubmit} className="message-form">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(e);
                }
              }}
              placeholder="Type your message..."
              className="message-input"
            />
            <button type="submit" className="send-button">
              <Send className="send-icon" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
