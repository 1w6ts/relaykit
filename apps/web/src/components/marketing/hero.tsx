import { FadeUpWord } from "@/components/ui/fade-up-word";
import { AnimatedGradient } from "@/components/ui/stripe-animates-gradient";

export default function Hero() {
  return (
    <div className="min-h-[400px] sm:h-[500px] flex flex-col items-center justify-center border-b relative overflow-hidden px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="absolute inset-0 z-0">
        <AnimatedGradient />
      </div>
      <div className="relative z-10 flex flex-col items-center text-center">
        <FadeUpWord className="font-semibold text-2xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tighter">
          Stop losing feedback in Slack threads.
        </FadeUpWord>
        <FadeUpWord className="text-sm sm:text-md tracking-tight font-light mt-2 sm:mt-2 max-w-2xl">
          Ship 31% faster, by making your designers and engineers, not hunt for
          screenshots.
        </FadeUpWord>
      </div>
    </div>
  );
}
