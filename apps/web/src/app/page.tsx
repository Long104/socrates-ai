"use client";

import type {
  BeliefNodeData,
  ChatMessage,
  DeconstructResponse,
  ReflectResponse,
  SynthesizeResponse,
} from "@workspace/core";
import { ChatPanel, GraphCanvas, Header } from "@workspace/ui";
import type { Edge, Node } from "@xyflow/react";
import { useCallback, useMemo, useRef, useState } from "react";

type Phase = "input" | "loading" | "reflecting" | "reflecting-loading" | "complete";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("input");
  const [belief, setBelief] = useState("");
  const [deconstructData, setDeconstructData] = useState<DeconstructResponse | null>(null);
  const [currentAssumptionIndex, setCurrentAssumptionIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "Welcome to <strong>Socrates AI</strong>. Got a thought that feels absolute — like something is always true or will never change? Share it, and we'll look at it together.",
    },
  ]);
  const [mindState, setMindState] = useState<"untangling" | "untangled">("untangling");
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());
  const [middleWayText, setMiddleWayText] = useState<string>("");

  const resolveAssumption = useCallback((id: string) => {
    setResolvedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // Store resolved texts globally for the leap text update (must be before useMemo)
  const resolvedTextsRef = useRef(new Map<string, string>());

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
      position: { x: 0, y: 0 },
      data: {
        label: deconstructData.rootNode.text,
        type: "root",
        status: "resolved",
      },
    });

    // Assumption positions (exactly 2, side by side)
    const assumptionPositions = [
      { x: -180, y: 250 },
      { x: 180, y: 250 },
    ];

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

      // Progressive reveal: skip locked (future) nodes entirely
      if (status === "locked") return;

      result.push({
        id: assumption.id,
        type: "beliefNode",
        position: assumptionPositions[i] ?? { x: 0, y: 250 },
        data: {
          label: `Hidden View ${String.fromCharCode(65 + i)}`,
          type: "assumption",
          fact: assumption.fact,
          leap: isResolved
            ? (resolvedTexts.get(assumption.id) ?? assumption.leap)
            : assumption.leap,
          status,
          socraticQuestion: assumption.socraticQuestion,
        },
      });

      // Edge from root to assumption
      const rootToEdgeId = `root-${assumption.id}`;
      const edgeStyle = isResolved
        ? { stroke: "var(--leap-resolved)", strokeWidth: 2 }
        : isCurrent
          ? { stroke: "var(--accent)", strokeWidth: 2, strokeDasharray: "6 4" }
          : { stroke: "var(--muted-foreground)", strokeWidth: 1.5, strokeDasharray: "4 4" };

      edgeList.push({
        id: rootToEdgeId,
        source: deconstructData.rootNode.id,
        target: assumption.id,
        style: edgeStyle,
      });

      // Edge from assumption to middle way
      edgeList.push({
        id: `${assumption.id}-middle`,
        source: assumption.id,
        target: "middle-way",
        style: {
          stroke: isResolved ? "var(--leap-resolved)" : "var(--muted-foreground)",
          strokeWidth: isResolved ? 2 : 1.5,
          strokeDasharray: isResolved ? undefined : "4 4",
        },
      });
    });

    // Middle way node
    result.push({
      id: "middle-way",
      type: "beliefNode",
      position: { x: 0, y: 500 },
      data: {
        label: middleWayUnlocked ? middleWayText : "",
        type: "middle-way",
        status: middleWayUnlocked ? "resolved" : "locked",
      },
    });

    return { nodes: result, edges: edgeList };
  }, [deconstructData, resolvedIds, currentAssumptionIndex, middleWayText]);

  const handleDeconstruct = useCallback(async (beliefText: string) => {
    setPhase("loading");
    setBelief(beliefText);

    setMessages((prev) => [
      ...prev,
      { role: "user", text: beliefText },
      { role: "ai", text: "..." },
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

      // Replace loading message with first question — pure Socratic, no meta
      setMessages((prev) => {
        const updated = prev.slice(0, -1);
        const firstQ = data.assumptions[0]?.socraticQuestion;
        updated.push({
          role: "ai",
          text: firstQ,
        });
        return updated;
      });

      setPhase("reflecting");
    } catch {
      setMessages((prev) => {
        const updated = prev.slice(0, -1);
        updated.push({
          role: "ai",
          text: "Sorry, I ran into an error. Please check your API key and try again.",
        });
        return updated;
      });
      setPhase("input");
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: resolvedTextsRef is a ref, stable
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

        setMessages((prev) => [...prev, { role: "ai", text: data.aiResponse }]);

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
                text: nextAssumption.socraticQuestion,
              },
            ]);
            setPhase("reflecting");
          } else {
            // All assumptions resolved — fetch Middle Way synthesis
            setCurrentAssumptionIndex(nextIndex);
            resolveAssumption(current.id);
            const resolvedAssumptions = deconstructData.assumptions.map((a) => {
              const resolvedText = resolvedTextsRef.current.get(a.id) ?? "";
              return { fact: a.fact, originalLeap: a.leap, resolvedText };
            });
            const synRes = await fetch("/api/synthesize", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                rootBelief: deconstructData.rootNode.text,
                resolvedAssumptions,
              }),
            });
            const synData: SynthesizeResponse = await synRes.json();
            setMiddleWayText(synData.middleWay);
            setMindState("untangled");
            setMessages((prev) => [
              ...prev,
              {
                role: "ai",
                text: synData.middleWay,
              },
            ]);
            setPhase("complete");
          }
        } else if (data.nextAction === "pushback") {
          // Stay on same node, deeper question
          setPhase("reflecting");
        } else if (data.nextAction === "complete") {
          // Direct unlock — fetch Middle Way synthesis
          resolveAssumption(current.id);
          resolvedTextsRef.current.set(current.id, data.resolvedText);
          setCurrentAssumptionIndex(deconstructData.assumptions.length);
          const resolvedAssumptions = deconstructData.assumptions.map((a) => {
            const resolvedText = resolvedTextsRef.current.get(a.id) ?? "";
            return { fact: a.fact, originalLeap: a.leap, resolvedText };
          });
          const synRes = await fetch("/api/synthesize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              rootBelief: deconstructData.rootNode.text,
              resolvedAssumptions,
            }),
          });
          const synData: SynthesizeResponse = await synRes.json();
          setMiddleWayText(synData.middleWay);
          setMindState("untangled");
          setMessages((prev) => [
            ...prev,
            {
              role: "ai",
              text: synData.middleWay,
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
    return `Looking at: ${current.fact.length > 40 ? `${current.fact.slice(0, 40)}...` : current.fact}`;
  }, [phase, deconstructData, currentAssumptionIndex]);

  // Determine distortion warning
  const distortionWarning = useMemo(() => {
    if (phase === "complete") return undefined;
    if (!deconstructData) return undefined;
    const current = deconstructData.assumptions[currentAssumptionIndex];
    if (!current) return undefined;
    return `Looking at a big jump: "${current.leap}"`;
  }, [phase, deconstructData, currentAssumptionIndex]);

  return (
    <div className="h-screen flex flex-col">
      <Header mindState={mindState} />

      {/* Belief Input Overlay */}
      {phase === "input" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/85 backdrop-blur-md">
          <div
            className="bg-[var(--card)] border border-[var(--border)] p-8 max-w-lg w-full mx-4"
            style={{ borderRadius: "8px" }}
          >
            <h1
              className="text-[clamp(2rem,5vw,3.25rem)] tracking-[-0.02em] leading-[1.1] text-balance mb-2"
              style={{
                fontFamily: "var(--font-newsreader)",
                fontStyle: "italic",
                color: "var(--foreground)",
              }}
            >
              What do you believe?
            </h1>
            <p
              className="text-[14px] max-w-prose mb-6"
              style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-geist)" }}
            >
              Share a thought you feel sure about — something black and white. We'll explore it step
              by step.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.elements.namedItem("beliefInput") as HTMLInputElement;
                const text = input.value.trim();
                if (text) handleDeconstruct(text);
              }}
            >
              <textarea
                name="beliefInput"
                rows={3}
                placeholder='"Capitalism is pure evil." or "I will never be good enough."'
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-4 py-3 text-[14px] resize-none outline-none transition-[border-color] duration-150 ease-out focus:border-[var(--accent)]"
                style={{
                  color: "var(--foreground)",
                  fontFamily: "var(--font-geist)",
                  borderRadius: "6px",
                }}
              />
              <button
                type="submit"
                className="mt-4 w-full bg-[var(--accent)] text-[var(--accent-foreground)] text-[14px] font-medium rounded-md py-3 transition-[transform] duration-150 ease-out hover:-translate-y-[0.5px] active:translate-y-0 active:scale-[0.99]"
                style={{
                  fontFamily: "var(--font-geist)",
                  borderRadius: "6px",
                }}
              >
                Look Closer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {phase === "loading" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/60 backdrop-blur-sm">
          <div className="text-center">
            <div
              className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
              style={{
                borderColor: "var(--accent)",
                borderTopColor: "transparent",
              }}
            />
            <p className="text-[var(--foreground)] text-sm">Thinking...</p>
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
          onAutoFill={phase === "reflecting" ? handleAutoFill : undefined}
        />
        <GraphCanvas nodes={nodes} edges={edges} />
      </main>
    </div>
  );
}
