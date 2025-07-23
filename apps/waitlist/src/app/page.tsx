import Footer from "@/components/footer";
import Hero from "@/components/marketing/hero";
import Roadmap from "@/components/roadmap";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <Hero />
      <div className="h-4 sm:h-6 border-b" />
      <Roadmap />
      <div className="h-4 sm:h-6 border-t" />
      <Footer />
    </div>
  );
}
