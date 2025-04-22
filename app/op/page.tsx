import { InputChat } from "@/widgets/InputChat";
import { ResponseSection } from "@/widgets/ResponseSection";
import { ChatProvider } from "@/widgets/chat/sharedContext";
export default function App() {
  return (
    <ChatProvider>
      <div className="flex flex-col h-[100vh] w-[100vw]">
        <div className="flex-1 overflow-hidden">
          <ResponseSection />
        </div>
        <div className="p-4 border-t">
          <div className="mx-auto max-w-[800px]">
            <InputChat />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}
