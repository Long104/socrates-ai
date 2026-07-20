"use client";

import type { ChatMessage } from "@workspace/core";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "./components/ui/scroll-area";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  disabled: boolean;
  isComplete: boolean;
  distortionWarning?: string;
  activeNodeTitle?: string;
  onAutoFill?: () => void;
}

export default function ChatPanel({
  messages,
  onSend,
  disabled,
  isComplete,
  distortionWarning,
  activeNodeTitle,
  onAutoFill,
}: ChatPanelProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState("");

  // biome-ignore lint/correctness/useExhaustiveDependencies: messages is intentional trigger
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    if (!disabled && !isComplete) {
      inputRef.current?.focus();
    }
  }, [disabled, isComplete]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;
    onSend(text);
    setInputValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) form.requestSubmit();
    }
  }

  return (
    <section
      className="w-[40%] border-r border-[var(--border)] flex flex-col h-full"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Active Node Header */}
      <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
        <div>
          <span
            className="text-[10px] uppercase tracking-[0.12em]"
            style={{
              fontFamily: "var(--font-geist-mono)",
              color: "var(--muted-foreground)",
            }}
          >
            Dialogue Window
          </span>
          {activeNodeTitle && (
            <p
              className="text-[12px] mt-1"
              style={{
                fontFamily: "var(--font-geist-mono)",
                color: "var(--muted-foreground)",
              }}
            >
              {activeNodeTitle}
            </p>
          )}
        </div>
        {onAutoFill && !isComplete && (
          <button
            type="button"
            onClick={onAutoFill}
            className="text-[10px] bg-[var(--muted)] border border-[var(--border)] px-2 py-1 rounded font-mono"
            style={{ color: "var(--muted-foreground)" }}
            title="Simulate a realistic resistant conversation"
          >
            Auto-Fill Demo
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-4 space-y-4 min-h-full">
          {messages.length === 0 && (
            <div
              className="flex items-center justify-center h-full text-sm italic"
              style={{ color: "var(--muted-foreground)" }}
            >
              Type a belief below to begin deconstruction&hellip;
            </div>
          )}
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            if (isUser) {
              return (
                <div key={`${msg.role}-${i}`} className="max-w-[85%]">
                  <span
                    className="text-[9px] uppercase tracking-[0.12em] block mb-1"
                    style={{
                      fontFamily: "var(--font-geist-mono)",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    User Reflection
                  </span>
                  <div
                    className="rounded-md p-3 text-[14px] leading-relaxed"
                    style={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      fontFamily: "var(--font-geist)",
                      color: "var(--foreground)",
                      borderRadius: "6px",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            }
            return (
              <div
                key={`${msg.role}-${i}`}
                className="pl-4 my-3"
                style={{ borderLeft: "2px solid var(--border)" }}
              >
                <div
                  className="text-[17px] leading-[1.55] tracking-[-0.005em]"
                  style={{
                    fontFamily: "var(--font-newsreader)",
                    fontStyle: "italic",
                    color: "var(--foreground)",
                    maxWidth: "60ch",
                    textWrap: "pretty",
                  }}
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted AI output from own API
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      {/* Distortion Warning */}
      {distortionWarning && (
        <div
          className="mx-4 mb-2 rounded-md px-3 py-1.5 text-[11px] font-mono"
          style={{
            backgroundColor: "color-mix(in oklch, var(--accent) 10%, transparent)",
            color: "var(--accent)",
            border: "1px solid color-mix(in oklch, var(--accent) 30%, transparent)",
            borderRadius: "6px",
          }}
        >
          {distortionWarning}
        </div>
      )}

      {/* Input Bar */}
      <div className="border-t border-[var(--border)] p-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isComplete
                ? "Session completed. Peace reached."
                : disabled
                  ? "AI is reflecting..."
                  : "Type your response here..."
            }
            disabled={disabled || isComplete}
            rows={1}
            className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-[13px] resize-none outline-none transition-[border-color] duration-150 ease-out focus:border-[var(--accent)] disabled:opacity-50"
            style={{
              color: "var(--foreground)",
              fontFamily: "var(--font-geist)",
              borderRadius: "6px",
            }}
          />
          <button
            type="submit"
            disabled={disabled || isComplete || !inputValue.trim()}
            className="flex items-center justify-center p-2 rounded-md disabled:opacity-40"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--accent-foreground)",
              borderRadius: "6px",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title>Send</title>
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}
