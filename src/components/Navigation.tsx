import React, { useState, useRef, useEffect } from 'react';
import { ScreenType, User } from '../types';
import { useApp } from '../context/AppContext';
import { allUsers } from '../data/mockData';

interface NavigationProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onOpenCreate: () => void;
}

export const AppNavbar: React.FC<NavigationProps> = ({
  currentScreen,
  onNavigate,
  onOpenCreate,
}) => {
  const {
    currentUser,
    currentSquad,
    allSquads,
    switchSquad,
    switchUser,
    soundMuted,
    setSoundMuted,
    createSquad,
    joinSquadByCode,
    showToast,
  } = useApp();

  const [isSquadMenuOpen, setIsSquadMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateSquadModal, setShowCreateSquadModal] = useState(false);

  // New squad form state
  const [squadName, setSquadName] = useState('');
  const [squadTagline, setSquadTagline] = useState('');
  const [squadPrivacy, setSquadPrivacy] = useState<'invite-only' | 'members-approval' | 'open'>('invite-only');
  const [inviteCodeInput, setInviteCodeInput] = useState('');

  const squadMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (squadMenuRef.current && !squadMenuRef.current.contains(e.target as Node)) {
        setIsSquadMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateSquadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!squadName.trim()) return;
    createSquad(squadName, squadTagline, undefined, squadPrivacy);
    setSquadName('');
    setSquadTagline('');
    setShowCreateSquadModal(false);
    setIsSquadMenuOpen(false);
    onNavigate('feed');
  };

  const handleJoinSquadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;
    joinSquadByCode(inviteCodeInput);
    setInviteCodeInput('');
    setShowJoinModal(false);
    setIsSquadMenuOpen(false);
    onNavigate('feed');
  };

  const isAppScreen = ['feed', 'gallery', 'chat', 'members', 'settings', 'profile'].includes(currentScreen);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-[#050505]/95 backdrop-blur-xl border-b border-[#262626] h-16 px-4 md:px-8 flex items-center justify-between shadow-2xl">
        {/* Left: Brand + Active Squad Selector */}
        <div className="flex items-center gap-3 md:gap-5">
          <button
            onClick={() => onNavigate('feed')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="font-black text-xl tracking-tighter text-white uppercase group-hover:text-white/80 transition-colors">
              LOOP
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse"></span>
          </button>

          <div className="h-5 w-px bg-[#262626] hidden sm:block" />

          {/* Squad Dropdown Selector */}
          <div className="relative" ref={squadMenuRef}>
            <button
              onClick={() => setIsSquadMenuOpen(!isSquadMenuOpen)}
              className="flex items-center gap-2 bg-[#121212] hover:bg-[#1c1c1c] border border-[#2a2a2a] hover:border-[#444] px-3 py-1.5 rounded-full transition-all cursor-pointer"
            >
              <img
                src={currentSquad.avatar}
                alt={currentSquad.name}
                className="w-5 h-5 rounded-full object-cover border border-[#444]"
              />
              <div className="text-left hidden sm:block max-w-[130px] truncate">
                <span className="text-[11px] font-black text-white uppercase tracking-tight block truncate">
                  {currentSquad.name}
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#888] bg-[#1a1a1a] px-1.5 py-0.2 rounded border border-[#333] hidden md:inline">
                {currentSquad.privacy === 'invite-only' ? 'KEY' : 'OPEN'}
              </span>
              <span className="material-symbols-outlined text-[16px] text-[#888]">
                {isSquadMenuOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Squad Selector Menu */}
            {isSquadMenuOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-[#0d0d0d] border border-[#333] rounded-2xl shadow-2xl overflow-hidden py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-[#222]">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#777]">SWITCH SQUADREALM</p>
                </div>

                <div className="max-h-48 overflow-y-auto no-scrollbar py-1">
                  {allSquads.map((squad) => (
                    <button
                      key={squad.id}
                      onClick={() => {
                        switchSquad(squad.id);
                        setIsSquadMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 flex items-center justify-between text-left hover:bg-[#181818] transition-colors cursor-pointer ${
                        squad.id === currentSquad.id ? 'bg-[#181818]/70' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={squad.avatar}
                          alt={squad.name}
                          className="w-7 h-7 rounded-full object-cover border border-[#444] shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-black text-xs text-white uppercase tracking-tight truncate">
                            {squad.name}
                          </p>
                          <p className="text-[9px] text-[#777] font-mono">
                            {squad.memberCount} members • {squad.inviteCode}
                          </p>
                        </div>
                      </div>
                      {squad.id === currentSquad.id && (
                        <span className="material-symbols-outlined text-sm text-[#00FF66]">check</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#222] px-2 space-y-1">
                  <button
                    onClick={() => {
                      setIsSquadMenuOpen(false);
                      setShowCreateSquadModal(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#161616] hover:bg-[#222] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    <span>Create New Squad</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsSquadMenuOpen(false);
                      setShowJoinModal(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-transparent hover:bg-[#161616] text-[#AAA] hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">vpn_key</span>
                    <span>Join with Invite Code</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Desktop Navigation Hub */}
        {isAppScreen && (
          <nav className="hidden lg:flex items-center gap-1 bg-[#101010] p-1 rounded-full border border-[#262626]">
            <button
              onClick={() => onNavigate('feed')}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                currentScreen === 'feed'
                  ? 'bg-white text-black shadow'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">dynamic_feed</span>
              <span>Feed</span>
            </button>

            <button
              onClick={() => onNavigate('gallery')}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                currentScreen === 'gallery'
                  ? 'bg-white text-black shadow'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">photo_library</span>
              <span>Vault</span>
            </button>

            <button
              onClick={() => onNavigate('chat')}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer relative ${
                currentScreen === 'chat'
                  ? 'bg-white text-black shadow'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">forum</span>
              <span>Chat</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse"></span>
            </button>

            <button
              onClick={() => onNavigate('members')}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                currentScreen === 'members'
                  ? 'bg-white text-black shadow'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">groups</span>
              <span>Roster</span>
            </button>

            <button
              onClick={() => onNavigate('settings')}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                currentScreen === 'settings'
                  ? 'bg-white text-black shadow'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">settings</span>
              <span>Settings</span>
            </button>
          </nav>
        )}

        {/* Right: Actions & User Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={() => {
              setSoundMuted(!soundMuted);
              showToast(!soundMuted ? 'Sound FX muted' : 'Sound FX synthesizer active', 'info');
            }}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              !soundMuted
                ? 'bg-[#181818] border-[#444] text-white hover:border-white'
                : 'bg-[#101010] border-[#222] text-[#666] hover:text-[#999]'
            }`}
            title={soundMuted ? 'Unmute UI Synthesizer' : 'Mute UI Synthesizer'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {soundMuted ? 'volume_off' : 'volume_up'}
            </span>
          </button>

          {/* Quick Broadcast Button */}
          <button
            onClick={onOpenCreate}
            className="px-3.5 py-1.5 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-white/90 active:scale-95 transition-all flex items-center gap-1.5 shadow-[0_0_16px_rgba(255,255,255,0.2)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] font-black">add</span>
            <span className="hidden sm:inline">Post</span>
          </button>

          {/* User Profile Pill / Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2 bg-[#121212] hover:bg-[#1a1a1a] border border-[#2a2a2a] rounded-full transition-all cursor-pointer"
            >
              <span className="text-[11px] font-black text-white uppercase hidden md:inline">
                {currentUser.name.split(' ')[0]}
              </span>
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#444]"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#00FF66] border border-black"></span>
              </div>
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0d0d0d] border border-[#333] rounded-2xl shadow-2xl overflow-hidden py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-[#222] flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#444]"
                  />
                  <div>
                    <p className="font-black text-xs text-white uppercase tracking-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-[#888] font-mono">{currentUser.username}</p>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onNavigate('profile');
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-black uppercase text-[#CCC] hover:text-white hover:bg-[#181818] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onNavigate('settings');
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-black uppercase text-[#CCC] hover:text-white hover:bg-[#181818] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">settings</span>
                    <span>Squad Settings</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-[#222]">
                  <p className="px-4 py-1 text-[9px] font-black uppercase tracking-widest text-[#666]">
                    SWITCH OPERATOR DEMO
                  </p>
                  {Object.values(allUsers).map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u);
                        setIsProfileMenuOpen(false);
                      }}
                      className={`w-full px-4 py-1.5 text-left text-xs font-mono flex items-center justify-between hover:bg-[#181818] cursor-pointer ${
                        u.id === currentUser.id ? 'text-[#00FF66]' : 'text-[#888] hover:text-white'
                      }`}
                    >
                      <span className="truncate">{u.name} ({u.role})</span>
                      {u.id === currentUser.id && <span className="material-symbols-outlined text-xs">check</span>}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#222] px-2">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onNavigate('landing');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#220a0a] hover:bg-[#331111] text-[#ff8888] text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Create Squad Modal */}
      {showCreateSquadModal && (
        <div
          onClick={() => setShowCreateSquadModal(false)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0d0d0d] border border-[#333] w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <h3 className="font-black text-base uppercase text-white tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-white">add_circle</span>
                CREATE A NEW SQUADREALM
              </h3>
              <button onClick={() => setShowCreateSquadModal(false)} className="text-[#888] hover:text-white">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSquadSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#888]">Squad Name</label>
                <input
                  type="text"
                  value={squadName}
                  onChange={(e) => setSquadName(e.target.value)}
                  placeholder="e.g. CYBER CREATIVE LAB"
                  className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#555] focus:outline-none focus:border-white uppercase"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#888]">Tagline / Directive</label>
                <textarea
                  value={squadTagline}
                  onChange={(e) => setSquadTagline(e.target.value)}
                  placeholder="What is this collective dedicated to?..."
                  rows={3}
                  className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#555] focus:outline-none focus:border-white resize-none font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#888]">Access Protocol</label>
                <div className="flex gap-2">
                  {(['invite-only', 'members-approval', 'open'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSquadPrivacy(p)}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border cursor-pointer ${
                        squadPrivacy === p
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
                  onClick={() => setShowCreateSquadModal(false)}
                  className="px-4 py-2 text-xs font-black uppercase text-[#777] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-black text-xs uppercase tracking-wider shadow-md hover:bg-white/90 cursor-pointer"
                >
                  Launch Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join with Invite Code Modal */}
      {showJoinModal && (
        <div
          onClick={() => setShowJoinModal(false)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0d0d0d] border border-[#333] w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <h3 className="font-black text-base uppercase text-white tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-white">vpn_key</span>
                JOIN SQUAD BY ACCESS KEY
              </h3>
              <button onClick={() => setShowJoinModal(false)} className="text-[#888] hover:text-white">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleJoinSquadSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#888]">Invite Access Key</label>
                <input
                  type="text"
                  value={inviteCodeInput}
                  onChange={(e) => setInviteCodeInput(e.target.value)}
                  placeholder="e.g. SQD-8821 or DSQD-2024"
                  className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-3 text-sm text-white font-mono placeholder:text-[#555] focus:outline-none focus:border-white uppercase"
                  required
                  autoFocus
                />
              </div>

              <p className="text-[11px] text-[#777] leading-relaxed">
                Enter any 8-character squad invite code or test with <span className="text-white font-mono">SQD-8821</span> or <span className="text-white font-mono">SQD-4091</span>.
              </p>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 text-xs font-black uppercase text-[#777] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-black text-xs uppercase tracking-wider shadow-md hover:bg-white/90 cursor-pointer"
                >
                  Authenticate &amp; Enter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export const BottomNavBar: React.FC<NavigationProps> = ({
  currentScreen,
  onNavigate,
  onOpenCreate,
}) => {
  // Screens where bottom nav is shown
  const showNav = [
    'feed', 
    'gallery', 
    'chat', 
    'members', 
    'settings', 
    'profile',
  ].includes(currentScreen);

  if (!showNav) return null;

  return (
    <>
      {/* Central Floating Action Button (FAB) for Feed / Gallery on desktop */}
      {['feed', 'gallery'].includes(currentScreen) && (
        <div className="fixed bottom-24 right-4 z-40 md:bottom-10 md:right-10 hidden md:block">
          <button
            onClick={onOpenCreate}
            className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_24px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-[#333]"
            title="Create Post / Story / Vault"
          >
            <span className="material-symbols-outlined text-black text-3xl font-black">add</span>
          </button>
        </div>
      )}

      {/* Bottom Navigation Bar on Mobile */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[#262626] shadow-[0_-8px_32px_rgba(0,0,0,0.8)] flex justify-around items-center h-20 px-4 pb-2 lg:hidden">
        {/* Feed Tab */}
        <button
          onClick={() => onNavigate('feed')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            currentScreen === 'feed'
              ? 'bg-white text-black rounded-full px-4 py-1.5 font-bold'
              : 'text-[#888888] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">dynamic_feed</span>
          <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">Feed</span>
        </button>

        {/* Gallery / Vault Tab */}
        <button
          onClick={() => onNavigate('gallery')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            currentScreen === 'gallery'
              ? 'bg-white text-black rounded-full px-4 py-1.5 font-bold'
              : 'text-[#888888] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">photo_library</span>
          <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">Vault</span>
        </button>

        {/* Center Floating Action for Mobile */}
        <button
          onClick={onOpenCreate}
          className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_16px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer -mt-4 border-2 border-black"
          title="Create New"
        >
          <span className="material-symbols-outlined text-2xl font-black">add</span>
        </button>

        {/* Chat Tab */}
        <button
          onClick={() => onNavigate('chat')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer relative ${
            currentScreen === 'chat'
              ? 'bg-white text-black rounded-full px-4 py-1.5 font-bold'
              : 'text-[#888888] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">forum</span>
          <span className="absolute -top-0.5 right-2 w-2 h-2 bg-[#00FF66] rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">Chat</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            currentScreen === 'profile'
              ? 'bg-white text-black rounded-full px-4 py-1.5 font-bold'
              : 'text-[#888888] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">person</span>
          <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">Profile</span>
        </button>
      </nav>
    </>
  );
};
