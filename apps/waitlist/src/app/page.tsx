import Features from "@/components/marketing/features";
import Hero from "@/components/marketing/hero";
import Tunnel from "@/components/tunnel";
import { FadeUpWord } from "@/components/ui/fade-up-word";
import Waitlist from "@/components/waitlist";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col mx-auto border max-w-4xl">
      <Hero />
      <Features />
    </div>
  );
}
