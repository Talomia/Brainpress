import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/components/NotificationProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BrainPress | Autonomous Intelligence OS",
  description: "Hyper-scalable, hook-driven autonomous intelligence operating system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className={inter.className}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 800, 
          marginBottom: '3rem', 
          background: 'linear-gradient(to right, #fff, #888)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-1px'
        }}>BrainPress</h2>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
