import React, { useState } from 'react';
import { ScreenType } from '../../types';

interface AuthScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onLoginSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onNavigate, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('alex.rivers@design.studio');
  const [password, setPassword] = useState('SuperSecret2024!');
  const [name, setName] = useState('Alex Rivers');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLoginSuccess) {
      onLoginSuccess();
    }
    onNavigate(isSignUp ? 'profile-setup' : 'feed');
  };

  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasSymbolOrNum = /[0-9!@#$%^&*]/.test(password);

  return (
    <div className="bg-[#050505] text-[#F2F2F2] min-h-screen pb-24 flex flex-col justify-between">
      {/* Header */}
      <header className="fixed top-10 left-0 w-full z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-[#262626] flex items-center justify-between px-5 h-16">
        <button
          onClick={() => onNavigate('landing')}
          className="text-[#999999] hover:text-[#F2F2F2] transition-colors p-2 rounded-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="font-black text-xl tracking-tight text-[#F2F2F2] uppercase">LOOP // AUTH</div>
        <button
          onClick={() => alert('LOOP is invite-only and end-to-end encrypted for closed circles.')}
          className="text-[#666666] hover:text-[#F2F2F2] p-2 cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">help_outline</span>
        </button>
      </header>

      {/* Main Form */}
      <main className="pt-28 px-4 max-w-md mx-auto w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#888888] font-mono">
            {isSignUp ? 'ENCRYPTED REGISTRATION' : 'SECURITY GATEWAY'}
          </div>
          <h1 className="font-black text-3xl text-[#F2F2F2] uppercase tracking-tight">
            {isSignUp ? 'JOIN THE LOOP.' : 'WELCOME BACK.'}
          </h1>
          <p className="text-xs text-[#888888] max-w-xs mx-auto leading-relaxed">
            {isSignUp
              ? 'A private, ad-free encrypted network for your inner collective.'
              : 'Sign in to access your squad updates and encrypted media vaults.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#0d0d0d] rounded-xl p-1 border border-[#262626]">
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              isSignUp
                ? 'bg-[#F2F2F2] text-[#050505] shadow-lg'
                : 'text-[#777777] hover:text-[#AAAAAA]'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              !isSignUp
                ? 'bg-[#F2F2F2] text-[#050505] shadow-lg'
                : 'text-[#777777] hover:text-[#AAAAAA]'
            }`}
          >
            Sign In
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#777777] uppercase tracking-widest">
                FULL NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivers"
                required
                className="w-full bg-[#0d0d0d] border border-[#262626] rounded-xl p-3.5 text-xs text-[#F2F2F2] focus:outline-none focus:border-[#F2F2F2] transition-colors"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#777777] uppercase tracking-widest">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@rivers.design"
              required
              className="w-full bg-[#0d0d0d] border border-[#262626] rounded-xl p-3.5 text-xs text-[#F2F2F2] font-mono focus:outline-none focus:border-[#F2F2F2] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#777777] uppercase tracking-widest">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#0d0d0d] border border-[#262626] rounded-xl py-3.5 pl-3.5 pr-11 text-xs text-[#F2F2F2] font-mono focus:outline-none focus:border-[#F2F2F2] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#F2F2F2] p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Password strength checklist */}
          {isSignUp && (
            <div className="bg-[#0d0d0d] p-3 rounded-xl border border-[#262626] space-y-1 text-xs">
              <div className={`flex items-center gap-1.5 font-mono text-[11px] ${hasLength ? 'text-[#F2F2F2]' : 'text-[#555555]'}`}>
                <span className="material-symbols-outlined text-[14px]">
                  {hasLength ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>AT LEAST 8 CHARACTERS</span>
              </div>
              <div className={`flex items-center gap-1.5 font-mono text-[11px] ${hasUpper ? 'text-[#F2F2F2]' : 'text-[#555555]'}`}>
                <span className="material-symbols-outlined text-[14px]">
                  {hasUpper ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>INCLUDES UPPERCASE LETTER</span>
              </div>
              <div className={`flex items-center gap-1.5 font-mono text-[11px] ${hasSymbolOrNum ? 'text-[#F2F2F2]' : 'text-[#555555]'}`}>
                <span className="material-symbols-outlined text-[14px]">
                  {hasSymbolOrNum ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>INCLUDES NUMBER / SYMBOL</span>
              </div>
            </div>
          )}

          {isSignUp && (
            <label className="flex items-center gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="accent-white rounded cursor-pointer"
              />
              <span className="text-[11px] text-[#777777]">
                I agree to the <span className="text-[#F2F2F2] underline">Private Space Guidelines</span> &amp; Encryption Terms.
              </span>
            </label>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-[#F2F2F2] text-[#050505] font-black text-xs uppercase tracking-widest shadow-[0_0_24px_rgba(255,255,255,0.2)] hover:bg-white active:scale-95 transition-all mt-2 cursor-pointer"
          >
            {isSignUp ? 'CREATE YOUR ACCOUNT →' : 'SIGN IN TO LOOP →'}
          </button>
        </form>

        {/* Social SSO */}
        <div className="space-y-3 pt-2">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#262626] w-full"></div>
            <span className="bg-[#050505] px-3 text-[10px] text-[#777777] font-black uppercase tracking-widest relative z-10 font-mono">
              OR AUTHENTICATE WITH
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onNavigate('feed')}
              className="py-3 px-4 rounded-xl bg-[#0d0d0d] border border-[#262626] hover:border-[#555555] text-xs font-black uppercase tracking-wider text-[#F2F2F2] flex items-center justify-center gap-2 hover:bg-[#141414] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">terminal</span>
              <span>GOOGLE</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('feed')}
              className="py-3 px-4 rounded-xl bg-[#0d0d0d] border border-[#262626] hover:border-[#555555] text-xs font-black uppercase tracking-wider text-[#F2F2F2] flex items-center justify-center gap-2 hover:bg-[#141414] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">phone_iphone</span>
              <span>APPLE</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
