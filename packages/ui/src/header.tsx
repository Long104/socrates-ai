"use client";

import { useReducedMotion } from "motion/react";
import { Badge } from "./components/ui/badge";

interface HeaderProps {
  mindState: "untangling" | "untangled";
}

export default function Header({ mindState }: HeaderProps) {
  const isUntangled = mindState === "untangled";
  const shouldReduceMotion = useReducedMotion();

  return (
    <header className="h-14 border-b border-[var(--border)] flex items-center justify-between px-4">
      {/* Left */}
      <div className="flex items-center gap-2">
        <span className="text-[16px] font-medium" style={{ fontFamily: "var(--font-geist)" }}>
          Socrates AI
        </span>
        <span
          className="w-[3px] h-[3px] rounded-full"
          style={{ backgroundColor: "var(--muted-foreground)" }}
        />
        <span
          className="text-[10px] uppercase tracking-[0.12em]"
          style={{
            color: "var(--muted-foreground)",
            fontFamily: "var(--font-geist-mono)",
          }}
        >
          Think Clearly
        </span>
      </div>

      {/* Right — Mind State */}
      <Badge
        variant="outline"
        className="flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-[0.1em]"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
          color: "var(--muted-foreground)",
        }}
      >
        <span
          className="w-[6px] h-[6px] rounded-full"
          style={{
            backgroundColor: isUntangled ? "var(--leap-resolved)" : "var(--accent)",
            transition: shouldReduceMotion ? "none" : "background-color 0.5s ease-out",
          }}
        />
        {isUntangled ? "Done" : "Working..."}
      </Badge>
    </header>
  );
}
