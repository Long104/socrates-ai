"use client";

import { memo } from "react";
import { type NodeProps, type Node, Handle, Position } from "@xyflow/react";
import type { BeliefNodeData } from "@/lib/types";

type BeliefNodeType = Node<BeliefNodeData>;

function BeliefNode({ data }: NodeProps<BeliefNodeType>) {
  const { label, type, fact, leap, status } = data;

  const borderColor =
    status === "resolved"
      ? "border-teal-500"
      : status === "heavy"
        ? "border-amber-500"
        : "border-slate-700";

  const opacity = status === "locked" ? "opacity-40" : "opacity-100";

  if (type === "root") {
    return (
      <div
        className={`${borderColor} ${opacity} bg-slate-900/95 rounded-xl p-3 w-[260px] shadow-lg border-2 transition-all duration-500`}
      >
        <Handle type="source" position={Position.Bottom} />
        <div className="flex items-center justify-between text-[10px] text-cyan-400 font-semibold mb-1 font-mono">
          <span>ROOT BELIEF</span>
          <span className="bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
            Anxiety Driver
          </span>
        </div>
        <p className="text-xs font-medium text-slate-100 leading-relaxed">
          &ldquo;{label}&rdquo;
        </p>
      </div>
    );
  }

  if (type === "middle-way") {
    const isResolved = status === "resolved";
    return (
      <div
        className={`${borderColor} ${opacity} bg-slate-900/95 rounded-xl overflow-hidden w-[280px] shadow-lg border transition-all duration-500`}
      >
        <Handle type="target" position={Position.Top} />
        <div
          className={`bg-slate-800/80 px-3 py-1.5 border-b ${
            isResolved ? "border-cyan-500/30" : "border-slate-700/50"
          } flex justify-between text-[9px] font-mono ${
            isResolved ? "text-cyan-400" : "text-slate-400"
          } font-semibold`}
        >
          <span>THE MIDDLE WAY</span>
          <span
            className={
              isResolved
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded"
                : ""
            }
          >
            {isResolved ? "Balanced View" : "Locked"}
          </span>
        </div>
        <div className="p-2.5 text-xs leading-relaxed">
          {isResolved ? (
            <p className="text-slate-100 font-medium">&ldquo;{label}&rdquo;</p>
          ) : (
            <p className="text-slate-400 italic">
              Examine the heavy leaps above to unlock&hellip;
            </p>
          )}
        </div>
      </div>
    );
  }

  // assumption node
  const leapTextColor =
    status === "resolved" ? "text-teal-500" : "text-amber-500";
  const leapBgColor =
    status === "resolved" ? "bg-teal-950/20" : "bg-transparent";

  return (
    <div
      className={`${borderColor} ${opacity} bg-slate-900/95 rounded-xl overflow-hidden w-[220px] shadow-lg border transition-all duration-500`}
    >
      <Handle type="target" position={Position.Top} />
      <div className="bg-slate-800/80 px-2.5 py-1.5 border-b border-slate-700/50 flex justify-between text-[9px] font-mono font-semibold">
        <span
          className={
            status === "resolved" ? "text-teal-400" : "text-amber-400"
          }
        >
          {label}
        </span>
        <span
          className={
            status === "resolved"
              ? "text-teal-400"
              : status === "heavy"
                ? "text-amber-400"
                : "text-slate-400"
          }
        >
          {status === "resolved"
            ? "Open Space"
            : status === "heavy"
              ? "Heavy"
              : "Locked"}
        </span>
      </div>
      <div className="bg-slate-950/40 p-2 border-b border-slate-800/50">
        <span className="text-[8px] uppercase tracking-wider font-mono text-slate-500 block mb-0.5 font-semibold">
          Fact (True)
        </span>
        <p className="text-[10px] text-slate-400 leading-tight">{fact}</p>
      </div>
      <div className={`p-2 ${leapBgColor}`}>
        <span
          className={`text-[8px] uppercase tracking-wider font-mono ${leapTextColor} block mb-0.5 font-semibold`}
        >
          Leap (Assumption)
        </span>
        <p
          className={`text-[10.5px] leading-tight ${
            status === "resolved" ? "text-teal-300 italic" : "text-slate-100"
          }`}
        >
          {leap}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(BeliefNode);
