"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import HeroSection from "@/components/HeroSection";
import CustomCursor from "@/components/CustomCursor";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";


export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <CustomCursor />
      <LoadingScreen onComplete={() => setLoaded(true)} />
      <main style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease 0.1s" }}>
        <HeroSection started={loaded} />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
