export interface BeliefNodeData {
  label: string;
  type: "root" | "assumption" | "middle-way";
  fact?: string;
  leap?: string;
  status: "locked" | "heavy" | "resolved";
  socraticQuestion?: string;
  [key: string]: unknown;
}

export interface DeconstructResponse {
  rootNode: {
    id: string;
    text: string;
    type: "root";
  };
  assumptions: Array<{
    id: string;
    fact: string;
    leap: string;
    socraticQuestion: string;
  }>;
  middleWay: null;
}

export interface ReflectRequest {
  assumption: {
    fact: string;
    leap: string;
    socraticQuestion: string;
  };
  userResponse: string;
}

export interface ReflectResponse {
  factValidated: boolean;
  leapResolved: boolean;
  aiResponse: string;
  resolvedText: string;
  nextAction: "advance" | "pushback" | "complete";
}

export interface ChatMessage {
  role: "ai" | "user";
  text: string;
}

export interface DeconstructRequest {
  belief: string;
}

export interface SynthesizeRequest {
  rootBelief: string;
  resolvedAssumptions: Array<{
    fact: string;
    originalLeap: string;
    resolvedText: string;
  }>;
}

export interface SynthesizeResponse {
  middleWay: string;
}
