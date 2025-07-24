import Footer from "@/components/footer";
import Hero from "@/components/marketing/hero";
import Roadmap from "@/components/roadmap";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col">
      <div className="border max-w-3xl mx-auto w-full">
        <Hero />
        <div className="h-4 sm:h-6 border-b" />
        <Roadmap />
        <div className="h-4 sm:h-6 border-t" />
        <Footer />
      </div>
    </div>
  );
}
