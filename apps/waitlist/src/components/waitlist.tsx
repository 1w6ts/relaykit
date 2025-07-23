import { BlurReveal } from "./ui/blur-reveal";
import { Input } from "./ui/input";
import { StaggerButton } from "./ui/stagger-button";

export default function Waitlist() {
  return (
    <BlurReveal delay={0.4}>
      <div className="mt-8 flex gap-2 items-center">
        <Input className="h-10" placeholder="example@0.email" />
        <StaggerButton className="cursor-pointer">Get me in</StaggerButton>
      </div>
    </BlurReveal>
  );
}
