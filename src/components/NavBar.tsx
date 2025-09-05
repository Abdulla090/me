"use client";

import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Button
} from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  Input
} from "@/components/ui/input";
import {
  Label
} from "@/components/ui/label";
import {
  Textarea
} from "@/components/ui/textarea";
import {
  Menu,
  Download,
  Mail,
  ChevronRight
} from "lucide-react";

type AnchorItem = { id: string; label: string };

export interface NavBarProps {
  name?: string;
  logoSrc?: string;
  resumeUrl?: string;
  anchors?: AnchorItem[];
}

const DEFAULT_ANCHORS: AnchorItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function NavBar({
  name = "Abdulla",
  logoSrc,
  resumeUrl = "/resume.pdf",
  anchors = DEFAULT_ANCHORS,
}: NavBarProps) {
  const navRef = useRef<HTMLElement | null>(null);
  const [entered, setEntered] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Sheets state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Contact form state
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  // Mount effects - optimized with throttling
  useEffect(() => {
    setEntered(true);
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 12);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Smooth scroll to anchors with offset for sticky nav
  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (!el) return;

      const navHeight = navRef.current?.offsetHeight ?? 0;
      const y = el.getBoundingClientRect().top + window.scrollY - (navHeight + 12);

      window.scrollTo({ top: y, behavior: "smooth" });
      setMobileOpen(false);
    },
    []
  );

  // Validate contact form
  const validate = useCallback(() => {
    const nextErrors: typeof errors = {};
    if (!form.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      nextErrors.email = "Please enter your email.";
    } else if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!form.message.trim()) {
      nextErrors.message = "Please write a short message.";
    } else if (form.message.trim().length < 10) {
      nextErrors.message = "Message should be at least 10 characters.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [form, errors]);

  const submitContact = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors and try again.");
      return;
    }
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 1200 + Math.random() * 600));
      toast.success("Message sent! I'll get back to you soon.");
      setContactOpen(false);
      setForm({ name: "", email: "", message: "" });
      setErrors({});
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const messagePreview = useMemo(() => {
    if (!form.message.trim()) return "Your AI project details will appear here.";
    return form.message.trim().length > 120
      ? form.message.trim().slice(0, 120) + "…"
      : form.message.trim();
  }, [form.message]);

  return (
    <TooltipProvider delayDuration={200}>
      <nav
        ref={navRef as React.RefObject<HTMLElement>}
        role="navigation"
        aria-label="Primary"
        className={[
          "fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-out",
          entered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3",
        ].join(" ")}
      >
        <div
          className={[
            "w-full max-w-none",
            "flex items-center justify-between gap-2 sm:gap-4",
            "h-14 sm:h-16 lg:h-18",
            "bg-gradient-to-r from-secondary/90 via-secondary/85 to-secondary/90",
            "backdrop-blur-md supports-[backdrop-filter]:backdrop-blur-xl",
            "border-b transition-all duration-300 px-3 sm:px-6 lg:px-8",
            scrolled 
              ? "border-border/90 shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-opacity-95" 
              : "border-border/50 shadow-[0_4px_16px_rgba(0,0,0,0.2)]",
            "rounded-none",
          ].join(" ")}
          style={{ 
            backgroundColor: scrolled 
              ? "color-mix(in oklab, var(--secondary) 95%, black 0%)" 
              : "color-mix(in oklab, var(--secondary) 88%, black 0%)"
          }}
        >
          {/* Left: Logo */}
          <a
            href="#home"
            onClick={(e) => handleAnchorClick(e, "home")}
            className="group inline-flex items-center gap-2 sm:gap-3 min-w-0 focus-visible:outline-none 
                     focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 
                     focus-visible:ring-offset-background rounded-lg sm:rounded-xl p-1 sm:p-1.5 transition-all duration-200
                     hover:scale-105 active:scale-95"
            aria-label={`${name} Home`}
          >
            <span className="font-heading text-sm sm:text-base lg:text-lg tracking-tight text-foreground 
                           group-hover:text-primary transition-colors duration-200 font-semibold truncate">
              Abdulla
            </span>
          </a>

          {/* Center: Nav links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 flex-1 justify-center max-w-2xl mx-auto">
            {anchors.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleAnchorClick(e, item.id)}
                className={[
                  "relative px-3 xl:px-4 py-2 xl:py-2.5 rounded-lg xl:rounded-xl text-sm font-medium",
                  "text-foreground/80 hover:text-foreground hover:bg-secondary/60",
                  "transition-all duration-300 ease-out",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  "hover:scale-105 active:scale-95",
                  "before:absolute before:inset-x-0 before:-bottom-1 before:h-0.5 before:bg-gradient-to-r before:from-primary before:to-accent",
                  "before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100",
                ].join(" ")}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
            {/* Resume button */}
            {resumeUrl ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="secondary"
                    className="hidden md:inline-flex gap-1.5 sm:gap-2.5 rounded-lg sm:rounded-xl hover:scale-105 active:scale-95 
                             transition-all duration-200 font-medium px-2.5 sm:px-4 py-1.5 sm:py-2.5 shadow-md hover:shadow-lg text-sm
                             bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary/80 h-8 sm:h-auto"
                  >
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Download resume"
                    >
                      <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                      <span className="hidden lg:inline">Resume</span>
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-popover text-popover-foreground border-border/60">
                  Download my resume
                </TooltipContent>
              </Tooltip>
            ) : null}

            {/* Hire me button */}
            <Button
              onClick={() => setContactOpen(true)}
              className="rounded-lg sm:rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 
                       font-medium px-2.5 sm:px-5 py-1.5 sm:py-2.5 shadow-lg hover:shadow-xl text-xs sm:text-sm h-8 sm:h-auto
                       bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
            >
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Hire me</span>
              <span className="sm:hidden">Hire</span>
            </Button>

            {/* Mobile menu trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="lg:hidden h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl hover:bg-muted/80 focus-visible:ring-2 
                           focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
                           transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-gradient-to-br from-popover to-popover/95 text-popover-foreground border-border/60 w-[280px] sm:w-[320px]">
                <SheetHeader>
                  <SheetTitle className="font-heading text-lg sm:text-xl">Navigation</SheetTitle>
                  <SheetDescription className="text-sm">Quick access to all sections and actions</SheetDescription>
                </SheetHeader>
                <div className="mt-6 sm:mt-8 flex flex-col gap-1 sm:gap-2">
                  {anchors.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => handleAnchorClick(e, item.id)}
                      className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium text-foreground/90 
                               hover:text-foreground hover:bg-muted/80 transition-all duration-200 
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
                <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-2 sm:gap-3">
                  {resumeUrl ? (
                    <Button asChild variant="secondary" className="w-full rounded-lg sm:rounded-xl py-2.5 sm:py-3">
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Download resume"
                      >
                        <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                        Download Resume
                      </a>
                    </Button>
                  ) : null}
                  <Button className="w-full rounded-lg sm:rounded-xl py-2.5 sm:py-3" onClick={() => setContactOpen(true)}>
                    <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                    Get In Touch
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Contact sheet */}
            <Sheet open={contactOpen} onOpenChange={setContactOpen}>
              <SheetContent
                side="right"
                className="bg-gradient-to-br from-popover to-popover/95 text-popover-foreground 
                         w-[95vw] max-w-lg sm:max-w-xl border-border/60"
                aria-describedby="contact-description"
              >
                <SheetHeader>
                  <SheetTitle className="font-heading text-lg sm:text-xl">Let's Collaborate</SheetTitle>
                  <SheetDescription id="contact-description" className="text-sm sm:text-base">
                    Share your AI training needs and project details. I'll respond within 24 hours with tailored insights.
                  </SheetDescription>
                </SheetHeader>
                <form className="mt-6 sm:mt-8 grid gap-4 sm:gap-5" onSubmit={submitContact}>
                  <div className="grid gap-2">
                    <Label htmlFor="contact-name" className="text-sm font-semibold">Your Name</Label>
                    <Input
                      id="contact-name"
                      placeholder="Alex Johnson"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className="rounded-lg sm:rounded-xl border-border/60 focus:border-primary/50 py-2.5 sm:py-3"
                    />
                    {errors.name ? (
                      <p id="name-error" className="text-sm text-destructive font-medium">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contact-email" className="text-sm font-semibold">Email Address</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="alex@company.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className="rounded-lg sm:rounded-xl border-border/60 focus:border-primary/50 py-2.5 sm:py-3"
                    />
                    {errors.email ? (
                      <p id="email-error" className="text-sm text-destructive font-medium">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contact-message" className="text-sm font-semibold">Project Details</Label>
                    <Textarea
                      id="contact-message"
                      placeholder="Describe your AI training requirements, timeline, and specific goals..."
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "message-error" : "message-help"}
                      className="rounded-lg sm:rounded-xl border-border/60 focus:border-primary/50 resize-none"
                    />
                    <div className="flex items-center justify-between">
                      {errors.message ? (
                        <p id="message-error" className="text-sm text-destructive font-medium">
                          {errors.message}
                        </p>
                      ) : (
                        <p id="message-help" className="text-sm text-muted-foreground">
                          {form.message.trim().length}/800 characters
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Live preview */}
                  <div className="rounded-lg sm:rounded-xl border border-border/60 bg-gradient-to-br from-secondary/40 to-secondary/20 p-3 sm:p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                      Message Preview
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">{messagePreview}</p>
                  </div>

                  <SheetFooter className="mt-3 sm:mt-4">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-lg sm:rounded-xl py-2.5 sm:py-3 font-semibold transition-all duration-200 
                               hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl
                               bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                    >
                      {submitting ? "Sending Message..." : "Send Message"}
                    </Button>
                  </SheetFooter>
                </form>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
}