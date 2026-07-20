"use client";

import { Background, type BackgroundVariant, type Edge, type Node, ReactFlow } from "@xyflow/react";
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
      style: { stroke: "var(--border)", strokeWidth: 1.5, strokeDasharray: "4 4" },
      animated: false,
    }),
    []
  );

  return (
    <section className="flex-1 relative flex items-center justify-center overflow-hidden">
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
      >
        <Background variant={"dots" as BackgroundVariant} gap={24} size={1} color="var(--border)" />
      </ReactFlow>
    </section>
  );
}
