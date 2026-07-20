import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const CHAT_W = 720;

const chat = [
  {
    role: "ai",
    text: "Let's explore what you mean. What evidence do you have that capitalism is purely evil?",
  },
  { role: "user", text: "It exploits workers and destroys the environment." },
  {
    role: "ai",
    text: "Those are real harms. Are there cases where capitalism has lifted people out of poverty?",
  },
  { role: "user", text: "I suppose... in some countries it has." },
  { role: "ai", text: "So the picture might be more complex than purely evil?" },
];

function ChatBubble({
  msg,
  idx,
  visible,
}: { msg: { role: string; text: string }; idx: number; visible: boolean }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: frame - 20 - idx * 28, config: { damping: 18, mass: 0.4 } });
  const o = interpolate(s, [0, 1], [0, 1]);
  const y = (1 - s) * 16;

  if (!visible) return null;

  return (
    <div
      style={{
        opacity: o,
        transform: `translateY(${y}px)`,
        marginBottom: 14,
        maxWidth: msg.role === "user" ? "80%" : "100%",
        alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
      }}
    >
      {msg.role === "ai" && (
        <div
          style={{
            fontSize: 10,
            color: "#6b6575",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 4,
            marginLeft: 14,
          }}
        >
          Socrates AI
        </div>
      )}
      <div
        style={{
          backgroundColor: msg.role === "user" ? "rgba(212,168,87,0.1)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${msg.role === "user" ? "rgba(212,168,87,0.2)" : "rgba(255,255,255,0.06)"}`,
          borderRadius: 14,
          padding: "10px 18px",
          fontSize: msg.role === "ai" ? 18 : 14,
          lineHeight: 1.55,
          color: "#e8e0d0",
          fontFamily: msg.role === "ai" ? "Georgia, serif" : "system-ui, sans-serif",
          fontStyle: msg.role === "ai" ? "italic" : "normal",
        }}
      >
        {msg.text}
      </div>
    </div>
  );
}

function NodeCard({
  title,
  label,
  statusColor,
  children,
}: { title: string; label: string; statusColor: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: "rgba(28,26,38,0.95)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          backgroundColor: "rgba(255,255,255,0.02)",
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: "#6b6575",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontSize: 10,
            color: statusColor,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
      <div style={{ padding: "10px 14px" }}>{children}</div>
    </div>
  );
}

function GraphColumn({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const rootS = spring({ fps, frame: frame - 10, config: { damping: 16, mass: 0.5 } });
  const aS = spring({ fps, frame: frame - 30, config: { damping: 14, mass: 0.6 } });
  const bS = spring({ fps, frame: frame - 50, config: { damping: 14, mass: 0.6 } });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
      <div style={{ opacity: rootS, transform: `translateY(${(1 - rootS) * 20}px)` }}>
        <NodeCard title="Core Thought" label="Start" statusColor="#6b6575">
          <p
            style={{
              fontSize: 18,
              color: "#e8e0d0",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              margin: 0,
              whiteSpace: "pre-line",
            }}
          >
            &ldquo;Capitalism is pure evil&rdquo;
          </p>
        </NodeCard>
      </div>
      <div
        style={{
          opacity: interpolate(rootS, [0, 1], [0, 1]),
          width: 2,
          height: 24,
          backgroundColor: "rgba(255,255,255,0.1)",
        }}
      />
      <div style={{ display: "flex", gap: 32 }}>
        <div style={{ opacity: aS, transform: `translateY(${(1 - aS) * 20}px)` }}>
          <NodeCard title="Hidden View A" label="Examining" statusColor="#d4a857">
            <div>
              <div
                style={{
                  fontSize: 8,
                  color: "#6b6575",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Fact
              </div>
              <p style={{ fontSize: 11, color: "#c8c0cc", margin: "0 0 8px" }}>
                Capitalism creates wealth inequality
              </p>
              <div
                style={{
                  fontSize: 8,
                  color: "#d4a857",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Leap
              </div>
              <p style={{ fontSize: 11, color: "#e8e0d0", margin: 0 }}>
                Therefore it has no redeeming qualities
              </p>
            </div>
          </NodeCard>
        </div>
        <div style={{ opacity: bS, transform: `translateY(${(1 - bS) * 20}px)` }}>
          <NodeCard title="Hidden View B" label="Locked" statusColor="#6b6575">
            <p style={{ fontSize: 12, color: "#5a5548", fontStyle: "italic", margin: 0 }}>
              Resolve Hidden View A first&hellip;
            </p>
          </NodeCard>
        </div>
      </div>
    </div>
  );
}

export function AppDemo() {
  const frame = useCurrentFrame();
  const gO = interpolate(frame, [0, 20], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#100e18" }}>
      <div
        style={{
          height: 48,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 10,
        }}
      >
        <span style={{ color: "#e8e0d0", fontSize: 14, fontWeight: 600 }}>Socrates AI</span>
        <span
          style={{
            color: "#6b6575",
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          &mdash; Think Clearly
        </span>
      </div>
      <AbsoluteFill style={{ top: 48, display: "flex", flexDirection: "row" }}>
        <div
          style={{
            width: CHAT_W,
            borderRight: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(16,14,24,0.95)",
          }}
        >
          <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span
              style={{
                fontSize: 10,
                color: "#6b6575",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Conversation
            </span>
          </div>
          <div style={{ flex: 1, padding: "14px 20px", display: "flex", flexDirection: "column" }}>
            {chat.map((msg, i) => (
              <ChatBubble key={i} msg={msg} idx={i} visible={frame > 15 + i * 28} />
            ))}
          </div>
          <div style={{ padding: "10px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: "#5a5548",
              }}
            >
              Type your response here...
            </div>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: gO,
          }}
        >
          <GraphColumn frame={frame} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
