import type { Metadata } from "next";
import opengraph from "../opengraph.png";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "relaykit.co | Stop losing feedback in Slack.",
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
    title: "Auth | relaykit.co",
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
    <html lang="en">
      <body>
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
        <Navbar />
        {children}
      </body>
    </html>
  );
}
