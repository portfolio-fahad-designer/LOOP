import React from 'react';
import { ScreenType } from '../types';
import { 
  Home, 
  Users, 
  MessageCircle, 
  Image, 
  Settings, 
  User, 
  Plus, 
  Sparkles, 
  Compass,
  Layers
} from 'lucide-react';

interface NavigationProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onOpenCreate: () => void;
}

export const BottomNavBar: React.FC<NavigationProps> = ({
  currentScreen,
  onNavigate,
  onOpenCreate,
}) => {
  // Screens where bottom nav is shown
  const showNav = [
    'landing', 
    'feed', 
    'gallery', 
    'chat', 
    'members', 
    'settings', 
    'profile',
    'onboarding-success'
  ].includes(currentScreen);

  if (!showNav) return null;

  return (
    <>
      {/* Central Floating Action Button (FAB) for Feed / Gallery */}
      {['feed', 'gallery'].includes(currentScreen) && (
        <div className="fixed bottom-24 right-4 z-40 md:bottom-28 md:right-8">
          <button
            onClick={onOpenCreate}
            className="w-14 h-14 bg-[#F2F2F2] text-[#050505] rounded-full flex items-center justify-center shadow-[0_0_24px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-[#333]"
            title="Create New"
          >
            <span className="material-symbols-outlined text-[#050505] text-3xl font-black">add</span>
          </button>
        </div>
      )}

      {/* Floating Center Loop FAB on Feed Screen when mobile */}
      {currentScreen === 'feed' && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] md:hidden">
          <button
            onClick={onOpenCreate}
            className="w-14 h-14 rounded-full bg-[#F2F2F2] flex items-center justify-center text-[#050505] shadow-[0_0_24px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all duration-200 group cursor-pointer border border-[#333]"
          >
            <span className="material-symbols-outlined text-[28px] font-black group-hover:rotate-90 transition-transform duration-300">add</span>
          </button>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[#262626] shadow-[0_-8px_32px_rgba(0,0,0,0.8)] flex justify-around items-center h-20 px-4 pb-2 md:hidden">
        {/* Home / Landing Tab */}
        <button
          onClick={() => onNavigate('landing')}
          className={`flex flex-col items-center justify-center transition-all ${
            currentScreen === 'landing'
              ? 'bg-[#F2F2F2] text-[#050505] rounded-full px-4 py-1 font-bold'
              : 'text-[#888888] hover:text-[#F2F2F2]'
          }`}
        >
          <span className={`material-symbols-outlined text-[22px] ${currentScreen === 'landing' ? 'fill' : ''}`}>home</span>
          <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">Home</span>
        </button>

        {/* Groups / Feed Tab */}
        <button
          onClick={() => onNavigate('feed')}
          className={`flex flex-col items-center justify-center transition-all ${
            ['feed', 'members', 'settings'].includes(currentScreen)
              ? 'bg-[#F2F2F2] text-[#050505] rounded-full px-4 py-1 font-bold'
              : 'text-[#888888] hover:text-[#F2F2F2]'
          }`}
        >
          <span className={`material-symbols-outlined text-[22px] ${['feed', 'members', 'settings'].includes(currentScreen) ? 'fill' : ''}`}>group</span>
          <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">Feed</span>
        </button>

        {/* Gallery / Invites Tab */}
        <button
          onClick={() => onNavigate('gallery')}
          className={`flex flex-col items-center justify-center transition-all ${
            currentScreen === 'gallery'
              ? 'bg-[#F2F2F2] text-[#050505] rounded-full px-4 py-1 font-bold'
              : 'text-[#888888] hover:text-[#F2F2F2] relative'
          }`}
        >
          <span className={`material-symbols-outlined text-[22px] ${currentScreen === 'gallery' ? 'fill' : ''}`}>photo_library</span>
          <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">Vault</span>
        </button>

        {/* Chat Tab */}
        <button
          onClick={() => onNavigate('chat')}
          className={`flex flex-col items-center justify-center transition-all ${
            currentScreen === 'chat'
              ? 'bg-[#F2F2F2] text-[#050505] rounded-full px-4 py-1 font-bold'
              : 'text-[#888888] hover:text-[#F2F2F2] relative'
          }`}
        >
          <span className={`material-symbols-outlined text-[22px] ${currentScreen === 'chat' ? 'fill' : ''}`}>chat_bubble</span>
          <span className="absolute -top-0.5 right-2 w-2 h-2 bg-white rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">Chat</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center transition-all ${
            currentScreen === 'profile'
              ? 'bg-[#F2F2F2] text-[#050505] rounded-full px-4 py-1 font-bold'
              : 'text-[#888888] hover:text-[#F2F2F2]'
          }`}
        >
          <span className={`material-symbols-outlined text-[22px] ${currentScreen === 'profile' ? 'fill' : ''}`}>person</span>
          <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">Profile</span>
        </button>
      </nav>
    </>
  );
};

export const TopScreenSwitcher: React.FC<{
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}> = ({ currentScreen, onNavigate }) => {
  const screens: { id: ScreenType; label: string; icon: string; index: string }[] = [
    { id: 'landing', label: 'Landing', icon: 'home', index: '00' },
    { id: 'feed', label: 'Feed', icon: 'dynamic_feed', index: '01' },
    { id: 'gallery', label: 'Vault', icon: 'photo_library', index: '02' },
    { id: 'chat', label: 'Chat', icon: 'chat', index: '03' },
    { id: 'members', label: 'Members', icon: 'group', index: '04' },
    { id: 'settings', label: 'Settings', icon: 'settings', index: '05' },
    { id: 'profile', label: 'Profile', icon: 'person', index: '06' },
    { id: 'profile-setup', label: 'Setup', icon: 'edit', index: '07' },
    { id: 'onboarding-success', label: 'Launch', icon: 'rocket_launch', index: '08' },
    { id: 'auth', label: 'Auth', icon: 'lock', index: '09' },
  ];

  return (
    <aside aria-label="Screen View Selector" className="fixed top-0 left-0 right-0 z-[100] bg-[#050505]/95 backdrop-blur-md border-b border-[#262626] px-4 py-2 flex items-center justify-between overflow-x-auto no-scrollbar gap-3">
      <div className="flex items-center gap-3 shrink-0 pr-3 border-r border-[#262626]">
        <span className="font-black text-sm tracking-tighter text-[#F2F2F2] uppercase">LOOP—SYS</span>
        <span className="text-[9px] uppercase font-black tracking-[0.25em] text-[#888888] bg-[#141414] border border-[#262626] px-2 py-0.5 rounded">V2.4</span>
      </div>

      <nav aria-label="Prototype Screens" className="flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar py-0.5">
        {screens.map((screen) => {
          const isActive = currentScreen === screen.id;
          return (
            <button
              key={screen.id}
              onClick={() => onNavigate(screen.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#F2F2F2] text-[#050505] shadow-[0_0_16px_rgba(255,255,255,0.2)]'
                  : 'bg-[#111111] text-[#999999] hover:text-[#F2F2F2] hover:bg-[#1a1a1a] border border-[#222222]'
              }`}
            >
              <span className="text-[9px] opacity-50 font-mono">{screen.index}</span>
              <span className="material-symbols-outlined text-[13px]">{screen.icon}</span>
              <span>{screen.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
