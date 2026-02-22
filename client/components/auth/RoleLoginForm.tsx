// // client/components/auth/RoleLoginForm.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
// import { PiGraduationCapFill, PiShieldCheckFill, PiBookOpenTextFill } from 'react-icons/pi';
// import { FaGraduationCap } from "react-icons/fa6";
// type UserRole = 'student' | 'teacher' | 'warden';

// interface RoleLoginFormProps {
//   defaultRole?: UserRole;
// }

// const roles = [
//   { id: 'student' as UserRole, label: 'Student', icon: PiGraduationCapFill, description: 'Access your courses and assignments' },
//   { id: 'warden' as UserRole, label: 'Warden', icon: PiShieldCheckFill, description: 'Manage hostel and student welfare' },
//   { id: 'teacher' as UserRole, label: 'Teacher', icon: PiBookOpenTextFill, description: 'Manage classes and student progress' },
// ];

// export default function RoleLoginForm({ defaultRole = 'student' }: RoleLoginFormProps) {
//   const router = useRouter();
//   const params = useParams();
//   const selectedRole: UserRole = (params?.role as UserRole) ?? defaultRole;

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false,
//   });

//   useEffect(() => {
//     if (!['student', 'teacher', 'warden'].includes(selectedRole)) {
//       router.replace('/login/student');
//     }
//   }, [selectedRole, router]);

//   const handleRoleChange = (role: UserRole) => {
//     if (role !== selectedRole) {
//       router.push(`/login/${role}`);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await fetch('http://localhost:3001/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Invalid credentials');
//       }

//       // Store authentication data
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));

//       // ✅ ROLE-SYMBOL VALIDATION LOGIC
//       const userRole = data.user.role;

//       // Validate based on selected symbol (student/teacher/warden)
//       switch (selectedRole) {
//         case 'student':
//           // Student symbol: Allow STUDENT or PARENT
//           if (userRole === 'STUDENT') {
//             router.push('/student-dashboard');
//           } else if (userRole === 'PARENT') {
//             router.push('/parent-dashboard');
//           } else {
//             throw new Error('Invalid credentials for student portal. Please select the correct role.');
//           }
//           break;

//         case 'teacher':
//           // Teacher symbol: Only TEACHER allowed
//           if (userRole === 'TEACHER') {
//             router.push('/teacher-dashboard');
//           } else {
//             throw new Error('Invalid credentials for teacher portal. Please select the correct role.');
//           }
//           break;

//         case 'warden':
//           // Warden symbol: Only WARDEN allowed
//           if (userRole === 'WARDEN') {
//             router.push('/warden-dashboard');
//           } else {
//             throw new Error('Invalid credentials for warden portal. Please select the correct role.');
//           }
//           break;

//         default:
//           throw new Error('Invalid portal selection');
//       }

//     } catch (err: any) {
//       setError(err.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgotPassword = () => {
//     router.push('/forgot-password');
//   };

//   const currentRoleDescription = roles.find(r => r.id === selectedRole)?.description || '';

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="text-center">
//         <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-900 rounded-xl mb-3">
//           <span className="text-xl font-bold text-white">U</span>
//         </div>
//         <h1 className="text-xl font-bold text-slate-900">Welcome to UniBridge</h1>
//         <p className="text-slate-600 text-xs mt-1">Select your role and sign in to continue</p>
//       </div>

//       {/* Role Selection */}
//       <div className="grid grid-cols-3 gap-2">
//         {roles.map((role) => {
//           const Icon = role.icon;
//           const isSelected = selectedRole === role.id;
//           return (
//             <button
//               key={role.id}
//               type="button"
//               onClick={() => handleRoleChange(role.id)}
//               disabled={loading}
//               className={`
//                 p-2.5 rounded-lg border-2 transition-all
//                 ${isSelected 
//                   ? 'bg-slate-900 border-slate-900 text-white' 
//                   : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
//                 }
//                 ${loading ? 'opacity-50 cursor-not-allowed' : ''}
//               `}
//             >
//               <Icon className="text-lg mx-auto mb-0.5" />
//               <span className="text-[10px] font-medium block">{role.label}</span>
//             </button>
//           );
//         })}
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
//           {error}
//         </div>
//       )}

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <h2 className="text-lg font-bold text-slate-900">Sign In</h2>
//           <p className="text-xs text-slate-600 mt-0.5">{currentRoleDescription}</p>
//         </div>

//         {/* Email */}
//         <div className="space-y-1">
//           <label className="block text-xs font-medium text-slate-700">Email Address</label>
//           <div className="relative">
//             <FiMail className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
//             <input
//               type="email"
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               placeholder="your.email@university.edu"
//               className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
//               required
//               disabled={loading}
//             />
//           </div>
//         </div>

//         {/* Password */}
//         <div className="space-y-1">
//           <label className="block text-xs font-medium text-slate-700">Password</label>
//           <div className="relative">
//             <FiLock className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
//             <input
//               type={showPassword ? 'text' : 'password'}
//               value={formData.password}
//               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               placeholder="Enter your password"
//               className="w-full pl-8 pr-9 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
//               required
//               disabled={loading}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//               disabled={loading}
//             >
//               {showPassword ? <FiEyeOff className="text-xs" /> : <FiEye className="text-xs" />}
//             </button>
//           </div>
//         </div>

//         {/* Remember & Forgot */}
//         <div className="flex items-center justify-between text-xs">
//           <label className="flex items-center gap-1.5 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={formData.rememberMe}
//               onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
//               className="w-3 h-3 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
//               disabled={loading}
//             />
//             <span className="text-slate-700">Remember me</span>
//           </label>
//           <button
//             type="button"
//             onClick={handleForgotPassword}
//             className="text-slate-900 hover:underline font-medium"
//             disabled={loading}
//           >
//             Forgot password?
//           </button>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-slate-900 text-white py-2 rounded-lg font-semibold text-xs hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
//         >
//           {loading ? 'Signing In...' : `Sign In as ${roles.find(r => r.id === selectedRole)?.label}`}
//         </button>

//         {/* Admin Contact */}
//         <p className="text-center text-xs text-slate-600">
//           Don't have an account?{' '}
//           <button type="button" className="text-slate-900 font-semibold hover:underline" disabled={loading}>
//             Contact Admin
//           </button>
//         </p>
//       </form>

//       {/* Terms */}
//       <p className="text-[10px] text-center text-slate-500 leading-relaxed">
//         By signing in, you agree to UniBridge's Terms of Service and Privacy Policy
//       </p>
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import {
  PiGraduationCapFill,
  PiShieldCheckFill,
  PiBookOpenTextFill,
} from "react-icons/pi";

import { FaGraduationCap } from "react-icons/fa6";

type UserRole = "student" | "teacher" | "warden";

interface RoleLoginFormProps {
  defaultRole?: UserRole;
}

const roles = [
  {
    id: "student" as UserRole,
    label: "Student",
    icon: PiGraduationCapFill,
    description: "Access your courses and assignments",
  },
  {
    id: "warden" as UserRole,
    label: "Warden",
    icon: PiShieldCheckFill,
    description: "Manage hostel and student welfare",
  },
  {
    id: "teacher" as UserRole,
    label: "Teacher",
    icon: PiBookOpenTextFill,
    description: "Manage classes and student progress",
  },
];

export default function RoleLoginForm({
  defaultRole = "student",
}: RoleLoginFormProps) {

  const router = useRouter();
  const params = useParams();

  const selectedRole: UserRole =
    (params?.role as UserRole) ?? defaultRole;

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    if (!["student", "teacher", "warden"].includes(selectedRole)) {
      router.replace("/login/student");
    }
  }, [selectedRole, router]);

  const handleRoleChange = (role: UserRole) => {
    if (role !== selectedRole) {
      router.push(`/login/${role}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:3001/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid credentials"
        );
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      const userRole = data.user.role;

      switch (selectedRole) {

        case "student":

          if (userRole === "STUDENT") {
            router.push("/student-dashboard");
          }
          else if (userRole === "PARENT") {
            router.push("/parent-dashboard");
          }
          else {
            throw new Error(
              "Invalid credentials for student portal."
            );
          }

          break;

        case "teacher":

          if (userRole === "TEACHER") {
            router.push("/teacher-dashboard");
          }
          else {
            throw new Error(
              "Invalid credentials for teacher portal."
            );
          }

          break;

        case "warden":

          if (userRole === "WARDEN") {
            router.push("/warden-dashboard");
          }
          else {
            throw new Error(
              "Invalid credentials for warden portal."
            );
          }

          break;

        default:

          throw new Error("Invalid portal selection");

      }

    }
    catch (err: any) {

      setError(err.message || "Login failed");

    }
    finally {

      setLoading(false);

    }

  };

  const currentRoleDescription =
    roles.find((r) => r.id === selectedRole)
      ?.description || "";

  return (

    <div className="space-y-6">

      {/* Header */}

      <div className="text-center space-y-3">

        <div className="flex justify-center">

          <div
            className="
              w-10 h-10
              bg-[#111827]
              rounded-[5px]
              flex items-center justify-center
            "
          >
            <FaGraduationCap className="text-white text-[16px]" />
          </div>

        </div>

        <div>

          <h1 className="text-[18px] font-semibold text-[#111827] tracking-[-0.01em]">
            Welcome to UniBridge
          </h1>

          <p className="text-[13px] text-[#6b7280] mt-1">
            Select your role and sign in
          </p>

        </div>

      </div>


      {/* Role selector */}

      <div className="grid grid-cols-3 gap-2">

        {roles.map((role) => {

          const Icon = role.icon;

          const isSelected =
            selectedRole === role.id;

          return (

            <button
              key={role.id}
              type="button"
              onClick={() => handleRoleChange(role.id)}
              disabled={loading}
              className={`
                py-[9px]
                border
                rounded-[5px]
                text-[13px]
                font-medium
                transition-colors

                ${
                  isSelected
                    ? "bg-[#111827] border-[#111827] text-white"
                    : "bg-white border-[#d1d5db] text-[#374151]"
                }
              `}
            >

              <Icon className="text-[15px] mx-auto mb-0.5" />

              <span className="block">
                {role.label}
              </span>

            </button>

          );

        })}

      </div>


      {/* Error */}

      {error && (

        <div className="border border-red-200 bg-red-50 text-red-700 px-3 py-2 rounded-[5px] text-[13px]">
          {error}
        </div>

      )}


      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <div>

          <h2 className="text-[15px] font-semibold text-[#111827]">
            Sign In
          </h2>

          <p className="text-[13px] text-[#6b7280] mt-1">
            {currentRoleDescription}
          </p>

        </div>


        {/* Email */}

        <div className="space-y-1">

          <label className="text-[13px] font-medium text-[#374151]">
            Email Address
          </label>

          <div className="relative">

            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />

            <input
              type="email"
              required
              disabled={loading}
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              placeholder="your.email@university.edu"
              className="
                w-full
                pl-9 pr-3 py-[10px]
                text-[14px]
                text-[#111827]
                border border-[#d1d5db]
                rounded-[5px]
                bg-white
                outline-none
                focus:border-[#111827]
              "
            />

          </div>

        </div>


        {/* Password */}

        <div className="space-y-1">

          <label className="text-[13px] font-medium text-[#374151]">
            Password
          </label>

          <div className="relative">

            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />

            <input
              type={showPassword ? "text" : "password"}
              required
              disabled={loading}
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              placeholder="Enter your password"
              className="
                w-full
                pl-9 pr-9 py-[10px]
                text-[14px]
                text-[#111827]
                border border-[#d1d5db]
                rounded-[5px]
                bg-white
                outline-none
                focus:border-[#111827]
              "
            />

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
            >

              {showPassword
                ? <FiEyeOff size={16} />
                : <FiEye size={16} />}

            </button>

          </div>

        </div>


        {/* Remember */}

        <div className="flex items-center justify-between text-[13px]">

          <label className="flex items-center gap-2 text-[#374151]">

            <input
              type="checkbox"
              disabled={loading}
              checked={formData.rememberMe}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rememberMe: e.target.checked,
                })
              }
              className="w-4 h-4 border-[#d1d5db] rounded-[4px]"
            />

            Remember me

          </label>

          <button
            type="button"
            className="text-[#111827] font-medium"
          >
            Forgot password?
          </button>

        </div>


        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            py-[10px]
            bg-[#111827]
            text-white
            rounded-[5px]
            border border-[#111827]
            text-[14px]
            font-medium
          "
        >

          {loading
            ? "Signing In..."
            : `Sign In as ${
                roles.find(
                  (r) =>
                    r.id === selectedRole
                )?.label
              }`
          }

        </button>


        <p className="text-center text-[13px] text-[#6b7280]">
          Don't have an account?{" "}
          <span className="text-[#111827] font-medium">
            Contact Admin
          </span>
        </p>

      </form>


      <p className="text-[11px] text-center text-[#9ca3af]">
        By signing in, you agree to UniBridge's Terms and Privacy Policy
      </p>

    </div>

  );
}