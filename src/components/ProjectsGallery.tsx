"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Github,
  Star,
  Calendar,
  User,
} from "lucide-react";

export type ProjectItem = {
  id: string;
  title: string;
  summary: string;
  role: string;
  year: number;
  tech: string[];
  thumbnail: string;
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  impactScore?: number;
};

export type ProjectsGalleryProps = {
  projects?: ProjectItem[];
  className?: string;
};

// Memoize project card for better performance
const ProjectCard = React.memo(({ project, index }: { project: ProjectItem; index: number }) => (
  <Card className="group relative overflow-hidden bg-gradient-to-br from-card to-card/90 border-border/60 hover:border-accent/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
    <CardHeader className="p-3 sm:p-4 space-y-2 sm:space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            {project.featured && (
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-accent fill-current flex-shrink-0" />
            )}
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-foreground truncate">
              {project.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{project.role}</span>
            <Calendar className="h-3 w-3 flex-shrink-0 ml-auto" />
            <span>{project.year}</span>
          </div>
        </div>
      </div>
    </CardHeader>

    <CardContent className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4">
      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">
        {project.summary}
      </p>

      <div className="flex flex-wrap gap-1 sm:gap-2">
        {project.tech.slice(0, 4).map((tech) => (
          <Badge
            key={tech}
            variant="secondary"
            className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-secondary/60 hover:bg-secondary/80 transition-colors"
          >
            {tech}
          </Badge>
        ))}
        {project.tech.length > 4 && (
          <Badge variant="outline" className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
            +{project.tech.length - 4}
          </Badge>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        {project.liveUrl && (
          <Button
            asChild
            size="sm"
            className="flex-1 h-7 sm:h-8 text-xs bg-primary hover:bg-primary/90 transition-colors"
          >
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="hidden sm:inline">Live Demo</span>
              <span className="sm:hidden">Demo</span>
            </a>
          </Button>
        )}
        {project.repoUrl && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 h-7 sm:h-8 text-xs border-border/60 hover:border-accent/50 transition-colors"
          >
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5"
            >
              <Github className="h-3 w-3" />
              <span className="hidden sm:inline">Code</span>
              <span className="sm:hidden">Code</span>
            </a>
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
));

ProjectCard.displayName = "ProjectCard";

const sampleProjects: ProjectItem[] = [
  {
    id: "p1",
    title: "AI Chatbot",
    summary: "Intelligent conversational AI chatbot with advanced natural language processing capabilities.",
    role: "Full Stack AI Developer",
    year: 2024,
    tech: ["Next.js", "TypeScript", "OpenAI", "Tailwind", "Vercel", "AI/ML"],
    thumbnail: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1200&auto=format&fit=crop",
    liveUrl: "https://new-git-fix-question-mark-issue-abdullas-projects-eced2102.vercel.app/",
    repoUrl: "https://github.com/Abdulla090/ai-chatbot",
    featured: true,
    impactScore: 95,
  },
  {
    id: "p2",
    title: "AI Healthcare Platform",
    summary: "Comprehensive healthcare platform with AI-powered diagnostics, patient management, and telemedicine features.",
    role: "Healthcare AI Developer",
    year: 2024,
    tech: ["React", "TypeScript", "Medical AI", "Node.js", "MongoDB", "WebRTC"],
    thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1200&auto=format&fit=crop",
    liveUrl: "https://nestro-health-rho.vercel.app/",
    repoUrl: "https://github.com/Abdulla090/ai-healthcare",
    featured: true,
    impactScore: 92,
  },
  {
    id: "p3",
    title: "AI Try-It-On (Clothing)",
    summary: "Virtual try-on platform using AI for clothing visualization and personalized fashion recommendations.",
    role: "AI/AR Developer",
    year: 2024,
    tech: ["React", "Computer Vision", "AR", "TensorFlow.js", "WebGL", "AI/ML"],
    thumbnail: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop",
    liveUrl: "https://closet-fusion-suggestions.lovable.app/",
    repoUrl: "https://github.com/Abdulla090/ai-try-it-on",
    featured: true,
    impactScore: 89,
  },
  {
    id: "p4",
    title: "AI-Powered Medical Imaging Analysis",
    summary: "Advanced medical imaging platform with AI analysis for radiology reports, diagnosis assistance, and automated insights.",
    role: "Medical AI Developer",
    year: 2024,
    tech: ["React", "Python", "TensorFlow", "Medical AI", "DICOM", "FastAPI"],
    thumbnail: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=1200&auto=format&fit=crop",
    liveUrl: "https://medai-insight-reports.lovable.app/",
    repoUrl: "https://github.com/Abdulla090/medical-imaging-ai",
    featured: false,
    impactScore: 94,
  },
];

export default function ProjectsGallery({
  projects,
  className = "",
}: ProjectsGalleryProps) {
  const data = projects && projects.length > 0 ? projects : sampleProjects;

  return (
    <section className={`w-full max-w-none py-8 sm:py-12 lg:py-16 overflow-x-hidden ${className}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-4">
            Explore my latest work in AI development, web applications, and innovative technology solutions.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {data.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
