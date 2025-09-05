import NavBar from "@/components/NavBar";
import HeroHeader from "@/components/HeroHeader";
import SkillsShowcase from "@/components/SkillsShowcase";
import ProjectsGallery from "@/components/ProjectsGallery";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="pt-14 sm:pt-16 lg:pt-18">
        <section id="home" className="py-12 sm:py-16 lg:py-20 xl:py-24">
          <HeroHeader avatarSrc="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c3e0b31b-4c52-45f2-895c-ef6cc96ed50e/visual-edit-uploads/1755897908086-86cp2iucrtu.jpg" />
        </section>

        <section id="about" className="border-t border-border/50 py-12 sm:py-16 lg:py-20">
          <div className="container max-w-5xl text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-semibold mb-4 sm:mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              About My Work
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto px-4">
              As a full-stack developer specializing in modern web applications and AI integration, I create 
              innovative digital solutions that transform businesses. From responsive React applications to 
              intelligent AI-powered systems, I combine cutting-edge technology with exceptional user experience 
              to deliver scalable, high-performance web applications that drive real business value.
            </p>
          </div>
        </section>

        <section id="skills" className="border-t border-border/50">
          <SkillsShowcase />
        </section>

        <section id="projects" className="border-t border-border/50">
          <ProjectsGallery />
        </section>

        <section id="contact" className="border-t border-border/50">
          <ContactSection />
        </section>
      </main>

      <Footer
        siteName="Abdulla Portfolio"
        tagline="Full Stack Development & AI Solutions"
        socials={{
          github: "https://github.com/yourusername",
          linkedin: "https://linkedin.com/in/yourusername",
          twitter: "https://twitter.com/yourusername"
        }}
      />
    </div>
  );
}