"use client";

import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Paperclip, Square, X, Mic } from "lucide-react";
import { useRef, useState } from "react";
import { MicPopup } from "./MicPopup";
import { useChat } from "./chat/sharedContext";

export function InputChat() {
  const { addMessage, isLoading, setIsLoading } = useChat();
  const [input, setInput] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  const [isMicOpen, setIsMicOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (input.trim() || files.length > 0) {
      // Add user message to chat
      addMessage({
        role: "user",
        content: input.trim(),
      });

      setIsLoading(true);

      try {
        // Send request to API
        const response = await fetch(`http://localhost:4000/api/llm/invoke2`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input,
          }),
        });

        const json = await response.json();

        // Add AI response to chat
        if (json?.markdown) {
          addMessage({
            role: "assistant",
            content: json.markdown,
          });
        }
      } catch (error) {
        console.error("Error calling AI API:", error);
        // Optionally add an error message to the chat
        addMessage({
          role: "assistant",
          content:
            "Sorry, I encountered an error while processing your request.",
        });
      } finally {
        setIsLoading(false);
        setInput("");
        setFiles([]);
      }
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = "";
    }
  };

  return (
    <PromptInput
      value={input}
      onValueChange={setInput}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      className="w-full max-w-[full]"
    >
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
            >
              <Paperclip className="size-4" />
              <span className="max-w-[120px] truncate">{file.name}</span>
              <button
                onClick={() => handleRemoveFile(index)}
                className="hover:bg-secondary/50 rounded-full p-1"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <PromptInputTextarea placeholder="Ask me anything..." />

      <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
        <PromptInputAction tooltip="Attach files">
          <label
            htmlFor="file-upload"
            className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl"
          >
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <Paperclip className="text-primary size-5" />
          </label>
        </PromptInputAction>
        <div>
          <Button
            variant="default"
            onClick={() => setIsMicOpen(true)}
            size="icon"
            className="h-8 w-8 rounded-full  mx-2  md:mx-4"
          >
            <Mic className="size-5 " />
          </Button>
          <MicPopup open={isMicOpen} onOpenChange={setIsMicOpen} />
          <PromptInputAction
            tooltip={isLoading ? "Stop generation" : "Send message"}
          >
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <Square className="size-5 fill-current" />
              ) : (
                <ArrowUp className="size-5" />
              )}
            </Button>
          </PromptInputAction>
        </div>
      </PromptInputActions>
    </PromptInput>
  );
}
