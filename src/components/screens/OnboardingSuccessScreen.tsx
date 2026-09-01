import React, { useState } from 'react';
import { ScreenType } from '../../types';

interface OnboardingSuccessScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenCreate: () => void;
}

export const OnboardingSuccessScreen: React.FC<OnboardingSuccessScreenProps> = ({
  onNavigate,
  onOpenCreate,
}) => {
  const [inviteInput, setInviteInput] = useState('');
  const [joinStatus, setJoinStatus] = useState<string | null>(null);

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteInput.trim()) return;
    setJoinStatus(`Joined group with code "${inviteInput.trim()}"! Redirecting to feed...`);
    setTimeout(() => {
      onNavigate('feed');
    }, 1200);
  };

  return (
    <div className="bg-[#050505] text-[#F2F2F2] min-h-screen pb-24 flex flex-col justify-between">
      {/* Top Header */}
      <header className="fixed top-10 left-0 w-full z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-[#262626] flex items-center justify-between px-5 h-16">
        <button
          onClick={() => onNavigate('landing')}
          className="text-[#999999] hover:text-[#F2F2F2] transition-colors p-2 rounded-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="font-black text-xl tracking-tight text-[#F2F2F2] uppercase">LOOP // NETWORK</div>
        <div className="w-8"></div>
      </header>

      {/* Main Canvas */}
      <main className="pt-28 px-4 max-w-md mx-auto w-full space-y-6 flex-1 flex flex-col justify-center">
        {/* Celebration Header */}
        <div className="text-center space-y-3 relative">
          <div className="w-20 h-20 rounded-3xl bg-[#141414] border border-[#333333] text-[#F2F2F2] mx-auto flex items-center justify-center shadow-2xl">
            <span className="material-symbols-outlined text-3xl font-black">check_circle</span>
          </div>

          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#888888] font-mono">
            ACCESS AUTHORIZED
          </div>

          <h1 className="font-black text-3xl text-[#F2F2F2] uppercase tracking-tight">
            YOU ARE IN, ALEX.
          </h1>
          <p className="text-xs text-[#888888] max-w-xs mx-auto leading-relaxed">
            Your encrypted workspace is active. Create a new collective squad or authenticate with an invite key.
          </p>
        </div>

        {/* Action Choice 1: Create Group */}
        <div
          onClick={onOpenCreate}
          className="bold-card rounded-2xl p-5 border border-[#262626] bg-[#0d0d0d] hover:border-[#555555] transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F2F2F2] text-[#050505] flex items-center justify-center font-black group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl font-black">add</span>
            </div>
            <div className="flex-1">
              <h3 className="font-black text-sm text-[#F2F2F2] uppercase tracking-tight">CREATE A NEW SQUAD</h3>
              <p className="text-xs text-[#777777] mt-0.5 font-sans">
                Set up a private realm with feeds, chat logs, and encrypted media vaults.
              </p>
            </div>
            <span className="material-symbols-outlined text-[#666666] group-hover:text-white group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </div>
        </div>

        {/* Action Choice 2: Join with Invite Code */}
        <div className="bold-card rounded-2xl p-5 border border-[#262626] bg-[#0d0d0d] shadow-lg space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] text-[#AAAAAA] flex items-center justify-center border border-[#333333]">
              <span className="material-symbols-outlined text-xl">vpn_key</span>
            </div>
            <div>
              <h3 className="font-black text-xs text-[#F2F2F2] uppercase tracking-wider">ENTER WITH INVITE KEY</h3>
              <p className="text-[10px] text-[#777777] font-mono">Paste your squad access key below</p>
            </div>
          </div>

          <form onSubmit={handleJoinByCode} className="flex gap-2">
            <input
              type="text"
              value={inviteInput}
              onChange={(e) => setInviteInput(e.target.value)}
              placeholder="e.g. DSQD-2024"
              className="flex-1 bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-[#F2F2F2] font-mono placeholder:text-[#555555] focus:outline-none focus:border-[#F2F2F2]"
            />
            <button
              type="submit"
              disabled={!inviteInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#F2F2F2] text-[#050505] font-black text-xs uppercase tracking-wider hover:bg-white transition-all disabled:opacity-30 cursor-pointer"
            >
              AUTHENTICATE
            </button>
          </form>

          {joinStatus && (
            <p className="text-xs text-[#F2F2F2] font-mono text-center animate-pulse">{joinStatus}</p>
          )}
        </div>

        {/* Direct Link to The Squad */}
        <div className="pt-2">
          <button
            onClick={() => onNavigate('feed')}
            className="w-full py-4 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-[#262626] text-[#F2F2F2] font-black text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ENTER "DESIGN SQUAD" DIRECT FEED</span>
            <span className="material-symbols-outlined text-sm text-[#F2F2F2]">arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
};
