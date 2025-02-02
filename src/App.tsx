import { VoiceAssistant } from "./components/VoiceAssistant";

function App() {
  return (
    <>
      <div className=" bg-black flex items-center justify-center p-4 overflow-hidden">
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
