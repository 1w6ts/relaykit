import Tunnel from "../tunnel";
import { FadeUpWord } from "../ui/fade-up-word";
import { AnimatedGradient } from "../ui/stripe-animated-gradient";
import Waitlist from "../waitlist";

export default function Hero() {
  return (
    <div className="h-[500px] flex flex-col items-center justify-center border-b relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <AnimatedGradient />
      </div>{" "}
      <FadeUpWord className="font-semibold text-5xl tracking-tighter">
        Stop losing feedback in Slack threads.
      </FadeUpWord>
      <FadeUpWord className="text-md tracking-tight font-light">
        Ship 31% faster, by making your designers and engineers, not hunt for
        screenshots.
      </FadeUpWord>
      <Waitlist />
    </div>
  );
}
