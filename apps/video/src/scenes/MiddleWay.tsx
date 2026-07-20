import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const MW = "Capitalism isn't purely evil or purely good. It's a system with real costs and real benefits. The question is how to regulate its excesses while preserving its capacity to lift people out of poverty.";

function NodeCard({ title, label, color, children }: { title: string; label: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "rgba(28,26,38,0.95)", border: `1px solid ${color}${label === "Resolved" ? "55" : "15"}`, borderRadius: 8, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", backgroundColor: "rgba(255,255,255,0.02)" }}>
        <span style={{ fontSize: 10, color: "#6b6575", letterSpacing: "0.1em", textTransform: "uppercase" }}>{title}</span>
        <span style={{ fontSize: 10, color, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
      </div>
      <div style={{ padding: "10px 14px" }}>{children}</div>
    </div>
  );
}

export function MiddleWay() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const n0 = spring({ fps, frame: frame - 10, config: { damping: 16, mass: 0.5 } });
  const n1 = spring({ fps, frame: frame - 30, config: { damping: 14, mass: 0.6 } });
  const n2 = spring({ fps, frame: frame - 45, config: { damping: 14, mass: 0.6 } });

  const mwDelay = 70;
  const mwS = spring({ fps, frame: frame - mwDelay, config: { damping: 12, mass: 0.6 } });
  const mwO = interpolate(mwS, [0, 1], [0, 1]);
  const mwScale = interpolate(mwS, [0, 1], [0.3, 1]);
  const mwBlur = interpolate(mwS, [0, 1], [18, 0]);
  const glow = interpolate(mwS, [0, 1], [0, 0.5]);

  const tagO = interpolate(frame, [mwDelay + 25, mwDelay + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0e1210" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 28 }}>
        <div style={{ opacity: n0, transform: `translateY(${(1 - n0) * 20}px)` }}>
          <NodeCard title="Core Thought" label="Start" color="#6b6575">
            <p style={{ fontSize: 16, color: "#e8e0d0", fontFamily: "Georgia, serif", fontStyle: "italic", margin: 0 }}>
              &ldquo;Capitalism is pure evil&rdquo;
            </p>
          </NodeCard>
        </div>
        <div style={{ opacity: interpolate(n0, [0, 1], [0, 1]), width: 2, height: 16, backgroundColor: "rgba(100,200,130,0.3)" }} />
        <div style={{ display: "flex", gap: 40 }}>
          <div style={{ opacity: n1, transform: `translateY(${(1 - n1) * 20}px)` }}>
            <NodeCard title="Hidden View A" label="Resolved" color="#64c882">
              <p style={{ fontSize: 12, color: "#64c882", fontFamily: "Georgia, serif", fontStyle: "italic", margin: 0 }}>
                Not purely evil
              </p>
            </NodeCard>
          </div>
          <div style={{ opacity: n2, transform: `translateY(${(1 - n2) * 20}px)` }}>
            <NodeCard title="Hidden View B" label="Resolved" color="#64c882">
              <p style={{ fontSize: 12, color: "#64c882", fontFamily: "Georgia, serif", fontStyle: "italic", margin: 0 }}>
                Not purely good
              </p>
            </NodeCard>
          </div>
        </div>

        <div style={{ opacity: mwO, width: 2, height: 16, backgroundColor: "rgba(200,220,180,0.3)" }} />

        <div style={{ opacity: mwO, transform: `scale(${mwScale})`, filter: `blur(${mwBlur}px)` }}>
          <div
            style={{
              position: "absolute",
              inset: -50,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(200,220,180,0.12) 0%, transparent 70%)",
              opacity: glow,
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", zIndex: 1, width: 500, backgroundColor: "rgba(18,28,20,0.95)", border: "2px solid rgba(200,220,180,0.25)", borderRadius: 10, boxShadow: "0 0 80px rgba(200,220,180,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 18px", borderBottom: "1px solid rgba(200,220,180,0.08)", backgroundColor: "rgba(200,220,180,0.03)" }}>
              <span style={{ fontSize: 10, color: "#8a9a7a", letterSpacing: "0.1em", textTransform: "uppercase" }}>The Middle Way</span>
              <span style={{ fontSize: 10, color: "#c8d8b0", letterSpacing: "0.1em", textTransform: "uppercase" }}>Resolved</span>
            </div>
            <div style={{ padding: "14px 20px" }}>
              <p style={{ fontSize: 18, lineHeight: 1.55, color: "#e8f0e0", fontFamily: "Georgia, serif", fontStyle: "italic", textAlign: "center", margin: 0 }}>
                &ldquo;{MW}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {tagO > 0 && (
          <div style={{ opacity: tagO, marginTop: 12 }}>
            <p style={{ fontSize: 18, color: "#8a9a7a", fontFamily: "Georgia, serif", fontStyle: "italic", margin: 0 }}>
              A balanced perspective emerges.
            </p>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}
