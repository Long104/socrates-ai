"use client";

interface HeaderProps {
  mindState: "untangling" | "untangled";
}

export default function Header({ mindState }: HeaderProps) {
  const isUntangled = mindState === "untangled";
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center font-bold text-lg text-slate-950">
          S
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-100">
          Socrates AI
        </span>
        <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded border border-cyan-500/20">
          The Middle Way
        </span>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-sm font-medium">
            Mind State:
          </span>
          <span
            className={`font-mono font-bold text-sm ${
              isUntangled ? "text-teal-400" : "text-amber-400"
            }`}
          >
            {isUntangled ? "Untangled" : "Untangling Thoughts..."}
          </span>
        </div>
        <div className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700">
          Guide Mode: Socratic Mirror
        </div>
      </div>
    </header>
  );
}
