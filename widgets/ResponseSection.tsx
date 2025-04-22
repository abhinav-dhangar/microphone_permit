"use client";

import { useEffect, useRef } from "react";
import { Avatar } from "@/components/ui/avatar";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/widgets/chat/sharedContext";
import ReactMarkdown from "react-markdown";
import MarkdownRenderer from "./MarkdownRenderer";

export function ResponseSection() {
  const { messages, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[600px] lg:max-w-[800px] mx-auto">
      <div
        className="flex-1 overflow-y-auto no-scrollbar px-2 pt-4 pb-4"
        ref={scrollAreaRef}
      >
        <div className="flex flex-col gap-6">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-muted-foreground p-8 text-center">
              <p>No messages yet. Start a conversation!</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  " px-5 py-2.5 rounded-3xl",
                  message.role === "user" ? "bg-popup " : " "
                )}
              >
                {message.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert">
                    <MarkdownRenderer content={message.content} />
                  </div>
                ) : (
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>
                )}
                {/* <div className="text-xs opacity-70 mt-1">
                  {formatTime(message.timestamp)}
                </div> */}
              </div>

              {/* {message.role === "user" && (
                <Avatar className="h-8 w-8 bg-primary flex items-center justify-center shrink-0 mt-1">
                  <User className="h-5 w-5 text-primary-foreground" />
                </Avatar>
              )} */}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start gap-3">
              <div className="bg-secondary text-secondary-foreground rounded-lg px-4 py-3">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                  <div
                    className="h-2 w-2 rounded-full bg-current animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="h-2 w-2 rounded-full bg-current animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Invisible element used as a scroll target */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}

// Helper function to format timestamp
function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
