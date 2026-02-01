//client/src/app/(auth)/admin-login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { login, setToken, setUser } from "../../../../lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      
      // Check if user is admin
      if (data.user.role !== "ADMIN") {
        setError("Access denied. Admin credentials required.");
        setLoading(false);
        return;
      }
      
      // Save token and user data
      setToken(data.token);
      setUser(data.user);
      
      // ✅ Redirect to /admin (not /admin/dashboard)
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/admin-log.jpeg')",
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      {/* Glassmorphic Login Card */}
      <div className="relative z-10 w-full max-w-[17rem] bg-white/10 backdrop-blur-2xl p-6 rounded-2xl border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-200 mb-6 hover:text-white transition drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]"
        >
          <IoArrowBack size={18} />
          <span className="text-xs font-medium">Back</span>
        </button>

        {/* Title */}
        <h1 className="text-xl font-semibold text-center mb-5 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] tracking-wide">
          Welcome Back!
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-3 p-2 bg-red-500/20 border border-red-400/50 rounded text-xs text-red-200 text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email */}
          <div>
            <label className="block text-xs text-gray-200 mb-1 drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]">
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-sm bg-white/20 border-[0.2px] border-white/40 text-white placeholder:text-gray-300 focus-visible:ring-2 focus-visible:ring-gray-100 shadow-[0_0_6px_rgba(255,255,255,0.2)]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs text-gray-200 mb-1 drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10 text-sm bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus-visible:ring-gray-100 shadow-[0_0_6px_rgba(255,255,255,0.2)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-300 hover:text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <Button 
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.3)] hover:shadow-[0_0_18px_rgba(255,255,255,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}







