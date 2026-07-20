"use client";

import type { ChatMessage } from "@workspace/core";
import { useEffect, useRef } from "react";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  currentQuestion?: string;
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
  const inputRef = useRef<HTMLInputElement>(null);

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
    const form = e.currentTarget;
    const input = form.elements.namedItem("userInput") as HTMLInputElement;
    const text = input.value.trim();
    if (!text) return;
    onSend(text);
    input.value = "";
  }

  return (
    <section className="w-5/12 border-r border-slate-800 flex flex-col bg-slate-900/20">
      {/* Active Node Header */}
      <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex justify-between items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Dialogue Window
          </span>
          {activeNodeTitle && (
            <h2 className="text-md font-semibold text-cyan-400 mt-1">{activeNodeTitle}</h2>
          )}
        </div>
        {onAutoFill && !isComplete && (
          <button
            onClick={onAutoFill}
            className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-1 rounded font-mono text-cyan-400 transition"
            title="Simulate a realistic resistant conversation"
          >
            Auto-Fill Demo
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-grow p-6 overflow-y-auto space-y-4" id="chat-container">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm italic">
            Type a belief below to begin deconstruction&hellip;
          </div>
        )}
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={i}
              className={`flex items-start space-x-3 max-w-[85%] ${
                isUser ? "ml-auto justify-end" : ""
              }`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-slate-850 border border-slate-700 flex items-center justify-center text-xs shrink-0 text-cyan-400 font-bold">
                  AI
                </div>
              )}
              <div
                className={`rounded-2xl p-4 text-sm leading-relaxed ${
                  isUser
                    ? "bg-cyan-600/10 border border-cyan-500/20 rounded-tr-none"
                    : "bg-slate-900 border border-slate-800 rounded-tl-none"
                }`}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
              {isUser && (
                <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-xs shrink-0 text-slate-950 font-bold">
                  ME
                </div>
              )}
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Distortion Warning */}
      {distortionWarning && (
        <div className="mx-4 mb-2 flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg">
          <span className="text-amber-400 text-xs">{distortionWarning}</span>
        </div>
      )}

      {/* Input Panel */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              name="userInput"
              type="text"
              placeholder={
                isComplete
                  ? "Session completed. Peace reached."
                  : disabled
                    ? "AI is reflecting..."
                    : "Type your response here..."
              }
              disabled={disabled || isComplete}
              className="flex-grow bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-100 placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={disabled || isComplete}
              className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-sm px-6 py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              Reflect
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
