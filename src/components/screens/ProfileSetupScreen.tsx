import React, { useState, useRef } from 'react';
import { ScreenType } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProfileSetupScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ onNavigate }) => {
  const { currentUser, updateProfile, showToast } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleAvatars = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB58VRxD4QiynTFEpAWyC-PWO5YlBwvRkJgTMdOWxH-w23Mzq9G1364NXRB5SO-r2nbEqhnuF_tG2jwiFejzN-k5-XhwYbPyciDuCPASjeKYT9GUd_wm5vvBFNDQeUA9sncu3tZZ43XPyFc-Q-HlCdnvbyU0K3u11uLHJG0ZflRjcsGSVCbcAWReSxU63qZsLmb7x6xkZxrSKqlVwtsN36yg_A5w12kb7TZKyeWAml2F1U_SCY6PnQ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCl_PEWuE1V4-2aDP-mfvk4DUOt4GRLfhap5joUSOPFnhudLJ7V5IjRrAOLSl0WwsBuVxYItcq9JOBnsv5YZ7ootSWKBFe8zqIaUs_6aa1PcXxsZ5y6kJ17DDt1X88AXaa9TEM1Z4pm1wIVAhS30L11mc2pZYFXp7pLkZwf0yIS8jY5bjm7Xl3THqcsob5kiqeXGYenkbUU-aaAQJhEHFufkZfhrcB6tEEuXFt0PdiL02r7snvBP8E',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAMxWzJfNl-4GXFoXI_8Jv4dTznTXkUAV5qlfExn6BMAJPutF68p7JhfcL2gspHrHajUnw-WMp0gDZMSd_z4Try441QBwWgYr8ufOyHBcHK5sGUamPw6PX8Cas_jIqYqHUffw1ant5R6pYg_PvqLswkeOj3xHSX8pdrnTwYC-7hKSWzVRkrOjtz2HWbmBW-DB7NL0YLq17oUC8mAi9j-L2ruMc7hgq8psvN7OaV6vDlpYywFz-GoX4',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
          showToast('Image loaded');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      username: username.trim().startsWith('@') ? username.trim() : `@${username.trim()}`,
      bio: bio.trim(),
      avatar,
    });
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

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

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

        {/* Avatar Selection */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            title="Upload from device"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#444444] shadow-2xl">
              <img src={avatar} alt="Profile preview" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white text-xl">upload_file</span>
            </div>
          </div>
          
          {/* Preset avatar pickers */}
          <div className="flex items-center gap-2">
            {sampleAvatars.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setAvatar(url)}
                className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                  avatar === url ? 'border-white scale-110' : 'border-[#333]'
                }`}
              >
                <img src={url} alt="Preset" className="w-full h-full object-cover" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-[10px] font-mono uppercase bg-[#181818] hover:bg-[#252525] border border-[#333] rounded-lg text-[#AAA] cursor-pointer"
            >
              Browse
            </button>
          </div>
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
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@alexrivers"
              required
              className="w-full bg-[#0d0d0d] border border-[#262626] rounded-xl p-3.5 text-xs text-[#F2F2F2] focus:outline-none focus:border-[#F2F2F2] transition-colors font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#777777] uppercase tracking-widest">
              OPERATOR BIO
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Design systems, cyberpunk aesthetics, and night vibes..."
              className="w-full bg-[#0d0d0d] border border-[#262626] rounded-xl p-3.5 text-xs text-[#F2F2F2] focus:outline-none focus:border-[#F2F2F2] transition-colors resize-none font-sans"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-[#F2F2F2] text-[#050505] hover:bg-white active:scale-98 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] mt-6 cursor-pointer"
          >
            CONFIRM &amp; ENTER SQUAD →
          </button>
        </form>
      </main>

      <footer className="p-4 text-center">
        <span className="text-[10px] font-mono text-[#555555]">ENCRYPTED WITH SQUAD PROTOCOL V2.4</span>
      </footer>
    </div>
  );
};
