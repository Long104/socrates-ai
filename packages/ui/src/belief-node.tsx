"use client";

import type { BeliefNodeData } from "@workspace/core";
import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { memo } from "react";

type BeliefNodeType = Node<BeliefNodeData>;

function BeliefNode({ data }: NodeProps<BeliefNodeType>) {
  const { label, type, fact, leap, status } = data;

  if (type === "root") {
    return (
      <div
        className="w-[300px] rounded-md bg-[var(--card)] border border-[var(--border)] shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
        style={{ borderRadius: "6px" }}
      >
        <Handle type="source" position={Position.Bottom} />
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--border)] bg-[var(--muted)]/50">
          <span
            className="text-[9px] uppercase tracking-[0.12em]"
            style={{ fontFamily: "var(--font-geist-mono)", color: "var(--muted-foreground)" }}
          >
            Root Belief
          </span>
          <span
            className="text-[9px] uppercase tracking-[0.12em]"
            style={{ fontFamily: "var(--font-geist-mono)", color: "var(--muted-foreground)" }}
          >
            Seed
          </span>
        </div>
        <div className="p-3">
          <p
            className="text-[18px] leading-[1.45] tracking-[-0.01em] text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-newsreader)", fontStyle: "italic" }}
          >
            &ldquo;{label}&rdquo;
          </p>
        </div>
      </div>
    );
  }

  if (type === "middle-way") {
    const isResolved = status === "resolved";
    const borderColor = isResolved ? "var(--middle-way-glow)" : "var(--border)";
    const borderWidth = isResolved ? "2px" : "2px";
    const shadow = isResolved ? "0 0 40px -8px var(--middle-way-glow)" : "none";
    const opacity = status === "locked" ? "opacity-50" : "opacity-100";

    return (
      <div
        className={`w-[340px] rounded-md ${opacity}`}
        style={{
          borderRadius: "6px",
          backgroundColor: "var(--card)",
          border: `${borderWidth} solid ${borderColor}`,
          boxShadow: shadow,
        }}
      >
        <Handle type="target" position={Position.Top} />
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--border)] bg-[var(--muted)]/50">
          <span
            className="text-[9px] uppercase tracking-[0.12em]"
            style={{ fontFamily: "var(--font-geist-mono)", color: "var(--muted-foreground)" }}
          >
            The Middle Way
          </span>
          <span
            className="text-[9px] uppercase tracking-[0.12em]"
            style={{
              fontFamily: "var(--font-geist-mono)",
              color: isResolved ? "var(--middle-way-glow)" : "var(--muted-foreground)",
            }}
          >
            {isResolved ? "Synthesized" : "Awaiting"}
          </span>
        </div>
        <div className="p-4">
          {isResolved ? (
            <p
              className="text-[17px] leading-[1.4] text-center text-pretty text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-newsreader)", fontStyle: "italic" }}
            >
              &ldquo;{label}&rdquo;
            </p>
          ) : (
            <p
              className="text-[13px] leading-relaxed"
              style={{
                fontFamily: "var(--font-newsreader)",
                fontStyle: "italic",
                color: "var(--muted-foreground)",
              }}
            >
              Examine each leap above&hellip;
            </p>
          )}
        </div>
      </div>
    );
  }

  // Assumption node
  const isResolved = status === "resolved";
  const isHeavy = status === "heavy";
  const borderColor = isResolved
    ? "var(--leap-resolved)"
    : isHeavy
      ? "var(--accent)"
      : "var(--muted)";
  const borderOpacity = isResolved ? "/40" : isHeavy ? "/40" : "";
  const statusLabel = isResolved ? "Open" : isHeavy ? "Heavy" : "Locked";
  const statusColor = isResolved
    ? "var(--leap-resolved)"
    : isHeavy
      ? "var(--accent)"
      : "var(--muted-foreground)";

  // Locked nodes are hidden (progressive reveal)
  if (status === "locked") {
    return null;
  }

  return (
    <div
      className="w-[240px] bg-[var(--card)] rounded-md"
      style={{
        borderRadius: "6px",
        border: isResolved
          ? "1px solid color-mix(in oklch, var(--leap-resolved) 40%, transparent)"
          : "1px solid color-mix(in oklch, var(--accent) 40%, transparent)",
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-[var(--border)] bg-[var(--muted)]/50">
        <span
          className="text-[9px] uppercase tracking-[0.12em]"
          style={{ fontFamily: "var(--font-geist-mono)", color: "var(--muted-foreground)" }}
        >
          {label}
        </span>
        <span
          className="text-[9px] uppercase tracking-[0.12em]"
          style={{ fontFamily: "var(--font-geist-mono)", color: statusColor }}
        >
          {statusLabel}
        </span>
      </div>

      {/* Fact section */}
      {fact && (
        <div className="p-2.5 border-b border-dashed border-[var(--border)]">
          <span
            className="text-[8px] uppercase tracking-[0.12em] block mb-0.5"
            style={{ fontFamily: "var(--font-geist-mono)", color: "var(--muted-foreground)" }}
          >
            Fact
          </span>
          <p
            className="text-[11px] leading-snug"
            style={{ fontFamily: "var(--font-geist)", color: "var(--fact)" }}
          >
            {fact}
          </p>
        </div>
      )}

      {/* Leap section */}
      <div className="p-2.5">
        <span
          className="text-[8px] uppercase tracking-[0.12em] block mb-0.5"
          style={{ fontFamily: "var(--font-geist-mono)", color: statusColor }}
        >
          Leap
        </span>
        <p
          className="text-[11px] leading-snug"
          style={{
            fontFamily: isResolved ? "var(--font-newsreader)" : "var(--font-geist)",
            fontStyle: isResolved ? "italic" : "normal",
            color: isResolved ? "var(--leap-resolved)" : "var(--foreground)",
          }}
        >
          {leap}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(BeliefNode);
