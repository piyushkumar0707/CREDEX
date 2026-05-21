import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "SpendScope by Credex",
  description: "Find wasted AI spend before the next invoice lands.",
  openGraph: {
    title: "SpendScope by Credex",
    description: "Find wasted AI spend before the next invoice lands.",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "SpendScope by Credex AI spend audit" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendScope by Credex",
    description: "Find wasted AI spend before the next invoice lands.",
    images: ["/twitter-image"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable}`}>
      <body className="font-sans antialiased bg-paper text-ink">{children}</body>
    </html>
  );
}
