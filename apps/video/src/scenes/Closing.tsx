import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ShaderPerlinNoise } from "@/components/remocn/shader-perlin-noise";
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";

export function Closing() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ctaS = spring({ fps, frame: frame - 45, config: { damping: 14, mass: 0.5 } });
  const ctaO = interpolate(ctaS, [0, 1], [0, 1]);
  const ctaY = (1 - ctaS) * 20;

  const urlO = interpolate(frame, [100, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <ShaderPerlinNoise
        speed={0.2}
        colorBack="#0a0a0a"
        colorFront="#1a1425"
        proportion={0.35}
        softness={0.12}
      />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <SoftBlurIn text="Think Clearly." blur={10} fontSize={88} fontWeight={800} color="#f0ece4" />
        <div style={{ height: 24 }} />
        <p
          style={{
            fontSize: 18,
            color: "#8a8578",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: 480,
            margin: 0,
            opacity: ctaO,
            transform: `translateY(${ctaY}px)`,
          }}
        >
          Deconstruct rigid beliefs. Find the middle way.
        </p>
        <div style={{ height: 48 }} />
        <div style={{ opacity: ctaO, transform: `translateY(${ctaY}px)` }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 40px",
              backgroundColor: "rgba(212,168,87,0.9)",
              borderRadius: 8,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 600, color: "#0a0a0a", letterSpacing: "0.02em" }}>
              Try Socrates AI
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5">
              <title>Arrow</title>
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </div>
        <div style={{ height: 32 }} />
        <div style={{ opacity: urlO }}>
          <p style={{ fontSize: 13, color: "#5a5548", fontFamily: "monospace", letterSpacing: "0.08em", margin: 0 }}>
            socrates-ai.vercel.app
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
