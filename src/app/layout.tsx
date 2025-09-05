import type { Metadata, Viewport } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Abdulla Al-Ansari | Full Stack Developer & AI Solutions Architect",
  description: "Expert full-stack developer specializing in web development, mobile applications, and AI solutions. Building modern, scalable applications with React, Next.js, and cutting-edge technologies.",
  keywords: ["Full Stack Developer", "Web Development", "AI Solutions", "React", "Next.js", "TypeScript", "Mobile Apps"],
  authors: [{ name: "Abdulla Al-Ansari" }],
  creator: "Abdulla Al-Ansari",
  publisher: "Abdulla Al-Ansari",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Abdulla Al-Ansari | Full Stack Developer & AI Solutions Architect",
    description: "Expert full-stack developer specializing in web development, mobile applications, and AI solutions.",
    siteName: "Abdulla Al-Ansari Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdulla Al-Ansari | Full Stack Developer & AI Solutions Architect",
    description: "Expert full-stack developer specializing in web development, mobile applications, and AI solutions.",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//slelguoygbfzlpylpxfs.supabase.co" />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <main className="relative">
          {children}
        </main>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
