// client/components/auth/LoginLayout.tsx
import Image from 'next/image';

interface LoginLayoutProps {
  children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background Image - Full Screen */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/login background.png"
          alt="Login Background"
          fill
          priority
          className="object-cover"
        />
        {/* Optional: Dark overlay for better form readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Login Form - Centered 
          ⚙️ ADJUST DIMENSIONS HERE:
          - max-w-xs (320px) → max-w-sm (384px) or max-w-md (448px) for WIDER
          - p-8 (2rem padding) → p-6 (1.5rem) or p-5 (1.25rem) for LESS HEIGHT
          - rounded-2xl → rounded-xl or rounded-lg for SHARPER EDGES
      */}
      <div className="relative z-10 w-full max-w-md p-6 bg-white rounded-xl shadow-2xl">
        {children}
      </div>
    </div>
  );
}
