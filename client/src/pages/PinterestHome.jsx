import React from "react";
import PinterestNavbar from "../components/layout/PinterestNavbar";
import MasonryGrid from "../components/common/MasonryGrid";

const PinterestHome = () => {
  const data = [
    { title: "Neural Synthesis", category: "AI Core", desc: "Advanced technical evaluation engine.", height: "h-64", icon: "🧠" },
    { title: "Quantum IDE", category: "Development", desc: "Live code analysis and optimization.", height: "h-96", icon: "💻" },
    { title: "Stream Pulse", category: "Audio", desc: "Real-time verbal synthesis stream.", height: "h-72", icon: "🎙️" },
    { title: "Global Mesh", category: "Market", desc: "Regional technical context mapping.", height: "h-80", icon: "🌍" },
    { title: "Visual Logic", category: "Analytics", desc: "Dynamic skill radar charts.", height: "h-64", icon: "📊" },
    { title: "Resume Link", category: "Knowledge", desc: "Intelligent PDF skill extraction.", height: "h-96", icon: "📄" },
    { title: "Adaptive Flow", category: "Logic", desc: "Custom deep-dive follow-up questions.", height: "h-72", icon: "⛓️" },
    { title: "Data Export", category: "Reporting", desc: "Professional PDF proficiency logs.", height: "h-80", icon: "📤" },
    { title: "Binary Core", category: "System", desc: "Low-latency neural processing unit.", height: "h-64", icon: "🔢" },
    { title: "UX Refraction", category: "Design", desc: "Modern liquid glass interface patterns.", height: "h-96", icon: "✨" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pb-20">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px]"></div>
      </div>

      <PinterestNavbar />

      <main className="pt-32">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Explore the Grid</h1>
          <p className="text-slate-500 font-medium uppercase tracking-[0.3em] text-[10px]">Unified Neural Interface 1.5</p>
        </div>

        <MasonryGrid items={data} />
      </main>
    </div>
  );
};

export default PinterestHome;
