import React, { useState } from 'react';
import { ScreenType, User } from '../../types';
import { allUsers } from '../../data/mockData';

interface MembersScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const MembersScreen: React.FC<MembersScreenProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [memberList, setMemberList] = useState<User[]>([
    allUsers.sam,
    allUsers.jules,
    allUsers.robert,
    allUsers.bot404,
  ]);

  const filteredMembers = memberList.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMuteToggle = (userId: string) => {
    setMemberList((prev) =>
      prev.map((m) => (m.id === userId ? { ...m, isMuted: !m.isMuted } : m))
    );
    setSelectedMember(null);
  };

  const handleRemoveMember = (userId: string) => {
    setMemberList((prev) => prev.filter((m) => m.id !== userId));
    setSelectedMember(null);
  };

  const handleMakeAdmin = (userId: string) => {
    setMemberList((prev) =>
      prev.map((m) => (m.id === userId ? { ...m, role: 'admin' as const } : m))
    );
    setSelectedMember(null);
    alert('Member promoted to Admin!');
  };

  return (
    <div className="bg-[#050505] text-[#F2F2F2] min-h-screen pb-32">
      {/* Top Navigation Header */}
      <header className="fixed top-10 left-0 w-full z-40 bg-[#050505]/95 backdrop-blur-lg border-b border-[#262626] h-16 flex items-center justify-between px-5">
        <button
          onClick={() => onNavigate('feed')}
          className="text-[#999999] hover:text-[#F2F2F2] transition-colors p-2 rounded-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="flex items-center gap-3">
          <h1 className="font-black text-xl tracking-tight text-[#F2F2F2] uppercase">ROSTER</h1>
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#888888] bg-[#141414] border border-[#262626] px-2 py-0.5 rounded-full">
            DIRECTORY
          </span>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="text-[#050505] bg-[#F2F2F2] hover:bg-white transition-all w-9 h-9 flex items-center justify-center rounded-full cursor-pointer shadow-[0_0_16px_rgba(255,255,255,0.2)]"
          title="Invite Member"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
        </button>
      </header>

      {/* Main Canvas */}
      <main className="pt-28 px-4 max-w-xl mx-auto space-y-6">
        {/* Search Area */}
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#777777] group-focus-within:text-[#F2F2F2] transition-colors text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search directory by name or @username..."
            className="w-full bg-[#121212] border border-[#262626] rounded-xl py-3.5 pl-12 pr-4 text-[#F2F2F2] text-sm focus:outline-none focus:border-[#666666] transition-all placeholder:text-[#666666] font-sans"
          />
        </div>

        {/* Owner Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-black text-xs text-[#888888] uppercase tracking-widest flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#666666]">01 //</span>
              GROUP CREATOR
            </h2>
          </div>

          <div className="bold-card rounded-2xl p-4 flex items-center gap-3.5 border border-[#262626] bg-[#0d0d0d] relative overflow-hidden">
            <img
              alt="Owner"
              src={allUsers.mia.avatar}
              className="w-13 h-13 rounded-full border border-[#444444] object-cover shadow"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-[#F2F2F2] uppercase tracking-tight">{allUsers.mia.name}</h3>
                <span className="material-symbols-outlined text-[#F2F2F2] text-[15px]" title="Verified Creator">
                  verified
                </span>
              </div>
              <p className="text-xs text-[#777777] font-mono">@{allUsers.mia.username}</p>
            </div>
            <span className="bg-[#1a1a1a] text-[#F2F2F2] px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest border border-[#333333]">
              OWNER
            </span>
          </div>
        </section>

        {/* Admins Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-black text-xs text-[#888888] uppercase tracking-widest flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#666666]">02 //</span>
              ADMINISTRATORS <span className="text-[#666666] font-mono text-xs">(2)</span>
            </h2>
          </div>

          <div className="space-y-2.5">
            {/* Admin 1 */}
            <div className="bold-card rounded-2xl p-3.5 flex items-center gap-3.5 border border-[#262626] bg-[#0d0d0d]">
              <img
                alt="Admin 1"
                src={allUsers.leo.avatar}
                className="w-11 h-11 rounded-full border border-[#333333] object-cover shadow"
              />
              <div className="flex-1">
                <h3 className="font-black text-sm text-[#F2F2F2] uppercase tracking-tight">{allUsers.leo.name}</h3>
                <p className="text-xs text-[#777777] font-mono">@{allUsers.leo.username}</p>
              </div>
              <span className="bg-[#141414] text-[#AAAAAA] px-3 py-1 rounded-full font-bold text-[9px] uppercase tracking-widest border border-[#262626]">
                ADMIN
              </span>
              <button
                onClick={() => setSelectedMember(allUsers.leo)}
                className="p-1.5 text-[#777777] hover:text-[#F2F2F2] rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">more_vert</span>
              </button>
            </div>

            {/* Admin 2 */}
            <div className="bold-card rounded-2xl p-3.5 flex items-center gap-3.5 border border-[#262626] bg-[#0d0d0d]">
              <img
                alt="Admin 2"
                src={allUsers.zoe.avatar}
                className="w-11 h-11 rounded-full border border-[#333333] object-cover shadow"
              />
              <div className="flex-1">
                <h3 className="font-black text-sm text-[#F2F2F2] uppercase tracking-tight">{allUsers.zoe.name}</h3>
                <p className="text-xs text-[#777777] font-mono">@{allUsers.zoe.username}</p>
              </div>
              <span className="bg-[#141414] text-[#AAAAAA] px-3 py-1 rounded-full font-bold text-[9px] uppercase tracking-widest border border-[#262626]">
                ADMIN
              </span>
              <button
                onClick={() => setSelectedMember(allUsers.zoe)}
                className="p-1.5 text-[#777777] hover:text-[#F2F2F2] rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">more_vert</span>
              </button>
            </div>
          </div>
        </section>

        {/* Members Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-black text-xs text-[#888888] uppercase tracking-widest flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#666666]">03 //</span>
              ALL COLLABORATORS <span className="text-[#666666] font-mono text-xs">(124)</span>
            </h2>
          </div>

          <div className="space-y-2">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0d0d0d] hover:bg-[#141414] transition-colors group cursor-pointer border border-[#262626] ${
                  member.isMuted ? 'opacity-50' : ''
                }`}
              >
                <div className="relative">
                  <img
                    alt={member.name}
                    src={member.avatar}
                    className={`w-11 h-11 rounded-full object-cover border border-[#333333] ${
                      member.isMuted ? 'grayscale' : ''
                    }`}
                  />
                  {member.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-white rounded-full border border-black"></div>
                  )}
                </div>

                <div className="flex-1">
                  <h3
                    className={`font-black text-sm text-[#F2F2F2] uppercase tracking-tight ${
                      member.isMuted ? 'line-through text-[#666666]' : ''
                    }`}
                  >
                    {member.name}
                  </h3>
                  <p className="text-xs text-[#777777] flex items-center gap-1 font-mono">
                    @{member.username}
                    {member.isMuted && (
                      <span className="flex items-center gap-0.5 text-[10px] text-[#666666] ml-1">
                        <span className="material-symbols-outlined text-[12px]">volume_off</span> MUTED
                      </span>
                    )}
                  </p>
                </div>

                <button className="p-1.5 text-[#777777] opacity-80 group-hover:opacity-100 hover:text-[#F2F2F2] rounded-full">
                  <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => alert('Loaded all 124 squad members.')}
            className="w-full mt-4 py-3.5 rounded-xl border border-[#262626] bg-[#0d0d0d] hover:bg-[#141414] text-[#AAAAAA] hover:text-[#F2F2F2] font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            LOAD MORE DIRECTORY <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
        </section>
      </main>

      {/* Member Management Sheet / Modal */}
      {selectedMember && (
        <div
          onClick={() => setSelectedMember(null)}
          className="fixed inset-0 z-[95] bg-[#050505]/90 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0d0d0d] w-full max-w-sm rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl border border-[#262626] p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#333333]"
                />
                <div>
                  <h4 className="font-black text-sm text-[#F2F2F2] uppercase tracking-tight">{selectedMember.name}</h4>
                  <p className="text-xs text-[#777777] font-mono">@{selectedMember.username}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-1 text-[#888888] hover:text-[#F2F2F2] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleMakeAdmin(selectedMember.id)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-[#141414] rounded-xl text-[#F2F2F2] transition-colors cursor-pointer border border-transparent hover:border-[#262626]"
              >
                <span className="material-symbols-outlined text-[#AAAAAA] text-[18px]">shield_person</span>
                <span className="text-xs font-bold uppercase tracking-wider">Grant Admin Privileges</span>
              </button>

              <button
                onClick={() => handleMuteToggle(selectedMember.id)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-[#141414] rounded-xl text-[#F2F2F2] transition-colors cursor-pointer border border-transparent hover:border-[#262626]"
              >
                <span className="material-symbols-outlined text-[#AAAAAA] text-[18px]">
                  {selectedMember.isMuted ? 'volume_up' : 'volume_off'}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider">
                  {selectedMember.isMuted ? 'Unmute Collaborator' : 'Mute in Channels'}
                </span>
              </button>

              <button
                onClick={() => handleRemoveMember(selectedMember.id)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-red-950/30 rounded-xl text-red-400 transition-colors mt-2 cursor-pointer border border-red-900/30"
              >
                <span className="material-symbols-outlined text-[18px]">person_remove</span>
                <span className="text-xs font-bold uppercase tracking-wider">Remove from Squad</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[95] bg-[#050505]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] w-full max-w-sm rounded-2xl p-6 border border-[#262626] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-[#F2F2F2] uppercase tracking-tight">INVITE TO THE SQUAD</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-[#888888] hover:text-[#F2F2F2] cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-xs text-[#888888] leading-relaxed">
              Send an exclusive direct invite link to onboard a new collaborator to the squad.
            </p>
            <div className="space-y-2">
              <label className="text-[10px] text-[#777777] font-black uppercase tracking-widest">Collaborator Email</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="collaborator@domain.com"
                className="w-full bg-[#141414] border border-[#262626] rounded-xl p-3 text-sm text-[#F2F2F2] focus:outline-none focus:border-[#666666] font-mono placeholder:text-[#555555]"
              />
            </div>
            <div className="flex gap-2 justify-end pt-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#888888] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Invitation dispatched to ${inviteEmail || 'recipient'}!`);
                  setShowInviteModal(false);
                  setInviteEmail('');
                }}
                className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-[#F2F2F2] text-[#050505] hover:bg-white shadow-[0_0_16px_rgba(255,255,255,0.2)] cursor-pointer"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
