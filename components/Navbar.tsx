// app/components/Navbar.tsx

"use client";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function Navbar() {

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow p-4 flex items-center justify-between z-50">
      <div className="flex items-center space-x-4">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full"
        /></Link>
        <span className="text-xl font-bold"><Link href="/">Trust Review</Link></span>
      </div>

      <ConnectButton />
    </nav>
  );
}
