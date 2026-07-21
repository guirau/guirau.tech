import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Bricolage_Grotesque } from "next/font/google";
import { site } from "@/lib/content";
import "./globals.css";

// Characterful display face for hero + section headlines. Geist stays for
// body/UI (engineering credibility); Geist Mono stays the evidence tell.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display-face",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  alternates: { canonical: site.url },
};

export const viewport: Viewport = {
  themeColor: "#f4eee3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
