import Footer from "@/components/footer";
import Hero from "@/components/marketing/hero";
import Roadmap from "@/components/roadmap";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col mx-auto border max-w-4xl">
      <Hero />
      <div className="h-6 border-b" />
      <Roadmap />
      <div className="h-6 border-t" />
      <Footer />
    </div>
  );
}
