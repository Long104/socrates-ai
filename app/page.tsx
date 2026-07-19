"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import type { Node, Edge } from "@xyflow/react";
import Header from "@/components/Header";
import ChatPanel from "@/components/ChatPanel";
import GraphCanvas from "@/components/GraphCanvas";
import type {
  BeliefNodeData,
  ChatMessage,
  DeconstructResponse,
  ReflectResponse,
} from "@/lib/types";

type Phase = "input" | "loading" | "reflecting" | "reflecting-loading" | "complete";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("input");
  const [belief, setBelief] = useState("");
  const [deconstructData, setDeconstructData] = useState<DeconstructResponse | null>(null);
  const [currentAssumptionIndex, setCurrentAssumptionIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: 'Welcome to <strong>Socrates AI</strong>. Type a rigid belief or worldview you hold — something that feels absolute — and I\'ll help you deconstruct it using the Socratic Method.',
    },
  ]);
  const [mindState, setMindState] = useState<"untangling" | "untangled">("untangling");
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  const resolveAssumption = useCallback((id: string) => {
    setResolvedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // Build React Flow nodes and edges from deconstructData + resolved state
  const { nodes, edges } = useMemo<{ nodes: Node<BeliefNodeData>[]; edges: Edge[] }>(() => {
    if (!deconstructData) return { nodes: [], edges: [] };

    const result: Node<BeliefNodeData>[] = [];
    const edgeList: Edge[] = [];

    // Store resolved texts (must be declared BEFORE the forEach loop)
    const resolvedTexts = resolvedTextsRef.current;

    // Root node
    result.push({
      id: deconstructData.rootNode.id,
      type: "beliefNode",
      position: { x: 200, y: 20 },
      data: {
        label: deconstructData.rootNode.text,
        type: "root",
        status: "resolved",
      },
    });

    // Assumption nodes
    const totalAssumptions = deconstructData.assumptions.length;
    const startX =
      totalAssumptions === 2
        ? 100
        : totalAssumptions === 3
          ? 30
          : 0;
    const spacing = totalAssumptions === 2 ? 280 : 200;

    let middleWayUnlocked = true;

    deconstructData.assumptions.forEach((assumption, i) => {
      const isResolved = resolvedIds.has(assumption.id);
      const isCurrent = i === currentAssumptionIndex;
      const isLocked = !isResolved && !isCurrent;
      const status: "locked" | "heavy" | "resolved" = isResolved
        ? "resolved"
        : isLocked
          ? "locked"
          : "heavy";

      if (status !== "resolved") {
        middleWayUnlocked = false;
      }

      result.push({
        id: assumption.id,
        type: "beliefNode",
        position: { x: startX + i * spacing, y: 200 },
        data: {
          label: `SUPPORTING VIEW ${String.fromCharCode(65 + i)}`,
          type: "assumption",
          fact: assumption.fact,
          leap: isResolved
            ? resolvedTexts.get(assumption.id) ?? assumption.leap
            : assumption.leap,
          status,
          socraticQuestion: assumption.socraticQuestion,
        },
      });

      // Edge from root to assumption
      const rootToEdgeId = `root-${assumption.id}`;
      edgeList.push({
        id: rootToEdgeId,
        source: deconstructData.rootNode.id,
        target: assumption.id,
        style: {
          stroke: isResolved ? "#14b8a6" : isCurrent ? "#f59e0b" : "#475569",
          strokeWidth: 2,
          strokeDasharray: isResolved ? undefined : "5,5",
        },
      });

      // Edge from assumption to middle way
      edgeList.push({
        id: `${assumption.id}-middle`,
        source: assumption.id,
        target: "middle-way",
        style: {
          stroke: isResolved ? "#06b6d4" : "#475569",
          strokeWidth: 2,
          strokeDasharray: isResolved ? undefined : "5,5",
        },
      });
    });

    // Middle way node
    result.push({
      id: "middle-way",
      type: "beliefNode",
      position: { x: 200, y: 400 },
      data: {
        label: middleWayUnlocked
          ? "Power is a tool. Systems are flawed, but I focus on the scale of action I actually control."
          : "",
        type: "middle-way",
        status: middleWayUnlocked ? "resolved" : "locked",
      },
    });

    return { nodes: result, edges: edgeList };
  }, [deconstructData, resolvedIds, currentAssumptionIndex]);

  // Store resolved texts globally for the leap text update
  const resolvedTextsRef = useRef(new Map<string, string>());

  const handleDeconstruct = useCallback(
    async (beliefText: string) => {
      setPhase("loading");
      setBelief(beliefText);

      setMessages((prev) => [
        ...prev,
        { role: "user", text: beliefText },
        { role: "ai", text: "Analyzing your belief structure..." },
      ]);

      try {
        const res = await fetch("/api/deconstruct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ belief: beliefText }),
        });

        if (!res.ok) throw new Error("Deconstruct failed");

        const data: DeconstructResponse = await res.json();
        setDeconstructData(data);
        setCurrentAssumptionIndex(0);

        // Replace loading message with first assumption question
        setMessages((prev) => {
          const updated = prev.slice(0, -1);
          const firstQ = data.assumptions[0]?.socraticQuestion;
          updated.push({
            role: "ai",
            text: `I've deconstructed your belief into its core components. Look at the graph on the right.<br/><br/>Let's start with <strong>Supporting View A</strong>.<br/><br/><em>${firstQ}</em>`,
          });
          return updated;
        });

        setPhase("reflecting");
      } catch {
        setMessages((prev) => {
          const updated = prev.slice(0, -1);
          updated.push({
            role: "ai",
            text: "Sorry, I encountered an error deconstructing your belief. Please check your API key and try again.",
          });
          return updated;
        });
        setPhase("input");
      }
    },
    []
  );

  const handleReflect = useCallback(
    async (userResponse: string) => {
      if (!deconstructData) return;

      const current = deconstructData.assumptions[currentAssumptionIndex];
      if (!current) return;

      setMessages((prev) => [...prev, { role: "user", text: userResponse }]);
      setPhase("reflecting-loading");

      try {
        const res = await fetch("/api/reflect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assumption: {
              fact: current.fact,
              leap: current.leap,
              socraticQuestion: current.socraticQuestion,
            },
            userResponse,
          }),
        });

        if (!res.ok) throw new Error("Reflect failed");

        const data: ReflectResponse = await res.json();

        setMessages((prev) => [
          ...prev,
          { role: "ai", text: data.aiResponse },
        ]);

        if (data.nextAction === "advance") {
          // Resolve current node
          resolveAssumption(current.id);
          resolvedTextsRef.current.set(current.id, data.resolvedText);

          // Check if there's a next assumption
          const nextIndex = currentAssumptionIndex + 1;
          if (nextIndex < deconstructData.assumptions.length) {
            setCurrentAssumptionIndex(nextIndex);
            const nextAssumption = deconstructData.assumptions[nextIndex];
            setMessages((prev) => [
              ...prev,
              {
                role: "ai",
                text: `Let's move to the next assumption.<br/><br/><em>${nextAssumption.socraticQuestion}</em>`,
              },
            ]);
            setPhase("reflecting");
          } else {
            // All assumptions resolved - unlock middle way
            setCurrentAssumptionIndex(nextIndex);
            resolveAssumption(current.id); // ensure last one is resolved
            setMindState("untangled");
            setMessages((prev) => [
              ...prev,
              {
                role: "ai",
                text: "All assumptions have been examined. Look at the bottom of the graph — <strong>The Middle Way</strong> has unlocked.<br/><br/>Take a moment to reflect on how this balanced perspective feels compared to the heavy view you carried.",
              },
            ]);
            setPhase("complete");
          }
        } else if (data.nextAction === "pushback") {
          // Stay on same node, deeper question
          setPhase("reflecting");
        } else if (data.nextAction === "complete") {
          // Direct unlock
          resolveAssumption(current.id);
          resolvedTextsRef.current.set(current.id, data.resolvedText);
          setCurrentAssumptionIndex(deconstructData.assumptions.length);
          setMindState("untangled");
          setMessages((prev) => [
            ...prev,
            {
              role: "ai",
              text: "All assumptions have been examined. Look at the bottom of the graph — <strong>The Middle Way</strong> has unlocked.<br/><br/>Take a moment to reflect on how this balanced perspective feels compared to the heavy view you carried.",
            },
          ]);
          setPhase("complete");
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "Sorry, I encountered an error processing your response. Please try again.",
          },
        ]);
        setPhase("reflecting");
      }
    },
    [deconstructData, currentAssumptionIndex, resolveAssumption, resolvedTextsRef]
  );

  const handleAutoFill = useCallback(() => {
    // Quick demo: fill a plausible response
    if (!deconstructData) return;
    const current = deconstructData.assumptions[currentAssumptionIndex];
    if (!current) return;

    // Set a demo response based on common patterns
    const demoText =
      "I suppose that is a fair point. The fact is real, but the absolute conclusion might be too extreme. There are exceptions.";
    setMessages((prev) => [...prev, { role: "user", text: demoText }]);
    handleReflect(demoText);
  }, [deconstructData, currentAssumptionIndex, handleReflect]);

  // Determine active node title
  const activeNodeTitle = useMemo(() => {
    if (phase === "complete") return "Session Completed";
    if (!deconstructData) return "";
    const current = deconstructData.assumptions[currentAssumptionIndex];
    if (!current) return "";
    return `Inspecting: ${current.fact.length > 40 ? current.fact.slice(0, 40) + "..." : current.fact}`;
  }, [phase, deconstructData, currentAssumptionIndex]);

  // Determine distortion warning
  const distortionWarning = useMemo(() => {
    if (phase === "complete") return undefined;
    if (!deconstructData) return undefined;
    const current = deconstructData.assumptions[currentAssumptionIndex];
    if (!current) return undefined;
    return `Inspecting heavy leap: "${current.leap}"`;
  }, [phase, deconstructData, currentAssumptionIndex]);

  return (
    <div className="h-screen flex flex-col">
      <Header mindState={mindState} />

      {/* Belief Input Overlay */}
      {phase === "input" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
            <h1 className="text-2xl font-bold text-slate-100 mb-2">
              What belief feels heavy?
            </h1>
            <p className="text-sm text-slate-400 mb-6">
              Type a rigid worldview, an anxiety-inducing thought, or an
              absolute statement. I&apos;ll help you find the Middle Way.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.elements.namedItem(
                  "beliefInput"
                ) as HTMLInputElement;
                const text = input.value.trim();
                if (text) handleDeconstruct(text);
              }}
            >
              <textarea
                name="beliefInput"
                rows={3}
                placeholder='"Capitalism is pure evil." or "I will never be good enough."'
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 text-slate-100 placeholder-slate-500 resize-none"
              />
              <button
                type="submit"
                className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-sm px-6 py-3 rounded-xl transition"
              >
                Deconstruct
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {phase === "loading" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-300 text-sm">Deconstructing belief...</p>
          </div>
        </div>
      )}

      {/* Main Split Screen */}
      <main className="flex-1 flex overflow-hidden">
        <ChatPanel
          messages={messages}
          onSend={handleReflect}
          disabled={phase !== "reflecting"}
          isComplete={phase === "complete"}
          distortionWarning={distortionWarning}
          activeNodeTitle={activeNodeTitle}
          onAutoFill={
            phase === "reflecting" ? handleAutoFill : undefined
          }
        />
        <GraphCanvas nodes={nodes} edges={edges} />
      </main>
    </div>
  );
}
