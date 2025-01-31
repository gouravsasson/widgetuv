
import { useState } from "react";

import { VoiceAssistant } from "./components/VoiceAssistant";

function App() {
  

  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#0B1120] via-[#0A1A2F] to-[#0B1120] flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)] animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05)_0%,transparent_60%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(244,63,94,0.05)_0%,transparent_60%)]"></div>
        </div>
        <VoiceAssistant
          onMessageSend={(message) => console.log("Message:", message)}
          onVoiceStart={() => console.log("Voice started")}
          onVoiceStop={() => console.log("Voice stopped")}
        />
      </div>
    </>
  );
}

export default App;
