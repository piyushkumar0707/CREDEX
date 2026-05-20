import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendScope by Credex",
  description: "Find wasted AI spend before the next invoice lands.",
  openGraph: {
    title: "SpendScope by Credex",
    description: "Find wasted AI spend before the next invoice lands.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendScope by Credex",
    description: "Find wasted AI spend before the next invoice lands."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
