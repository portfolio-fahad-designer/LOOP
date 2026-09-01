import React, { useState } from 'react';
import { ScreenType, User } from '../../types';
import { useApp } from '../../context/AppContext';

interface MembersScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const MembersScreen: React.FC<MembersScreenProps> = ({ onNavigate }) => {
  const {
    currentUser,
    currentSquad,
    membersList,
    addMember,
    removeMember,
    updateMemberRole,
    sendMessage,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteHandle, setInviteHandle] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');

  const filteredMembers = membersList.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim()) return;

    const avatars = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAwFPP7rjAVFVFnBaITusZyb1YzKyOm0BkXrToMUAYa_hp1kvgMW7Gz53_hro9M99nMhuNzqxlV7wv9bRqFGr51yhKEizVmEqIXMkIwPoQqapDtgkH0DfcQllkTd7-ZWPVSJPLze8_xlwjhi52Yg9Vjl_tzpBNMPnSYWI4fMaB5S5BROlIL7ZxP8T6c2wg0xYWjZcAM1o6DdsIp_HQMbepxYfOIeXjuBESATuoU4rwwCkiD0LlTWYw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAMxWzJfNl-4GXFoXI_8Jv4dTznTXkUAV5qlfExn6BMAJPutF68p7JhfcL2gspHrHajUnw-WMp0gDZMSd_z4Try441QBwWgYr8ufOyHBcHK5sGUamPw6PX8Cas_jIqYqHUffw1ant5R6pYg_PvqLswkeOj3xHSX8pdrnTwYC-7hKSWzVRkrOjtz2HWbmBW-DB7NL0YLq17oUC8mAi9j-L2ruMc7hgq8psvN7OaV6vDlpYywFz-GoX4',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCl_PEWuE1V4-2aDP-mfvk4DUOt4GRLfhap5joUSOPFnhudLJ7V5IjRrAOLSl0WwsBuVxYItcq9JOBnsv5YZ7ootSWKBFe8zqIaUs_6aa1PcXxsZ5y6kJ17DDt1X88AXaa9TEM1Z4pm1wIVAhS30L11mc2pZYFXp7pLkZwf0yIS8jY5bjm7Xl3THqcsob5kiqeXGYenkbUU-aaAQJhEHFufkZfhrcB6tEEuXFt0PdiL02r7snvBP8E',
    ];

    const newMember: User = {
      id: `u-${Date.now()}`,
      name: inviteName.trim(),
      username: inviteHandle.trim() ? `@${inviteHandle.replace('@', '')}` : `@${inviteName.toLowerCase().replace(/\s+/g, '')}`,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      bio: 'Squad member & collaborator.',
      role: inviteRole,
      isOnline: true,
      verified: false,
    };

    addMember(newMember);
    setInviteName('');
    setInviteHandle('');
    setShowInviteModal(false);
  };

  const handleCopyAccessKey = () => {
    navigator.clipboard?.writeText(`https://loopsquad.app/join/${currentSquad.inviteCode}`);
    showToast(`Invite code ${currentSquad.inviteCode} copied`);
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
              {currentSquad.name} // ROSTER
            </h1>
            <p className="text-[10px] text-[#777] font-mono">AUTHENTICATED CREW MEMBERS</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#888888] bg-[#141414] border border-[#262626] px-3 py-1 rounded-full">
            {membersList.length} CREW
          </span>
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-3.5 py-1.5 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-white/90 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>Invite</span>
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <main className="px-4 max-w-xl mx-auto space-y-6">
        {/* Squad Access Key Banner */}
        <div className="bold-card rounded-2xl p-4 bg-[#0d0d0d] border border-[#262626] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-[#888888] uppercase tracking-widest">SQUAD INVITE KEY</p>
            <p className="font-black text-sm text-white font-mono">{currentSquad.inviteCode}</p>
          </div>
          <button
            onClick={handleCopyAccessKey}
            className="px-3.5 py-1.5 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] border border-[#333333] text-white text-xs font-mono uppercase flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
            <span>Copy Key</span>
          </button>
        </div>

        {/* Search Area */}
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#777777] group-focus-within:text-[#F2F2F2] transition-colors text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roster by name or handle..."
            className="w-full bg-[#121212] border border-[#262626] rounded-xl py-3 pl-12 pr-4 text-[#F2F2F2] text-xs focus:outline-none focus:border-[#666666] transition-all placeholder:text-[#666666] font-sans"
          />
        </div>

        {/* Members List */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-black text-xs text-[#888888] uppercase tracking-widest flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#666666]">01 //</span>
              AUTHENTICATED SQUAD ROSTER
            </h2>
            <span className="text-[10px] font-mono text-[#666666] uppercase">{filteredMembers.length} RESULTS</span>
          </div>

          <div className="space-y-2.5">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="bold-card rounded-2xl p-4 flex items-center justify-between border border-[#262626] bg-[#0d0d0d] hover:border-[#444444] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-11 h-11 rounded-full object-cover border border-[#333333]"
                    />
                    {member.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00FF66] border-2 border-[#050505] rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-sm text-[#F2F2F2] uppercase tracking-tight">{member.name}</h3>
                      {member.id === currentUser.id && (
                        <span className="text-[9px] font-mono bg-white text-black px-1.5 py-0.2 rounded font-black">YOU</span>
                      )}
                      {member.verified && (
                        <span className="material-symbols-outlined text-[14px] text-white">verified</span>
                      )}
                    </div>
                    <p className="text-xs text-[#777777] font-mono">{member.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                    member.role === 'owner'
                      ? 'bg-white text-black border-white'
                      : member.role === 'admin'
                      ? 'bg-[#222222] text-white border-[#555]'
                      : 'bg-[#121212] text-[#888] border-[#262626]'
                  }`}>
                    {member.role || 'MEMBER'}
                  </span>
                  <span className="material-symbols-outlined text-sm text-[#666] group-hover:text-white transition-colors">
                    chevron_right
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Member Details Modal / Drawer */}
      {selectedMember && (
        <div
          onClick={() => setSelectedMember(null)}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0d0d0d] border border-[#333333] w-full max-w-sm rounded-2xl p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#777]">OPERATOR PROFILE</span>
              <button onClick={() => setSelectedMember(null)} className="text-[#888] hover:text-white">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="text-center space-y-2">
              <img
                src={selectedMember.avatar}
                alt={selectedMember.name}
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-white/20 shadow-lg"
              />
              <h3 className="font-black text-base uppercase text-white tracking-tight">{selectedMember.name}</h3>
              <p className="text-xs font-mono text-[#888]">{selectedMember.username}</p>
              {selectedMember.bio && (
                <p className="text-xs text-[#CCC] px-4 font-sans leading-relaxed">{selectedMember.bio}</p>
              )}
            </div>

            <div className="pt-2 border-t border-[#222] space-y-2">
              <button
                onClick={() => {
                  sendMessage(`Hey @${selectedMember.name}!`);
                  setSelectedMember(null);
                  onNavigate('chat');
                }}
                className="w-full py-2.5 rounded-xl bg-white text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                <span>Direct Message</span>
              </button>

              {selectedMember.id !== currentUser.id && (
                <>
                  <button
                    onClick={() => {
                      const nextRole = selectedMember.role === 'admin' ? 'member' : 'admin';
                      updateMemberRole(selectedMember.id, nextRole);
                      setSelectedMember({ ...selectedMember, role: nextRole });
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#161616] hover:bg-[#222] border border-[#333] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">shield_person</span>
                    <span>{selectedMember.role === 'admin' ? 'Demote to Member' : 'Promote to Admin'}</span>
                  </button>

                  <button
                    onClick={() => {
                      removeMember(selectedMember.id);
                      setSelectedMember(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#220a0a] hover:bg-[#331111] border border-[#ff4444]/40 text-[#ff8888] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">person_remove</span>
                    <span>Remove from Squad</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invite / Add Member Modal */}
      {showInviteModal && (
        <div
          onClick={() => setShowInviteModal(false)}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0d0d0d] border border-[#333333] w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <h3 className="font-black text-sm uppercase text-white tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-white">person_add</span>
                ADD OPERATOR TO SQUAD
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="text-[#888] hover:text-white">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#888]">Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#555] focus:outline-none focus:border-white"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#888]">Handle / Username</label>
                <input
                  type="text"
                  value={inviteHandle}
                  onChange={(e) => setInviteHandle(e.target.value)}
                  placeholder="e.g. @marcus_v"
                  className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#555] focus:outline-none focus:border-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#888]">Assigned Role</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setInviteRole('member')}
                    className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider border cursor-pointer ${
                      inviteRole === 'member'
                        ? 'bg-white text-black border-white'
                        : 'bg-[#141414] text-[#888] border-[#262626]'
                    }`}
                  >
                    Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setInviteRole('admin')}
                    className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider border cursor-pointer ${
                      inviteRole === 'admin'
                        ? 'bg-white text-black border-white'
                        : 'bg-[#141414] text-[#888] border-[#262626]'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-xs font-black uppercase text-[#777] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-white text-black font-black text-xs uppercase tracking-wider shadow-md hover:bg-white/90"
                >
                  Enroll Operator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
