import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import BentoGrid from "@/components/BentoGrid";

export default function Home() {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <Hero />
      
      {/* Skills Section */}
      <Skills />
      
      {/* Bento Grid Section */}
      <BentoGrid />
    </div>
  );
}