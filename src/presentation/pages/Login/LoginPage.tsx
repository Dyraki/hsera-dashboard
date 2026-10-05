import React, { useState } from 'react';
import { useLoginController } from './useLoginController';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit,
  } = useLoginController();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#231043] font-sans selection:bg-purple-500 selection:text-white">
      {/* LEFT SECTION: Promotional Hero Banner (#231043) */}
      <div
        className="relative w-full md:w-[50%] lg:w-[54%] min-h-[420px] md:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-20 overflow-hidden text-white shrink-0"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #38186a 0%, #231043 65%, #180930 100%)',
        }}
      >
        {/* Background Decorative Curved Geometric Lines */}
        <svg
          className="absolute -right-20 -top-20 w-[140%] h-[140%] pointer-events-none opacity-25"
          viewBox="0 0 800 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 50 150 C 350 200, 650 450, 700 950"
            stroke="white"
            strokeWidth="1.5"
          />
          <path
            d="M 120 180 C 400 240, 700 480, 740 980"
            stroke="white"
            strokeWidth="1.5"
          />
          <path
            d="M 190 210 C 450 280, 750 510, 780 1010"
            stroke="white"
            strokeWidth="1.5"
          />
          <path
            d="M 260 240 C 500 320, 800 540, 820 1040"
            stroke="white"
            strokeWidth="1.5"
          />
        </svg>

        {/* Top: Starburst Asterisk Icon */}
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center mb-8">
            <svg
              width="56"
              height="56"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white drop-shadow-md"
            >
              <path
                d="M32 6V58M6 32H58M13.6 13.6L50.4 50.4M13.6 50.4L50.4 13.6"
                stroke="currentColor"
                strokeWidth="6.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Hello
              <br />
              Framework!
            </h1>
            <p className="text-sm sm:text-base text-purple-200/85 font-normal leading-relaxed max-w-md pt-4">
              Skip repetitive and manual administrative tasks. Get highly productive through automation
              and save tons of time!
            </p>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="relative z-10 pt-10">
          <p className="text-xs text-purple-300/60 font-medium">
            © 2026 Framework App. All rights reserved.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION: White Login Card (#FFFFFF) */}
      <div className="relative w-full md:w-[50%] lg:w-[46%] min-h-screen bg-white flex flex-col justify-between p-8 sm:p-12 lg:p-20 shadow-2xl md:shadow-[-25px_0_50px_rgba(0,0,0,0.18)] z-20">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Framework
          </div>
        </div>

        {/* Main Login Form Box */}
        <div className="my-auto py-8 max-w-md w-full mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Don't have an account?{' '}
              <span className="font-semibold text-slate-800 underline cursor-pointer hover:text-purple-900">
                Contact administrator
              </span>{' '}
              to get access.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-2.5 rounded-lg bg-rose-50 border border-rose-200 p-3.5 text-sm text-rose-600">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                  placeholder="Username"
                  className="w-full px-4 py-3.5 bg-slate-50/80 hover:bg-slate-50 border-b-2 border-slate-900 text-slate-900 placeholder:text-slate-400 text-sm font-medium outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  placeholder="Password"
                  className="w-full px-4 py-3.5 bg-slate-50/80 hover:bg-slate-50 border-b border-slate-200 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 text-sm font-medium outline-none transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button: Login Now */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-[#18181B] hover:bg-black text-white text-sm font-semibold rounded-lg shadow-sm transition-all duration-150 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                ) : (
                  'Login Now'
                )}
              </button>
            </div>

            {/* Google Login (Decorative / Companion button matching reference) */}
            <div>
              <button
                type="button"
                onClick={() => alert('Fitur Google Sign-In terintegrasi dengan akun SSO perusahaan.')}
                className="w-full py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-3 shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Login with Google</span>
              </button>
            </div>

            {/* Forgot password */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                Forget password?{' '}
                <button
                  type="button"
                  onClick={() => alert('Silakan hubungi Super Admin untuk mereset kata sandi Anda.')}
                  className="font-semibold text-slate-800 underline hover:text-purple-900 transition-colors"
                >
                  Click here
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Bottom space placeholder to balance header */}
        <div className="hidden sm:block"></div>
      </div>
    </div>
  );
};

export default LoginPage;
