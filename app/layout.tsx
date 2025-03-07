// app/layout.tsx

import Navbar from "@/components/Navbar";
import "./globals.css";
import { Providers } from "./providers";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TrustReview",
  description: "Decentralized Product Review Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Providers>
          <Navbar />
          <div className="pt-20">{children}</div> {/* Add padding-top */}
        </Providers>
      </body>
    </html>
  );
}
