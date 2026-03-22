import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Release Checklist Tool",
  description: "Track your release process from start to finish",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
