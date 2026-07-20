"use client";

import { Background, Controls, type Edge, type Node, ReactFlow } from "@xyflow/react";
import { useMemo } from "react";
import "@xyflow/react/dist/style.css";

import type { BeliefNodeData } from "@workspace/core";
import BeliefNode from "./belief-node";

interface GraphCanvasProps {
  nodes: Node<BeliefNodeData>[];
  edges: Edge[];
}

const nodeTypes = { beliefNode: BeliefNode };

export default function GraphCanvas({ nodes, edges }: GraphCanvasProps) {
  const defaultEdgeOptions = useMemo(
    () => ({
      style: { stroke: "#475569", strokeWidth: 2 },
      animated: false,
    }),
    []
  );

  return (
    <section className="w-7/12 relative bg-slate-950 flex items-center justify-center overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        nodesDraggable={false}
        nodesConnectable={false}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.5}
        maxZoom={2}
        className="bg-slate-950"
      >
        <Background gap={48} size={1} color="#0f172a" className="opacity-20" />
        <Controls
          showInteractive={false}
          className="[&>button]:bg-slate-900 [&>button]:border-slate-800 [&>button]:text-slate-400"
        />
      </ReactFlow>
    </section>
  );
}
