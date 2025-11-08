import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StackAuthProvider } from "@/components/providers/StackProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap', // Optimize font loading
  preload: true,
});

export const metadata: Metadata = {
  title: "Become a Swiss Citizen in 2025 | Swiss Immigration Pro",
  description: "AI-Powered Swiss immigration platform with expert guidance. Get work permits, citizenship roadmap, CV templates, and unlimited AI chat. Success rate: 92%. 10,000+ success stories.",
  keywords: "Swiss immigration, Switzerland visa, Swiss citizenship, work permit Switzerland, L permit, B permit, Swiss work visa, Swiss employment, permanent residence Switzerland, naturalization Swiss, 2025 quota",
  openGraph: {
    title: "Become a Swiss Citizen in 2025 | Swiss Immigration Pro",
    description: "AI-Powered platform with comprehensive guides, unlimited AI chat, CV templates & citizenship roadmap. Success rate: 92%.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Become a Swiss Citizen in 2025",
    description: "AI-Powered Swiss immigration platform. Get work permits and citizenship roadmap.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-white dark:bg-gray-900`} suppressHydrationWarning>
        <ErrorBoundary>
          <StackAuthProvider>
            {children}
          </StackAuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
