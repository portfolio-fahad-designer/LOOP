import React, { useState } from 'react';
import { ScreenType } from '../../types';
import { useApp } from '../../context/AppContext';

interface AuthScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onLoginSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onNavigate, onLoginSuccess }) => {
  const { updateProfile, showToast } = useApp();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('alex.rivers@design.studio');
  const [password, setPassword] = useState('SuperSecret2024!');
  const [name, setName] = useState('Alex Rivers');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updateProfile({
        name: name.trim(),
        username: `@${name.toLowerCase().replace(/\s+/g, '')}`,
      });
    }

    if (onLoginSuccess) {
      onLoginSuccess();
    }
    showToast(isSignUp ? 'Registration confirmed! Welcome to Loop.' : 'Authentication successful');
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
        <div className="font-black text-xl tracking-tight text-[#F2F2F2] uppercase">LOOP // GATEWAY</div>
        <button
          onClick={() => showToast('LOOP is private, invite-only, and end-to-end encrypted.', 'info')}
          className="text-[#666666] hover:text-[#F2F2F2] p-2 cursor-pointer transition-colors"
          title="Security Information"
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
              EMAIL OR PHONE
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.rivers@design.studio"
              required
              className="w-full bg-[#0d0d0d] border border-[#262626] rounded-xl p-3.5 text-xs text-[#F2F2F2] focus:outline-none focus:border-[#F2F2F2] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-[#777777] uppercase tracking-widest">
                PASSWORD
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[10px] text-[#777777] hover:text-[#F2F2F2] uppercase font-mono tracking-wider cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-[#0d0d0d] border border-[#262626] rounded-xl p-3.5 text-xs text-[#F2F2F2] focus:outline-none focus:border-[#F2F2F2] transition-colors font-mono"
            />
          </div>

          {/* Password complexity hints for signup */}
          {isSignUp && (
            <div className="space-y-1 bg-[#0d0d0d] border border-[#262626] p-3 rounded-xl">
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className={`material-symbols-outlined text-[13px] ${hasLength ? 'text-[#00FF66]' : 'text-[#555]'}`}>
                  {hasLength ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span className={hasLength ? 'text-[#CCCCCC]' : 'text-[#777]'}>At least 8 characters</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className={`material-symbols-outlined text-[13px] ${hasUpper ? 'text-[#00FF66]' : 'text-[#555]'}`}>
                  {hasUpper ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span className={hasUpper ? 'text-[#CCCCCC]' : 'text-[#777]'}>One uppercase letter</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className={`material-symbols-outlined text-[13px] ${hasSymbolOrNum ? 'text-[#00FF66]' : 'text-[#555]'}`}>
                  {hasSymbolOrNum ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span className={hasSymbolOrNum ? 'text-[#CCCCCC]' : 'text-[#777]'}>One number or special character</span>
              </div>
            </div>
          )}

          {isSignUp && (
            <label className="flex items-start gap-2 text-xs text-[#888888] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 accent-white rounded"
                required
              />
              <span>I agree to the End-to-End Encryption Protocol and Community Charter.</span>
            </label>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-[#F2F2F2] text-[#050505] hover:bg-white active:scale-98 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] mt-6 cursor-pointer"
          >
            {isSignUp ? 'CREATE ENCRYPTED ACCOUNT →' : 'AUTHENTICATE & ENTER →'}
          </button>
        </form>
      </main>

      <footer className="p-4 text-center">
        <span className="text-[10px] font-mono text-[#555555]">ENCRYPTED SHIELD PROTOCOL 2026</span>
      </footer>
    </div>
  );
};
