import Hero from "@/components/Hero";
import About from "@/components/About";
import PhotoMarquee from "@/components/PhotoMarquee";
import Projects from "@/components/Projects";
import Reel from "@/components/Reel";
import Contact from "@/components/Contact";
import ScrollBar from "@/components/ScrollBar";

export default function Home() {
  return (
    <>
      <ScrollBar />
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:bg-ink focus:text-paper focus:px-4 focus:py-2 type-label"
      >
        Skip to work
      </a>
      <main>
        <Hero />
        <Projects />
        <About />
        <PhotoMarquee />
        <Reel />
        <Contact />
      </main>
    </>
  );
}
