"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import EasterEggTerminal from "@/components/Terminal";
import Hero from "@/features/hero/Hero";
import About from "@/features/about/About";
import Projects from "@/features/projects/Projects";
import Skills from "@/features/skills/Skills";
import Experience from "@/features/experience/Experience";
import Contact from "@/features/contact/Contact";
import Footer from "@/features/footer/Footer";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <ScrollProgress />
      <EasterEggTerminal />
      <LoadingScreen onComplete={() => setLoaded(true)} />
      <main
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease 0.1s",
        }}
      >
        <Hero started={loaded} />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
        <Footer />
      </main>
      <SmoothScroll />
      <CustomCursor />
      <ScrollProgress />
      <EasterEggTerminal />
      <LoadingScreen onComplete={() => setLoaded(true)} />
      <main
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease 0.1s",
        }}
      >
        <Hero started={loaded} />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
