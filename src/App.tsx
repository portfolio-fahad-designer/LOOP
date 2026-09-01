import React, { useState } from 'react';
import { ScreenType } from './types';
import { AppProvider, useApp } from './context/AppContext';
import { AppNavbar, BottomNavBar } from './components/Navigation';
import { CreateModal } from './components/CreateModal';

// Screens
import { LandingScreen } from './components/screens/LandingScreen';
import { GroupFeedScreen } from './components/screens/GroupFeedScreen';
import { GalleryScreen } from './components/screens/GalleryScreen';
import { GroupChatScreen } from './components/screens/GroupChatScreen';
import { GroupSettingsScreen } from './components/screens/GroupSettingsScreen';
import { MembersScreen } from './components/screens/MembersScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { ProfileSetupScreen } from './components/screens/ProfileSetupScreen';
import { OnboardingSuccessScreen } from './components/screens/OnboardingSuccessScreen';
import { AuthScreen } from './components/screens/AuthScreen';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('feed');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toasts, removeToast } = useApp();

  const showAppNavbar = ['feed', 'gallery', 'chat', 'members', 'settings', 'profile'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F2F2F2] flex flex-col font-sans selection:bg-[#F2F2F2] selection:text-[#050505]">
      {/* Global Application Navbar with Squad Switcher & Navigation */}
      {showAppNavbar && (
        <AppNavbar
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          onOpenCreate={() => setIsCreateModalOpen(true)}
        />
      )}

      {/* Screen Render Canvas */}
      <div className="flex-1 w-full">
        {currentScreen === 'landing' && (
          <LandingScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'feed' && (
          <GroupFeedScreen
            onNavigate={setCurrentScreen}
            onOpenCreate={() => setIsCreateModalOpen(true)}
          />
        )}

        {currentScreen === 'gallery' && (
          <GalleryScreen
            onNavigate={setCurrentScreen}
            onOpenCreate={() => setIsCreateModalOpen(true)}
          />
        )}

        {currentScreen === 'chat' && (
          <GroupChatScreen
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'settings' && (
          <GroupSettingsScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'members' && (
          <MembersScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'profile-setup' && (
          <ProfileSetupScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'onboarding-success' && (
          <OnboardingSuccessScreen
            onNavigate={setCurrentScreen}
            onOpenCreate={() => setIsCreateModalOpen(true)}
          />
        )}

        {currentScreen === 'auth' && (
          <AuthScreen onNavigate={setCurrentScreen} />
        )}
      </div>

      {/* Bottom Floating Navigation for Mobile / Tablet */}
      <BottomNavBar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onOpenCreate={() => setIsCreateModalOpen(true)}
      />

      {/* Creation Modal for Posts, Stories, Polls & Media */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Dynamic Toast Notifications Hub */}
      {toasts.length > 0 && (
        <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              onClick={() => removeToast(toast.id)}
              className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border backdrop-blur-xl shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 cursor-pointer ${
                toast.type === 'success'
                  ? 'bg-[#002b11]/90 border-[#00FF66]/40 text-[#E0FFE0]'
                  : toast.type === 'error'
                  ? 'bg-[#3b0b0b]/90 border-[#FF4444]/40 text-[#FFE0E0]'
                  : 'bg-[#181818]/90 border-[#333333] text-[#F2F2F2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">
                  {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
                </span>
                <span className="text-xs font-bold tracking-tight">{toast.message}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeToast(toast.id);
                }}
                className="text-xs opacity-60 hover:opacity-100 p-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

