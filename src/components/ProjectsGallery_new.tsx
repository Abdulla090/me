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
    <section className={`py-12 sm:py-16 lg:py-20 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore my latest work in AI development, web applications, and innovative technology solutions.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {data.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card via-card to-card/95 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
            {project.title}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {project.summary}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Role and Year */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{project.role}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{project.year}</span>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, 4).map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="text-xs bg-secondary/50 hover:bg-secondary/70 transition-colors"
              >
                {tech}
              </Badge>
            ))}
            {project.tech.length > 4 && (
              <Badge variant="outline" className="text-xs bg-secondary/50">
                +{project.tech.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {project.liveUrl && (
            <Button
              asChild
              className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200"
            >
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            </Button>
          )}
          {project.repoUrl && (
            <Button
              asChild
              variant="outline"
              className="flex-1 hover:bg-secondary/80 transition-colors"
            >
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>Code</span>
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
