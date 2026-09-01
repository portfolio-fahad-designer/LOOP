import React, { useState } from 'react';
import { ScreenType } from '../../types';
import { currentUser } from '../../data/mockData';

interface ProfileSetupScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSaveProfile?: (profile: { name: string; username: string; bio: string; avatar: string }) => void;
}

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  onNavigate,
  onSaveProfile,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [selectedVibe, setSelectedVibe] = useState('synth');

  const avatarOptions = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB58VRxD4QiynTFEpAWyC-PWO5YlBwvRkJgTMdOWxH-w23Mzq9G1364NXRB5SO-r2nbEqhnuF_tG2jwiFejzN-k5-XhwYbPyciDuCPASjeKYT9GUd_wm5vvBFNDQeUA9sncu3tZZ43XPyFc-Q-HlCdnvbyU0K3u11uLHJG0ZflRjcsGSVCbcAWReSxU63qZsLmb7x6xkZxrSKqlVwtsN36yg_A5w12kb7TZKyeWAml2F1U_SCY6PnQ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD89XUaV0XpQY-tXvC1Kq1XQkSZe4Z7E0W3_7yD_eZ_q4A2_Yk7zW5XQY-tXvC1Kq1XQkSZe4Z7E0W3_7yD_eZ_q4A2_Yk7zW5XQY',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAr2QjNkpywtQN7qOP3N-xvpTV0r7NZ1DuOi_EtpkCAcV_ym-DSPf1XVXdFyVjUEUlwcyD7kJ07lK7V6uDLwBDDVtLG_TG0uaPOA5uqXEvRvkHOfVHXSolpt2HVlRuOMKfmq1Q04R9f03nbENZqJEv8s2UHRNwE4ZQbfDI4LwBpCRI3fIdpUaIbnx5GxzegfOWYx2PRoIgaHmfUHI36TdE2YYjOQUikIIV6ut9mXeknDIE2ew-3iXU',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveProfile) {
      onSaveProfile({ name, username, bio, avatar });
    }
    onNavigate('onboarding-success');
  };

  return (
    <div className="bg-[#050505] text-[#F2F2F2] min-h-screen pb-20 flex flex-col justify-between">
      {/* TopAppBar */}
      <header className="fixed top-10 left-0 w-full z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-[#262626] flex items-center justify-between px-5 h-16">
        <button
          onClick={() => onNavigate('landing')}
          className="text-[#999999] hover:text-[#F2F2F2] transition-colors p-2 rounded-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-1 bg-[#F2F2F2] rounded-full"></span>
          <span className="w-6 h-1 bg-[#F2F2F2] rounded-full"></span>
          <span className="w-6 h-1 bg-[#333333] rounded-full"></span>
        </div>
        <button
          onClick={() => onNavigate('onboarding-success')}
          className="text-xs font-black uppercase tracking-widest text-[#777777] hover:text-[#F2F2F2] cursor-pointer"
        >
          SKIP
        </button>
      </header>

      {/* Main Form */}
      <main className="pt-28 px-4 max-w-md mx-auto w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#888888] font-mono">
            SETUP PROTOCOL // STEP 02
          </div>
          <h1 className="font-black text-3xl text-[#F2F2F2] uppercase tracking-tight">SET YOUR IDENTITY</h1>
          <p className="text-xs text-[#888888] leading-relaxed">
            This is how you will appear inside squads, chat logs, and encrypted media vaults.
          </p>
        </div>

        {/* Avatar Upload Container */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#444444] shadow-2xl">
              <img src={avatar} alt="Profile preview" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
            </div>
          </div>
          <p className="text-[11px] text-[#AAAAAA] font-black uppercase tracking-wider">CHOOSE AVATAR</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#777777] uppercase tracking-widest">
              DISPLAY NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Rivers"
              required
              className="w-full bg-[#0d0d0d] border border-[#262626] rounded-xl p-3.5 text-xs text-[#F2F2F2] focus:outline-none focus:border-[#F2F2F2] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#777777] uppercase tracking-widest">
              HANDLE / CALLSIGN
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777] font-mono text-xs">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="alex_r"
                required
                className="w-full bg-[#0d0d0d] border border-[#262626] rounded-xl py-3.5 pl-8 pr-4 text-xs text-[#F2F2F2] font-mono focus:outline-none focus:border-[#F2F2F2] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#777777] uppercase tracking-widest">
              BIO / PROFILE MANIFEST
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Product Designer & Synthesizer Nerd. Building the future of private social circles. 🌌"
              rows={3}
              className="w-full bg-[#0d0d0d] border border-[#262626] rounded-xl p-3.5 text-xs text-[#F2F2F2] focus:outline-none focus:border-[#F2F2F2] transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Vibe Presets */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#777777] uppercase tracking-widest">
              IDENTITY THEME PRESET
            </label>
            <div className="flex gap-2">
              {[
                { id: 'synth', label: 'MONO BRUTAL', desc: 'Stark 100%' },
                { id: 'cyan', label: 'HIGH CONTRAST', desc: 'Raw Black' },
                { id: 'pink', label: 'STEALTH OBSCURE', desc: 'Deep Gray' },
              ].map((vibe) => (
                <button
                  key={vibe.id}
                  type="button"
                  onClick={() => setSelectedVibe(vibe.id)}
                  className={`flex-1 py-2.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${
                    selectedVibe === vibe.id
                      ? 'border-[#F2F2F2] bg-[#1a1a1a] text-[#F2F2F2]'
                      : 'border-[#262626] bg-[#0d0d0d] text-[#666666] hover:text-[#999999]'
                  }`}
                >
                  <div className="text-[10px] font-black uppercase tracking-wider">{vibe.label}</div>
                  <div className="text-[8px] font-mono text-[#555555]">{vibe.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-[#F2F2F2] text-[#050505] font-black text-xs uppercase tracking-widest shadow-[0_0_24px_rgba(255,255,255,0.2)] hover:bg-white active:scale-95 transition-all mt-6 cursor-pointer"
          >
            CONFIRM IDENTITY →
          </button>
        </form>
      </main>
    </div>
  );
};
