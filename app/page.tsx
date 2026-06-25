import HeroSection from "@/components/HeroSection";
import MainSection from "@/components/MainSection";
import ProjectSection from "@/components/ProjectSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      {/* 01F. Main — 돌탑(Hero) + 텍스트 오버레이(Main) 동일 화면 */}
      <div id="main" style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        <HeroSection />
        <MainSection />
      </div>

      <ProjectSection />

      <AboutSection />

      <ContactSection />
    </>
  );
}
