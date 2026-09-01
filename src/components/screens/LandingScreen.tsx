import React from 'react';
import { ScreenType } from '../../types';

interface LandingScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#050505] text-[#F2F2F2] min-h-screen pb-28 selection:bg-[#F2F2F2] selection:text-[#050505]">
      {/* Top Architectural Header */}
      <header className="fixed top-10 left-0 w-full z-40 bg-[#050505]/90 backdrop-blur-lg border-b border-[#262626] px-6 h-16 flex justify-between items-center">
        <button 
          onClick={() => onNavigate('settings')}
          className="text-[#999999] hover:text-[#F2F2F2] transition-colors cursor-pointer flex items-center gap-2"
          title="Menu / Settings"
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="menu">menu</span>
          <span className="hidden sm:inline text-[10px] uppercase font-black tracking-[0.2em] text-[#888888]">Menu</span>
        </button>
        <div className="font-black text-xl tracking-tighter text-[#F2F2F2] uppercase">
          LOOP—AXIS
        </div>
        <button 
          onClick={() => onNavigate('members')}
          className="text-[#999999] hover:text-[#F2F2F2] transition-colors cursor-pointer flex items-center gap-2"
          title="Search Members & Groups"
        >
          <span className="hidden sm:inline text-[10px] uppercase font-black tracking-[0.2em] text-[#888888]">Directory</span>
          <span className="material-symbols-outlined text-[20px]" data-icon="search">search</span>
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="pt-32 pb-12 px-6 max-w-2xl mx-auto flex flex-col gap-12">
        {/* Massive Bold Typography Hero */}
        <section className="flex flex-col items-center text-center gap-6 relative">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-black text-[#888888]">
            <span className="w-2 h-2 rounded-full bg-[#F2F2F2] animate-pulse"></span>
            <span>Spatial Collective Protocol 01</span>
          </div>

          <div className="flex flex-col items-center">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-ultra leading-flat uppercase m-0 p-0 text-[#F2F2F2]">
              DEFINING
            </h1>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-ultra leading-flat uppercase m-0 p-0 text-stroke">
              THE SQUAD
            </h1>
          </div>

          <p className="font-body text-base text-[#999999] max-w-md leading-relaxed">
            A high-fidelity private digital laboratory for your inner circle, authentic moments, curated media, and live interaction.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-2">
            <button
              onClick={() => onNavigate('profile-setup')}
              className="flex-1 py-4 px-6 rounded-full bg-[#F2F2F2] text-[#050505] font-black text-xs uppercase tracking-widest hover:bg-white hover:shadow-[0_0_24px_rgba(255,255,255,0.3)] active:scale-95 transition-all cursor-pointer border border-[#333]"
            >
              Create Squad
            </button>
            <button
              onClick={() => onNavigate('onboarding-success')}
              className="flex-1 py-4 px-6 rounded-full bg-transparent text-[#F2F2F2] font-black text-xs uppercase tracking-widest border border-[#333] hover:border-[#F2F2F2] hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
            >
              Join Invite
            </button>
          </div>

          {/* High Contrast Preview Mockup */}
          <div 
            onClick={() => onNavigate('feed')}
            className="mt-4 w-full bold-card rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer group hover:border-[#555]"
          >
            <div className="p-4 bg-[#121212] border-b border-[#262626] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F2F2F2] text-[#050505] flex items-center justify-center font-black text-xs">
                  01
                </div>
                <div className="text-left">
                  <span className="font-black text-sm uppercase tracking-tight text-[#F2F2F2]">The Squad</span>
                  <div className="text-[10px] text-[#888888] font-mono tracking-wider">LIVE INSTANCE</div>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-black bg-[#222222] text-[#F2F2F2] border border-[#333333] px-3 py-1 rounded-full">
                ACTIVE
              </span>
            </div>
            <div className="p-4 flex flex-col gap-2 bg-[#0a0a0a] relative h-64 overflow-hidden">
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-75 grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                alt="App preview"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9O6AZ_G90DzGx8RDesXW_2E3uPOMp4K2Daz-Tm1seZs8uucrBKLXhwYmKYdUwIZuJyLBZ9s-LPEB83QWh5mT43SbnB2Fg6Z-CKjGeODVT_rx6gmv4C9e4Kp0WoewUkyG12oDmuvONhgUMoaGJVLW_BZoufEd0MPDNny2SlZ6td8GGPVx6eMubn0TgBuxfxIdJStnVUAPvkP02jPghhdJboNJwvctfjYaVokooJ6S6pG7HULnbIHs"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
              <div className="absolute bottom-4 left-5 right-5 flex justify-between items-center z-10">
                <span className="text-xs text-[#F2F2F2] font-black uppercase tracking-wider">Enter Feed Terminal</span>
                <span className="material-symbols-outlined text-[#F2F2F2] text-sm">arrow_forward</span>
              </div>
            </div>
          </div>
        </section>

        {/* Architectural Features Section */}
        <section className="flex flex-col gap-5 border-t border-[#262626] pt-10">
          <div className="flex justify-between items-baseline px-1">
            <h2 className="font-black text-xl text-[#F2F2F2] uppercase tracking-tight">Core Architecture</h2>
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#666666]">INDEX / 04</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('profile-setup')}
              className="bold-card p-5 rounded-xl flex flex-col items-start gap-3 hover:bg-[#141414] transition-all text-left group cursor-pointer"
            >
              <div className="text-[10px] uppercase tracking-[0.25em] font-black text-[#666666]">01 / INITIALIZE</div>
              <span className="font-black text-base text-[#F2F2F2] uppercase tracking-tight group-hover:text-white">Create Group</span>
              <p className="text-xs text-[#888888] leading-relaxed">Spin up an exclusive sandbox for your project, team, or inner circle.</p>
            </button>

            <button
              onClick={() => onNavigate('onboarding-success')}
              className="bold-card p-5 rounded-xl flex flex-col items-start gap-3 hover:bg-[#141414] transition-all text-left group cursor-pointer"
            >
              <div className="text-[10px] uppercase tracking-[0.25em] font-black text-[#666666]">02 / ONBOARD</div>
              <span className="font-black text-base text-[#F2F2F2] uppercase tracking-tight group-hover:text-white">Invite Members</span>
              <p className="text-xs text-[#888888] leading-relaxed">Direct invite passes with role governance and cryptographic privacy.</p>
            </button>

            <button
              onClick={() => onNavigate('gallery')}
              className="bold-card p-5 rounded-xl flex flex-col items-start gap-3 hover:bg-[#141414] transition-all text-left group cursor-pointer"
            >
              <div className="text-[10px] uppercase tracking-[0.25em] font-black text-[#666666]">03 / ARCHIVE</div>
              <span className="font-black text-base text-[#F2F2F2] uppercase tracking-tight group-hover:text-white">Media Vault</span>
              <p className="text-xs text-[#888888] leading-relaxed">High-fidelity photo grids, highlight rolls, and shared event artifacts.</p>
            </button>

            <button
              onClick={() => onNavigate('chat')}
              className="bold-card p-5 rounded-xl flex flex-col items-start gap-3 hover:bg-[#141414] transition-all text-left group cursor-pointer"
            >
              <div className="text-[10px] uppercase tracking-[0.25em] font-black text-[#666666]">04 / SYNC</div>
              <span className="font-black text-base text-[#F2F2F2] uppercase tracking-tight group-hover:text-white">Realtime Chat</span>
              <p className="text-xs text-[#888888] leading-relaxed">Direct communications, interactive polls, and spontaneous group drops.</p>
            </button>
          </div>
        </section>

        {/* Feature Pills */}
        <section className="flex flex-col gap-4 border-t border-[#262626] pt-10">
          <div className="flex justify-between items-baseline px-1">
            <h2 className="font-black text-xl text-[#F2F2F2] uppercase tracking-tight">Capabilities</h2>
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#666666]">05 / SPECS</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {[
              { label: 'Private Groups', icon: 'lock', target: 'feed' as ScreenType },
              { label: 'High-Res Vault', icon: 'image', target: 'gallery' as ScreenType },
              { label: 'Encrypted Chat', icon: 'chat', target: 'chat' as ScreenType },
              { label: 'Interactive Polls', icon: 'poll', target: 'feed' as ScreenType },
              { label: 'Event Coordinates', icon: 'celebration', target: 'gallery' as ScreenType },
              { label: 'Access Control', icon: 'shield_lock', target: 'members' as ScreenType }
            ].map((cap, i) => (
              <button
                key={i}
                onClick={() => onNavigate(cap.target)}
                className="bg-[#121212] border border-[#262626] px-4 py-2.5 rounded-full flex items-center gap-2 text-[#CCCCCC] font-bold text-xs uppercase tracking-wider hover:text-white hover:border-[#555555] hover:bg-[#1c1c1c] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-[#F2F2F2]">{cap.icon}</span>
                <span>{cap.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Privacy Card */}
        <section className="bold-card rounded-2xl p-8 flex flex-col items-center text-center gap-4 relative overflow-hidden border border-[#333333]">
          <div className="w-12 h-12 rounded-full bg-[#1c1c1c] border border-[#333333] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#F2F2F2] text-2xl">shield_lock</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] font-black text-[#888888]">06 / ZERO TELEMETRY</div>
          <h3 className="font-black text-2xl text-[#F2F2F2] uppercase tracking-tight">Pure Intimacy & Privacy</h3>
          <p className="text-xs sm:text-sm text-[#999999] leading-relaxed max-w-md">
            No public algorithms. No third-party ad brokers. Your content stays strictly within the authorized boundaries of your private collective.
          </p>
          <button
            onClick={() => onNavigate('auth')}
            className="mt-2 text-xs font-black uppercase tracking-widest text-[#F2F2F2] hover:text-white flex items-center gap-1.5 border-b border-[#F2F2F2] pb-0.5"
          >
            Access Terminal / Register <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </section>
      </main>
    </div>
  );
};
