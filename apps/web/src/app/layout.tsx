import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Databuddy } from "@databuddy/sdk";
import opengraph from "./opengraph.png";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "relaykit.co",
  description:
    "Stop losing feedback in Slack threads. Ship 31% faster by letting your designers and engineers focus on their job, instead of hunting screenshots.",
  keywords: [
    "design feedback",
    "product development",
    "team collaboration",
    "slack alternative",
  ],
  authors: [{ name: "relaykit" }],
  creator: "relaykit",
  publisher: "relaykit",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://relaykit.co",
    title: "Waitlist | relaykit.co",
    description:
      "Stop losing feedback in Slack threads. Ship 31% faster by letting your designers and engineers focus on their job, instead of hunting screenshots.",
    siteName: "relaykit.co",
    images: [
      {
        url: opengraph.src,
        width: opengraph.width,
        height: opengraph.height,
        alt: "relaykit - Stop losing feedback in Slack threads",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Waitlist | relaykit.co",
    description:
      "Stop losing feedback in Slack threads. Ship 31% faster by letting your designers and engineers focus on their job, instead of hunting screenshots.",
    images: [
      {
        url: opengraph.src,
        width: opengraph.width,
        height: opengraph.height,
        alt: "relaykit - Stop losing feedback in Slack threads",
      },
    ],
    creator: "@relaykit",
    site: "@relaykit",
  },
  alternates: {
    canonical: "https://relaykit.co",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "relaykit",
              url: "https://relaykit.co",
              logo: "https://relaykit.co/logo.png",
              description:
                "Stop losing feedback in Slack threads. Ship 31% faster by letting your designers and engineers focus on their job, instead of hunting screenshots.",
              sameAs: ["https://x.com/relaykit"],
            }),
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <Toaster />
          {children}
          <Databuddy
            clientId="aam1guvf-79SAWEPQUmJI"
            trackInteractions={true}
            trackScrollDepth={true}
            trackBounceRate={true}
            enableBatching={true}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
