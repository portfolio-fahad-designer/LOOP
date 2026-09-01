import React, { useState, useRef } from 'react';
import { ScreenType } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProfileScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const {
    currentUser,
    updateProfile,
    posts,
    allSquads,
    switchSquad,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'loops' | 'vault' | 'squads'>('loops');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(currentUser.bio || '');
  const [nameInput, setNameInput] = useState(currentUser.name);
  const [usernameInput, setUsernameInput] = useState(currentUser.username);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userPosts = posts.filter((p) => p.author.id === currentUser.id || p.author.name === currentUser.name);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateProfile({ avatar: reader.result });
          showToast('Avatar picture updated');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: nameInput.trim(),
      username: usernameInput.trim().startsWith('@') ? usernameInput.trim() : `@${usernameInput.trim()}`,
      bio: bioInput.trim(),
    });
    setIsEditingBio(false);
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
            <h1 className="font-black text-xl tracking-tight text-[#F2F2F2] uppercase">OPERATOR ID</h1>
            <p className="text-[10px] text-[#777] font-mono">PERSONAL PROFILE &amp; BADGES</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('profile-setup')}
          className="px-3.5 py-1.5 rounded-full bg-[#181818] hover:bg-[#222] border border-[#333] text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Hidden file picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Main Profile Canvas */}
      <main className="px-4 max-w-xl mx-auto space-y-6">
        {/* Profile Card Header */}
        <section className="bold-card rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden border border-[#262626] bg-[#0d0d0d]">
          {/* Large Avatar */}
          <div
            className="relative mb-4 group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            title="Change Avatar"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#444444] relative shadow-2xl">
              <img
                alt={currentUser.name}
                className="w-full h-full object-cover"
                src={currentUser.avatar}
              />
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#F2F2F2] text-[#050505] rounded-full flex items-center justify-center border border-black shadow">
              <span className="material-symbols-outlined text-[14px]">edit</span>
            </div>
          </div>

          {/* Name and Handle */}
          <div className="flex items-center gap-2">
            <h2 className="font-black text-2xl text-[#F2F2F2] uppercase tracking-tight">{currentUser.name}</h2>
            <span className="material-symbols-outlined text-[#F2F2F2] text-[18px]">verified</span>
          </div>
          <p className="text-xs text-[#888888] font-mono mt-0.5">{currentUser.username}</p>

          {/* Bio */}
          <p className="text-xs text-[#AAAAAA] max-w-md mt-3 leading-relaxed font-sans">
            {currentUser.bio || 'Digital designer, creative coder, and spatial aestheticist.'}
          </p>

          <button
            onClick={() => {
              setNameInput(currentUser.name);
              setUsernameInput(currentUser.username);
              setBioInput(currentUser.bio || '');
              setIsEditingBio(true);
            }}
            className="mt-4 px-4 py-1.5 rounded-full bg-[#161616] hover:bg-[#222] border border-[#333] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xs">tune</span>
            <span>EDIT CREDENTIALS</span>
          </button>

          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-2 w-full mt-6 pt-5 border-t border-[#262626]">
            <div className="flex flex-col items-center">
              <span className="font-black text-xl text-[#F2F2F2]">{allSquads.length}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#777777] mt-0.5">Circles</span>
            </div>
            <div className="flex flex-col items-center border-x border-[#262626]">
              <span className="font-black text-xl text-[#F2F2F2]">{userPosts.length}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#777777] mt-0.5">Posts</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-black text-xl text-[#F2F2F2]">2.4k</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#777777] mt-0.5">Pulses</span>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="flex border-b border-[#262626] bg-[#0d0d0d] rounded-2xl p-1 gap-1">
          <button
            onClick={() => setActiveTab('loops')}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'loops'
                ? 'bg-[#F2F2F2] text-[#050505] shadow'
                : 'text-[#777777] hover:text-[#AAAAAA]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">feed</span>
            My Posts ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('squads')}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'squads'
                ? 'bg-[#F2F2F2] text-[#050505] shadow'
                : 'text-[#777777] hover:text-[#AAAAAA]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">groups</span>
            Squads ({allSquads.length})
          </button>
        </section>

        {/* Tab Content */}
        {activeTab === 'loops' && (
          <div className="space-y-4">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div key={post.id} className="bold-card rounded-2xl p-4 bg-[#0d0d0d] border border-[#262626] space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#777]">
                    <span>{post.timeAgo}</span>
                    <span>{post.commentsCount} comments</span>
                  </div>
                  <p className="text-xs text-[#E0E0E0] leading-relaxed">{post.content}</p>
                  {post.imageUrl && (
                    <div className="h-36 rounded-xl overflow-hidden border border-[#262626]">
                      <img src={post.imageUrl} alt="Post visual" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[#777777] text-xs font-mono">
                No posts created yet. Broadcast your first thought in the Squad feed!
              </div>
            )}
          </div>
        )}

        {activeTab === 'squads' && (
          <div className="space-y-3">
            {allSquads.map((squad) => (
              <div
                key={squad.id}
                className="bold-card rounded-2xl p-4 bg-[#0d0d0d] border border-[#262626] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img src={squad.avatar} alt={squad.name} className="w-10 h-10 rounded-full object-cover border border-[#444]" />
                  <div>
                    <h4 className="font-black text-xs text-white uppercase">{squad.name}</h4>
                    <p className="text-[10px] text-[#777] font-mono">{squad.memberCount} MEMBERS • {squad.privacy}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    switchSquad(squad.id);
                    onNavigate('feed');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white text-black font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  Enter
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit Bio Modal */}
      {isEditingBio && (
        <div
          onClick={() => setIsEditingBio(false)}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0d0d0d] border border-[#333] w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <h3 className="font-black text-sm uppercase text-white tracking-wider">
                EDIT OPERATOR CREDENTIALS
              </h3>
              <button onClick={() => setIsEditingBio(false)} className="text-[#888] hover:text-white">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveBio} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#888]">Display Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#888]">Username</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#888]">Bio / Transmission</label>
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  rows={3}
                  className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setIsEditingBio(false)}
                  className="px-4 py-2 text-xs font-black uppercase text-[#777] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-white text-black font-black text-xs uppercase tracking-wider shadow-md hover:bg-white/90"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
