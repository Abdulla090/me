"use client";

import * as React from "react";
import { toast } from "sonner";
import { Mail, Calendar, Loader2, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContactSectionProps {
  apiEndpoint?: string;
  email?: string;
  calendlyUrl?: string;
  title?: string;
  subtitle?: string;
  subjects?: string[];
}

type FormErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  general?: string;
};

export default function ContactSection({
  apiEndpoint,
  email = "abdullaazizb58@gmail.com",
  calendlyUrl = "https://calendly.com/yourname/intro",
  title = "Let's build something great",
  subtitle = "Tell me a bit about your project. I typically reply within one business day.",
  subjects = ["General inquiry", "Project proposal", "Consulting", "Speaking", "Other"]
}: ContactSectionProps) {
  const [name, setName] = React.useState("");
  const [emailValue, setEmailValue] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [honeypot, setHoneypot] = React.useState("");
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const formId = React.useId();

  const resetForm = () => {
    setName("");
    setEmailValue("");
    setSubject("");
    setMessage("");
    setHoneypot("");
    setErrors({});
  };

  const validateEmail = (val: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  const validateAll = (): FormErrors => {
    const next: FormErrors = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!emailValue.trim()) next.email = "Please enter your email.";else
    if (!validateEmail(emailValue.trim())) next.email = "Please enter a valid email address.";
    if (!subject) next.subject = "Please choose a subject.";
    if (!message.trim() || message.trim().length < 10) next.message = "Please provide a few details (at least 10 characters).";
    return next;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, general: undefined }));

    if (honeypot && honeypot.trim().length > 0) {
      toast.error("Verification failed. Please try again.");
      setErrors({ general: "Spam detected." });
      return;
    }

    const v = validateAll();
    setErrors(v);
    if (Object.keys(v).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("email", emailValue.trim());
      fd.append("subject", subject);
      fd.append("message", message.trim());

      if (apiEndpoint) {
        const res = await fetch(apiEndpoint, {
          method: "POST",
          body: fd,
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || "Failed to send your message.");
        }
      } else {
        await new Promise((resolve, reject) => {
          window.setTimeout(() => {
            const ok = Math.random() > 0.12;
            if (ok) resolve(true);else
            reject(new Error("Network error. Please try again."));
          }, 1000 + Math.random() * 600);
        });
      }

      toast.success("Message sent! I'll get back to you shortly.");
      resetForm();
    } catch (err: any) {
      const msg = err?.message || "Something went wrong. Please try again.";
      setErrors({ general: msg });
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success("Email copied to clipboard");
    } catch {
      toast.error("Could not copy. Please copy it manually.");
    }
  };

  return (
    <section aria-labelledby={`${formId}-title`} className="bg-background">
      <div className="container mx-auto max-w-4xl py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
              <div className="p-4 sm:p-6 lg:p-8">
                <h2 id={`${formId}-title`} className="mb-2 text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight">
                  {title}
                </h2>
                <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground">
                  {subtitle}
                </p>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="relative space-y-4 sm:space-y-5"
                  aria-describedby={errors.general ? `${formId}-general-error` : undefined}>

                  <div className="absolute -z-10 h-0 w-0 overflow-hidden opacity-0">
                    <label htmlFor={`${formId}-company`}>Company</label>
                    <input
                      tabIndex={-1}
                      id={`${formId}-company`}
                      name="company"
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)} />
                  </div>

                  {errors.general &&
                  <div id={`${formId}-general-error`} role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">
                      {errors.general}
                    </div>
                  }

                  <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`${formId}-name`}>Name <span className="text-primary">*</span></Label>
                      <Input
                        id={`${formId}-name`}
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        aria-required="true"
                        aria-invalid={!!errors.name}
                        disabled={isSubmitting} />
                      {errors.name && <p role="alert" className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${formId}-email`}>Email <span className="text-primary">*</span></Label>
                      <Input
                        id={`${formId}-email`}
                        type="email"
                        placeholder="you@example.com"
                        value={emailValue}
                        onChange={(e) => {
                          setEmailValue(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        aria-required="true"
                        aria-invalid={!!errors.email}
                        disabled={isSubmitting} />
                      {errors.email && <p role="alert" className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-subject`}>Subject <span className="text-primary">*</span></Label>
                    <Select
                      value={subject}
                      onValueChange={(val) => {
                        setSubject(val);
                        if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
                      }}
                      disabled={isSubmitting}>
                      <SelectTrigger id={`${formId}-subject`} aria-required="true" aria-invalid={!!errors.subject}>
                        <SelectValue placeholder="Choose a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.subject && <p role="alert" className="text-sm text-destructive">{errors.subject}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-message`}>Message <span className="text-primary">*</span></Label>
                    <Textarea
                      id={`${formId}-message`}
                      placeholder="Share a brief about your goals..."
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                      }}
                      rows={4}
                      aria-required="true"
                      aria-invalid={!!errors.message}
                      disabled={isSubmitting} />
                    {errors.message && <p role="alert" className="text-sm text-destructive">{errors.message}</p>}
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />} 
                    {isSubmitting ? "Sending..." : "Send message"}
                  </Button>
                </form>
              </div>

              <div className="border-t md:border-l md:border-t-0 bg-muted/30">
                <div className="h-full p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
                  <h3 className="text-lg sm:text-xl font-semibold">Quick Contact</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Prefer not to use the form? No problem.</p>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a href={`mailto:${email}`} className="text-sm sm:text-base font-medium truncate hover:underline">{email}</a>
                      </div>
                      <Button variant="ghost" size="icon" aria-label="Copy email" onClick={copyEmail}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-muted-foreground">Schedule a Call</p>
                        <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base font-medium truncate hover:underline">Book a time on Calendly</a>
                      </div>
                      <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" aria-label="Schedule a call">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </section>
  );
}