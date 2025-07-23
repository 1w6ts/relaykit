import Tunnel from "../tunnel";
import { FadeUpWord } from "../ui/fade-up-word";
import { AnimatedGradient } from "../ui/stripe-animated-gradient";
import Waitlist from "../waitlist";

export default function Hero() {
  return (
    <div className="min-h-[400px] sm:h-[500px] flex flex-col items-center justify-center border-b relative overflow-hidden px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="absolute inset-0 z-0">
        <AnimatedGradient />
      </div>
      <FadeUpWord className="font-semibold text-3xl sm:text-4xl lg:text-5xl tracking-tighter text-center max-w-4xl">
        Stop losing feedback in Slack threads.
      </FadeUpWord>
      <FadeUpWord className="text-sm sm:text-md tracking-tight font-light text-center max-w-2xl mt-4 sm:mt-6">
        Ship 31% faster, by making your designers and engineers, not hunt for
        screenshots.
      </FadeUpWord>
      <div className="mt-6 sm:mt-8">
        <Waitlist />
      </div>
    </div>
  );
}
