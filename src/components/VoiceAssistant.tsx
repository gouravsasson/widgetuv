import React, { useState, useEffect } from "react";
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
  const [wss, setwss] = useState<string | undefined>();

  // Toggle local listening state
  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      onVoiceStart?.();
    } else {
      onVoiceStop?.();
    }
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onMessageSend?.(message);
      setMessage("");
    }
  };

  // Fetch the WebSocket URL on mount
  // useEffect(() => {

  // }, []);

  // Create a new Ultravox session
  const session = new UltravoxSession();

  // Handle mic button click
  const handleMicClick = async () => {
    try {
      // 1. Make the POST request and capture the response.
      const response = await axios.post(
        "https://xjs6k34l-8000.inc1.devtunnels.ms/api/start-ultravox/",
        {
          agent_code: "6a3d9ea6-cb58-461e-8996-09e7e3a28686",
          schema_name: "0c133d26-972a-47ea-8050-51a943f2d1d0",
          voice_name: "Om",
        }
      );

      // 2. Get the WebSocket URL from the response.
      const wssUrl = response.data.joinUrl;
      console.log("Mic button clicked!", wssUrl);

      // 3. Use that URL to join the call, if it exists.
      if (wssUrl) {
        session.joinCall(wssUrl); // Make sure 'session' is defined elsewhere
      } else {
        console.error("WebSocket URL is not set");
      }

      // 4. Toggle the voice or do any other post-call setup/teardown.
      toggleVoice(); // Make sure 'toggleVoice' is defined elsewhere
    } catch (error) {
      console.error("Error in handleMicClick:", error);
    }
  };

  return (
    <div className="voice-assistant">
      <div className="voice-assistant-inner">
        {/* Enhanced floating particles with more variety */}
        <div
          className="particles"
          style={{ pointerEvents: "none" }} // <--- No click blocking
        >
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
                zIndex: 10, // <--- Ensure the button is on top
                pointerEvents: "auto", // <--- Allow clicks
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
          <div
            className="glow-effect"
            style={{ pointerEvents: "none" }} // <--- No click blocking
          />

          {/* Aurora lines */}
          <div
            className="aurora-lines"
            style={{ pointerEvents: "none" }} // <--- No click blocking
          >
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
          <div
            className="energy-field"
            style={{ pointerEvents: "none" }} // <--- No click blocking
          >
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

        {/* Interaction elements */}
        <div className="interaction-container">
          <div className={`transcription-box ${isListening ? "active" : ""}`}>
            {isListening ? "Listening..." : "Click the mic to start"}
          </div>

          <form onSubmit={handleSubmit} className="message-form">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
