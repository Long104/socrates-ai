import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "@/components/remocn/backdrop";
import { ShaderMeshGradient } from "@/components/remocn/shader-mesh-gradient";
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";

const SAMPLE = '"Capitalism is pure evil."';

export function BeliefInput() {
  const frame = useCurrentFrame();
  const hintO = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <ShaderMeshGradient
        speed={0.15}
        colors={["#0a0a0a", "#14141f", "#1a1a2e", "#14141f"]}
        distortion={0.4}
        swirl={0.05}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
        }}
      >
        <Backdrop
          fill={{ type: "color", value: "rgba(255,255,255,0.04)" }}
          padding={8}
          radius={1.5}
          shadow="0 20px 60px rgba(0,0,0,0.5)"
        >
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 80px",
            }}
          >
            <SoftBlurIn
              text="What do you believe?"
              blur={8}
              fontSize={48}
              fontWeight={700}
              color="#f0ece4"
            />
            <div style={{ height: 40 }} />
            <div
              style={{
                fontSize: 24,
                color: "#7a7568",
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                opacity: interpolate(frame, [15, 35], [0, 1]),
              }}
            >
              {SAMPLE}
            </div>
            <div style={{ height: 32 }} />
            <div
              style={{
                opacity: hintO,
                fontSize: 12,
                color: "#d4a857",
                fontFamily: "monospace",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Tap to deconstruct &rarr;
            </div>
          </AbsoluteFill>
        </Backdrop>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
