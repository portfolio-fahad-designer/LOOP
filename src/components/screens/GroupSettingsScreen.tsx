import React, { useState, useRef } from 'react';
import { ScreenType } from '../../types';
import { useApp } from '../../context/AppContext';

interface GroupSettingsScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const GroupSettingsScreen: React.FC<GroupSettingsScreenProps> = ({ onNavigate }) => {
  const {
    currentSquad,
    updateSquad,
    soundMuted,
    setSoundMuted,
    resetDemoData,
    showToast,
  } = useApp();

  const [showEditModal, setShowEditModal] = useState(false);
  const [nameInput, setNameInput] = useState(currentSquad.name);
  const [descInput, setDescInput] = useState(currentSquad.description);
  const [privacyInput, setPrivacyInput] = useState(currentSquad.privacy);
  const [allowComments, setAllowComments] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateSquad({ avatar: reader.result });
          showToast('Squad avatar updated');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSquadInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    updateSquad({
      name: nameInput.trim().toUpperCase(),
      description: descInput.trim(),
      privacy: privacyInput,
    });
    setShowEditModal(false);
  };

  const handleRegenerateCode = () => {
    const newCode = `SQD-${Math.floor(1000 + Math.random() * 9000)}`;
    updateSquad({ inviteCode: newCode });
    showToast(`New invite code generated: ${newCode}`);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(`https://loopsquad.app/join/${currentSquad.inviteCode}`);
    showToast('Squad invite link copied');
  };

  return (
    <div className="bg-[#050505] text-[#F2F2F2] min-h-screen pb-32">
      {/* Sub Header Toolbar */}
      <div className="pt-20 px-4 max-w-xl mx-auto flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('feed')}
            className="text-[#999999] hover:text-[#F2F2F2] transition-colors p-1.5 rounded-full hover:bg-[#181818] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h1 className="font-black text-xl tracking-tight text-[#F2F2F2] uppercase">
              {currentSquad.name}
            </h1>
            <p className="text-[10px] text-[#777] font-mono">SQUAD CONFIGURATION &amp; ACCESS</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('feed')}
          className="px-3.5 py-1.5 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-white/90 transition-all flex items-center gap-1 shadow-md cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">done</span>
          <span>Done</span>
        </button>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarUpload}
        accept="image/*"
        className="hidden"
      />

      <main className="px-4 max-w-xl mx-auto space-y-8">
        {/* Squad Identity Header */}
        <section className="flex flex-col items-center space-y-4">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#333333] relative shadow-2xl">
              <img
                alt={currentSquad.name}
                className="object-cover w-full h-full"
                src={currentSquad.avatar}
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full backdrop-blur-sm">
                <span className="material-symbols-outlined text-white text-[20px]">photo_camera</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="font-black text-2xl text-[#F2F2F2] uppercase tracking-tight">
              {currentSquad.name}
            </h2>
            <p className="text-xs text-[#888888] max-w-xs mx-auto mt-1 leading-relaxed">
              {currentSquad.description}
            </p>
            <button
              onClick={() => {
                setNameInput(currentSquad.name);
                setDescInput(currentSquad.description);
                setPrivacyInput(currentSquad.privacy);
                setShowEditModal(true);
              }}
              className="mt-3 px-4 py-1.5 bg-[#141414] hover:bg-[#202020] text-white rounded-full font-black text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 mx-auto border border-[#262626] cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs">edit</span>
              <span>EDIT SQUAD INFO</span>
            </button>
          </div>
        </section>

        {/* Section 1: Security & Invite Codes */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-black text-[#777777] uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <span className="text-[#555555] font-mono">01 //</span> SECURITY &amp; ACCESS CODES
          </h3>

          <div className="bold-card rounded-2xl border border-[#262626] bg-[#0d0d0d] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase text-white tracking-wider">Access Token Key</p>
                <p className="text-xs font-mono text-[#00FF66] mt-0.5">{currentSquad.inviteCode}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRegenerateCode}
                  className="p-2 bg-[#161616] hover:bg-[#222] border border-[#333] text-white rounded-xl cursor-pointer"
                  title="Generate New Code"
                >
                  <span className="material-symbols-outlined text-base">refresh</span>
                </button>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-2 bg-white text-black font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-white/90"
                >
                  Copy Link
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-[#202020] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Privacy Mode</p>
                <p className="text-[11px] text-[#777] font-mono uppercase">{currentSquad.privacy}</p>
              </div>
              <span className="text-[10px] font-mono bg-[#141414] border border-[#333] px-2.5 py-1 rounded-lg text-[#AAA]">
                ENCRYPTED
              </span>
            </div>
          </div>
        </section>

        {/* Section 2: Preferences & Feedback */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-black text-[#777777] uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <span className="text-[#555555] font-mono">02 //</span> AUDIO &amp; APP PREFERENCES
          </h3>

          <div className="bold-card rounded-2xl border border-[#262626] bg-[#0d0d0d] divide-y divide-[#1f1f1f]">
            {/* Sound FX Toggle */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#161616] border border-[#333] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-base">volume_up</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-white">UI Sound Synthesizer</p>
                  <p className="text-[10px] text-[#777] font-mono">Audio feedback on send, pulse, reactions</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSoundMuted(!soundMuted);
                  showToast(!soundMuted ? 'Sound synthesizer muted' : 'Sound synthesizer active', 'info');
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  !soundMuted ? 'bg-white' : 'bg-[#222]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-transform ${
                    !soundMuted ? 'translate-x-6 bg-black' : 'translate-x-0 bg-[#555]'
                  }`}
                />
              </button>
            </div>

            {/* Comments Toggle */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#161616] border border-[#333] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-base">forum</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Allow Member Comments</p>
                  <p className="text-[10px] text-[#777] font-mono">Thread discussions under posts</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setAllowComments(!allowComments);
                  showToast('Updated discussion preferences');
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  allowComments ? 'bg-white' : 'bg-[#222]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-transform ${
                    allowComments ? 'translate-x-6 bg-black' : 'translate-x-0 bg-[#555]'
                  }`}
                />
              </button>
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#161616] border border-[#333] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-base">notifications</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Live Activity Alerts</p>
                  <p className="text-[10px] text-[#777] font-mono">Broadcast popups for mentions & calls</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPushNotifs(!pushNotifs);
                  showToast('Notification preferences updated');
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  pushNotifs ? 'bg-white' : 'bg-[#222]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-transform ${
                    pushNotifs ? 'translate-x-6 bg-black' : 'translate-x-0 bg-[#555]'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: Data Management & Factory Reset */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-black text-[#777777] uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <span className="text-[#555555] font-mono">03 //</span> SYSTEM STORAGE
          </h3>

          <div className="bold-card rounded-2xl border border-[#262626] bg-[#0d0d0d] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Local Vault Storage</p>
                <p className="text-[10px] text-[#777] font-mono">Synchronized in browser storage</p>
              </div>
              <span className="text-[10px] font-mono text-[#00FF66] bg-[#00FF66]/10 px-2 py-0.5 rounded border border-[#00FF66]/30">
                ACTIVE
              </span>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Reset all demo posts, messages, and settings to original state?')) {
                  resetDemoData();
                }
              }}
              className="w-full py-2.5 rounded-xl bg-[#220a0a] hover:bg-[#331111] border border-[#ff4444]/40 text-[#ff8888] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-base">restore</span>
              <span>Restore Factory Demo Data</span>
            </button>
          </div>
        </section>
      </main>

      {/* Edit Squad Info Modal */}
      {showEditModal && (
        <div
          onClick={() => setShowEditModal(false)}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0d0d0d] border border-[#333] w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <h3 className="font-black text-sm uppercase text-white tracking-wider">
                EDIT SQUAD METADATA
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-[#888] hover:text-white">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveSquadInfo} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#888]">Squad Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#555] focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#888]">Tagline / Bio</label>
                <textarea
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  rows={3}
                  className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#555] focus:outline-none focus:border-white resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#888]">Privacy Access</label>
                <div className="flex gap-2">
                  {(['invite-only', 'members-approval', 'open'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPrivacyInput(p)}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border cursor-pointer ${
                        privacyInput === p
                          ? 'bg-white text-black border-white'
                          : 'bg-[#141414] text-[#888] border-[#262626]'
                      }`}
                    >
                      {p.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-xs font-black uppercase text-[#777] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-white text-black font-black text-xs uppercase tracking-wider shadow-md hover:bg-white/90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
