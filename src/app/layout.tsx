import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portofolio Saya",
  description: "Dibuat dengan Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* overflow-x-hidden PENTING: Mencegah scroll ke samping */}
      <body className={`${inter.className} overflow-x-hidden`}>
        <ConditionalLayout>
            {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}