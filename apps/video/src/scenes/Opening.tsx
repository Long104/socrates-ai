import { AbsoluteFill } from "remotion";
import { ShaderPerlinNoise } from "@/components/remocn/shader-perlin-noise";
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";

export function Opening() {
  return (
    <AbsoluteFill>
      <ShaderPerlinNoise
        speed={0.3}
        colorBack="#0a0a0a"
        colorFront="#2a1f3d"
        proportion={0.35}
        softness={0.12}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SoftBlurIn
          text="Socrates AI"
          blur={12}
          fontSize={104}
          fontWeight={800}
          color="#f0ece4"
        />
        <div
          style={{
            position: "absolute",
            top: "calc(50% + 70px)",
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: 22,
              color: "#8a8578",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              letterSpacing: "0.02em",
            }}
          >
            The Middle Way
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
