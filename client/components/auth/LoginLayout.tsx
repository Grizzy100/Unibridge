// client/components/auth/LoginLayout.tsx
// client/components/auth/LoginLayout.tsx

import Image from "next/image";

interface LoginLayoutProps {
  children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center relative font-[Inter,system-ui,sans-serif]">

      {/* Background */}
      <div className="absolute inset-0 z-0">

        <Image
          src="/login background.png"
          alt="Login Background"
          fill
          priority
          className="object-cover"
        />

        {/* Institutional dim overlay */}
        <div className="absolute inset-0 bg-black/40" />

      </div>

      {/* Login container */}
      <div
        className="
          relative z-10

          w-full
          max-w-[380px]

          px-8
          py-8

          bg-white

          border border-[#e5e7eb]

          rounded-[6px]

          shadow-[0_12px_32px_rgba(0,0,0,0.14)]
        "
      >
        {children}
      </div>

    </div>
  );
}