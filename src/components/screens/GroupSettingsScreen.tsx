import React, { useState } from 'react';
import { ScreenType } from '../../types';

interface GroupSettingsScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const GroupSettingsScreen: React.FC<GroupSettingsScreenProps> = ({ onNavigate }) => {
  const [inviteCode, setInviteCode] = useState('loop.app/join/DSQD-2024');
  const [allowMemberInvites, setAllowMemberInvites] = useState(true);
  const [copied, setCopied] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('Purple Pulse');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [groupName, setGroupName] = useState('Design Squad');
  const [groupDesc, setGroupDesc] = useState('UI/UX, prototyping, and cyberpunk design experiments.');
  const [dangerAction, setDangerAction] = useState<'leave' | 'delete' | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://${inviteCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    const randomCode = `DSQD-${Math.floor(1000 + Math.random() * 9000)}`;
    setInviteCode(`loop.app/join/${randomCode}`);
  };

  const themes = ['Purple Pulse', 'Cyan Matrix', 'Pink Haze', 'Midnight Noir'];

  return (
    <div className="bg-[#050505] text-[#F2F2F2] min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-10 left-0 w-full z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-[#262626] flex items-center justify-between px-5 h-16">
        <button
          onClick={() => onNavigate('feed')}
          className="text-[#999999] hover:text-[#F2F2F2] transition-colors p-2 rounded-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="arrow_back">arrow_back</span>
        </button>
        <div className="flex items-center gap-3">
          <h1 className="font-black text-xl tracking-tight text-[#F2F2F2] uppercase">SETTINGS</h1>
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#888888] bg-[#141414] border border-[#262626] px-2 py-0.5 rounded-full">
            CONFIG
          </span>
        </div>
        <button
          onClick={() => onNavigate('feed')}
          className="text-[#999999] hover:text-[#F2F2F2] transition-colors p-2 rounded-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="more_vert">more_vert</span>
        </button>
      </header>

      <main className="pt-28 px-4 max-w-xl mx-auto space-y-8">
        {/* Header Section */}
        <section className="flex flex-col items-center space-y-4">
          <div className="relative group cursor-pointer" onClick={() => setShowNameModal(true)}>
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#333333] relative shadow-2xl">
              <img
                alt="Group Icon"
                className="object-cover w-full h-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDopw0GXgwEAQlu_rz-35beGfRqW5u-BlNkIeufFUuVNgxxsptQDKJMUDynPZ8GKqy-4pUvfVctNimZfvwNhZaQHn20gtupPlGBWnmU27WDcsEwALt1in4Rvorz3Qui08B2epWmAQ7dsF9TDxHueNM26KEoalnLCogtR9DF1x-oNRmnZSaVhGqO17ZVc3e4zzFHAiCOPMlaGM0-3YcqKNxC4Hv_M4dWHzAryaKk06NO8S8fFwQnA0o"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full backdrop-blur-sm">
                <span className="material-symbols-outlined text-white text-[20px]" data-icon="edit">edit</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="font-black text-2xl text-[#F2F2F2] uppercase tracking-tight">{groupName}</h2>
            <p className="text-xs text-[#888888] max-w-xs mx-auto mt-1 leading-relaxed">{groupDesc}</p>
            <button
              onClick={() => {
                alert('Banner upload dialog opened! Pick an image for the group banner.');
              }}
              className="mt-3 px-4 py-1.5 bg-[#141414] text-[#AAAAAA] hover:text-[#F2F2F2] rounded-full font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center space-x-1.5 mx-auto border border-[#262626] cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs" data-icon="image">image</span>
              <span>CHANGE BANNER</span>
            </button>
          </div>
        </section>

        {/* Section 1: Identity & Theme */}
        <section className="space-y-2">
          <h3 className="text-[10px] font-black text-[#777777] uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <span className="text-[#555555] font-mono">01 //</span> IDENTITY & VISUALS
          </h3>
          <div className="bold-card rounded-2xl border border-[#262626] bg-[#0d0d0d] overflow-hidden">
            <button
              onClick={() => setShowNameModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-[#141414] transition-colors group border-b border-[#1f1f1f] text-left cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-center text-[#AAAAAA] group-hover:text-[#F2F2F2] transition-colors">
                  <span className="material-symbols-outlined text-[18px]" data-icon="edit_document">edit_document</span>
                </div>
                <span className="font-black text-xs uppercase tracking-wider text-[#F2F2F2]">Edit Name &amp; Description</span>
              </div>
              <span className="material-symbols-outlined text-[#666666] text-[18px]" data-icon="chevron_right">chevron_right</span>
            </button>

            <button
              onClick={() => setShowThemeModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-[#141414] transition-colors group border-b border-[#1f1f1f] text-left cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-center text-[#AAAAAA] group-hover:text-[#F2F2F2] transition-colors">
                  <span className="material-symbols-outlined text-[18px]" data-icon="palette">palette</span>
                </div>
                <div className="text-left">
                  <div className="font-black text-xs uppercase tracking-wider text-[#F2F2F2]">Custom Theme</div>
                  <div className="text-[10px] text-[#777777] font-mono uppercase mt-0.5">{currentTheme}</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#666666] text-[18px]" data-icon="chevron_right">chevron_right</span>
            </button>

            <button
              onClick={() => {
                alert('Group Icon & Banner media settings opened.');
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-[#141414] transition-colors group text-left cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-center text-[#AAAAAA] group-hover:text-[#F2F2F2] transition-colors">
                  <span className="material-symbols-outlined text-[18px]" data-icon="wallpaper">wallpaper</span>
                </div>
                <span className="font-black text-xs uppercase tracking-wider text-[#F2F2F2]">Squad Icon &amp; Banner</span>
              </div>
              <span className="material-symbols-outlined text-[#666666] text-[18px]" data-icon="chevron_right">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Section 2: Member Management */}
        <section className="space-y-2">
          <h3 className="text-[10px] font-black text-[#777777] uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <span className="text-[#555555] font-mono">02 //</span> ROSTER & PERMISSIONS
          </h3>
          <div className="bold-card rounded-2xl border border-[#262626] bg-[#0d0d0d] overflow-hidden">
            <button
              onClick={() => onNavigate('members')}
              className="w-full flex items-center justify-between p-4 hover:bg-[#141414] transition-colors group border-b border-[#1f1f1f] text-left cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-center text-[#AAAAAA] group-hover:text-[#F2F2F2] transition-colors">
                  <span className="material-symbols-outlined text-[18px]" data-icon="group">group</span>
                </div>
                <span className="font-black text-xs uppercase tracking-wider text-[#F2F2F2]">Squad Members (12)</span>
              </div>
              <span className="material-symbols-outlined text-[#666666] text-[18px]" data-icon="chevron_right">chevron_right</span>
            </button>

            <button
              onClick={() => onNavigate('members')}
              className="w-full flex items-center justify-between p-4 hover:bg-[#141414] transition-colors group border-b border-[#1f1f1f] text-left cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-center text-[#AAAAAA] group-hover:text-[#F2F2F2] transition-colors">
                  <span className="material-symbols-outlined text-[18px]" data-icon="shield_person">shield_person</span>
                </div>
                <span className="font-black text-xs uppercase tracking-wider text-[#F2F2F2]">Roles &amp; Access Keys</span>
              </div>
              <span className="material-symbols-outlined text-[#666666] text-[18px]" data-icon="chevron_right">chevron_right</span>
            </button>

            <button
              onClick={() => {
                alert('Pending join requests: 2 users waiting for approval.');
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-[#141414] transition-colors group text-left cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-center text-[#AAAAAA] group-hover:text-[#F2F2F2] transition-colors relative">
                  <span className="material-symbols-outlined text-[18px]" data-icon="person_add">person_add</span>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full border border-black"></span>
                </div>
                <span className="font-black text-xs uppercase tracking-wider text-[#F2F2F2]">Pending Requests (2)</span>
              </div>
              <span className="material-symbols-outlined text-[#666666] text-[18px]" data-icon="chevron_right">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Section 3: Invites */}
        <section className="space-y-2">
          <h3 className="text-[10px] font-black text-[#777777] uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <span className="text-[#555555] font-mono">03 //</span> SQUAD INVITATIONS
          </h3>
          <div className="bold-card rounded-2xl border border-[#262626] bg-[#0d0d0d] p-4 space-y-4">
            <div className="bg-[#141414] rounded-xl p-2.5 flex items-center justify-between border border-[#262626]">
              <span className="text-xs font-mono text-[#CCCCCC] truncate px-2 select-all">
                {inviteCode}
              </span>
              <button
                onClick={handleCopyLink}
                className="p-2 text-[#AAAAAA] hover:text-[#F2F2F2] rounded-lg transition-colors cursor-pointer"
                title="Copy Invite Link"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copied ? 'done' : 'content_copy'}
                </span>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleRegenerate}
                className="px-3.5 py-1.5 bg-[#141414] hover:bg-[#1a1a1a] text-[#AAAAAA] hover:text-[#F2F2F2] border border-[#262626] font-bold text-[10px] uppercase tracking-wider rounded-full transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs" data-icon="refresh">refresh</span>
                <span>REGENERATE</span>
              </button>

              <label className="flex items-center cursor-pointer space-x-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#888888]">Allow member invites</span>
                <input
                  type="checkbox"
                  checked={allowMemberInvites}
                  onChange={(e) => setAllowMemberInvites(e.target.checked)}
                  className="sr-only"
                />
                <div
                  onClick={() => setAllowMemberInvites(!allowMemberInvites)}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer border ${
                    allowMemberInvites ? 'bg-[#F2F2F2] border-[#F2F2F2]' : 'bg-[#1a1a1a] border-[#333333]'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full absolute top-0.5 transition-transform ${
                      allowMemberInvites ? 'left-5 bg-[#050505]' : 'left-0.5 bg-[#777777]'
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* Section 4: Danger Zone */}
        <section className="space-y-2">
          <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <span className="text-red-700 font-mono">04 //</span> DANGER ZONE
          </h3>
          <div className="rounded-2xl border border-red-900/30 bg-red-950/10 overflow-hidden">
            <button
              onClick={() => setDangerAction('leave')}
              className="w-full flex items-center space-x-3.5 p-4 hover:bg-red-950/30 transition-colors border-b border-red-900/20 text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-red-400 text-[18px]" data-icon="logout">logout</span>
              <span className="font-black text-xs uppercase tracking-wider text-red-400">Leave Squad</span>
            </button>
            <button
              onClick={() => setDangerAction('delete')}
              className="w-full flex items-center space-x-3.5 p-4 hover:bg-red-950/30 transition-colors text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-red-500 text-[18px]" data-icon="delete_forever">delete_forever</span>
              <span className="font-black text-xs uppercase tracking-wider text-red-500">Delete Squad Permanently</span>
            </button>
          </div>
        </section>
      </main>

      {/* Theme Picker Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 z-[90] bg-[#050505]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] w-full max-w-sm rounded-2xl p-6 border border-[#262626] shadow-2xl space-y-4">
            <h3 className="font-black text-base text-[#F2F2F2] uppercase tracking-tight">SELECT SQUAD PALETTE</h3>
            <div className="space-y-2">
              {themes.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setCurrentTheme(t);
                    setShowThemeModal(false);
                  }}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    currentTheme === t
                      ? 'border-[#F2F2F2] bg-[#F2F2F2] text-[#050505]'
                      : 'border-[#262626] bg-[#141414] text-[#AAAAAA] hover:text-[#F2F2F2]'
                  }`}
                >
                  <span>{t}</span>
                  {currentTheme === t && <span className="material-symbols-outlined text-[#050505] text-sm">check</span>}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowThemeModal(false)}
              className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#777777] hover:text-[#F2F2F2] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Name Modal */}
      {showNameModal && (
        <div className="fixed inset-0 z-[90] bg-[#050505]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] w-full max-w-md rounded-2xl p-6 border border-[#262626] shadow-2xl space-y-4">
            <h3 className="font-black text-base text-[#F2F2F2] uppercase tracking-tight">EDIT SQUAD IDENTITY</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-[#777777] font-black uppercase tracking-widest">Squad Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-xl p-3 text-sm text-[#F2F2F2] mt-1 font-sans focus:outline-none focus:border-[#666666]"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#777777] font-black uppercase tracking-widest">Description</label>
                <textarea
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-[#141414] border border-[#262626] rounded-xl p-3 text-sm text-[#F2F2F2] mt-1 resize-none font-sans focus:outline-none focus:border-[#666666]"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-3">
              <button
                onClick={() => setShowNameModal(false)}
                className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#777777] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNameModal(false)}
                className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-[#F2F2F2] text-[#050505] hover:bg-white shadow-[0_0_16px_rgba(255,255,255,0.2)] cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone Action Modal */}
      {dangerAction && (
        <div className="fixed inset-0 z-[95] bg-[#050505]/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] w-full max-w-sm rounded-2xl p-6 border border-red-900/40 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950/50 text-red-400 border border-red-900/40 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <h3 className="font-black text-base text-[#F2F2F2] uppercase tracking-tight">
              {dangerAction === 'leave' ? 'LEAVE DESIGN SQUAD?' : 'DELETE DESIGN SQUAD?'}
            </h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              {dangerAction === 'leave'
                ? "You will lose access to all shared photos, logs, and circles until an admin re-invites you."
                : "This action is permanent and cannot be reversed. All shared media, chat logs, and roster permissions will be wiped."}
            </p>
            <div className="flex gap-2 justify-center pt-3">
              <button
                onClick={() => setDangerAction(null)}
                className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#777777] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(dangerAction === 'leave' ? 'Left group successfully.' : 'Group deleted.');
                  setDangerAction(null);
                  onNavigate('landing');
                }}
                className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-red-600 hover:bg-red-500 text-white cursor-pointer"
              >
                Confirm {dangerAction === 'leave' ? 'Leave' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
