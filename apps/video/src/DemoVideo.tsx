import { AbsoluteFill, Sequence } from "remotion";
import { AppDemo } from "./scenes/AppDemo";
import { BeliefInput } from "./scenes/BeliefInput";
import { Closing } from "./scenes/Closing";
import { MiddleWay } from "./scenes/MiddleWay";
import { Opening } from "./scenes/Opening";

export function DemoVideo() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <Sequence from={0} durationInFrames={60}>
        <Opening />
      </Sequence>
      <Sequence from={40} durationInFrames={90}>
        <BeliefInput />
      </Sequence>
      <Sequence from={110} durationInFrames={180}>
        <AppDemo />
      </Sequence>
      <Sequence from={260} durationInFrames={150}>
        <MiddleWay />
      </Sequence>
      <Sequence from={380} durationInFrames={160}>
        <Closing />
      </Sequence>
    </AbsoluteFill>
  );
}
