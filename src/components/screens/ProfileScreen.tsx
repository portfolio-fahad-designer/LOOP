import React, { useState } from 'react';
import { ScreenType } from '../../types';
import { currentUser } from '../../data/mockData';

interface ProfileScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const [profileUser, setProfileUser] = useState(currentUser);
  const [activeTab, setActiveTab] = useState<'loops' | 'memories' | 'polls'>('loops');
  const [synthPollVotes, setSynthPollVotes] = useState({ moog: 58, clouds: 42, userVoted: null as string | null });

  const circles = [
    {
      id: 'c1',
      name: 'Design Squad',
      members: 12,
      cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDopw0GXgwEAQlu_rz-35beGfRqW5u-BlNkIeufFUuVNgxxsptQDKJMUDynPZ8GKqy-4pUvfVctNimZfvwNhZaQHn20gtupPlGBWnmU27WDcsEwALt1in4Rvorz3Qui08B2epWmAQ7dsF9TDxHueNM26KEoalnLCogtR9DF1x-oNRmnZSaVhGqO17ZVc3e4zzFHAiCOPMlaGM0-3YcqKNxC4Hv_M4dWHzAryaKk06NO8S8fFwQnA0o',
    },
    {
      id: 'c2',
      name: "Tokyo Crew '24",
      members: 8,
      cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr2QjNkpywtQN7qOP3N-xvpTV0r7NZ1DuOi_EtpkCAcV_ym-DSPf1XVXdFyVjUEUlwcyD7kJ07lK7V6uDLwBDDVtLG_TG0uaPOA5uqXEvRvkHOfVHXSolpt2HVlRuOMKfmq1Q04R9f03nbENZqJEv8s2UHRNwE4ZQbfDI4LwBpCRI3fIdpUaIbnx5GxzegfOWYx2PRoIgaHmfUHI36TdE2YYjOQUikIIV6ut9mXeknDIE2ew-3iXU',
    },
    {
      id: 'c3',
      name: 'Synth Lab',
      members: 5,
      cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUlAhyo2m-TC5N-LmVd6eIiqviXg2OTkFEg5TMsi6oUF-ksO3Pi0GpyImCDYdN9-TlETUctbOCLuHxOhWFLTzy7hUf2ofAFAkeIhCAqU4SpOryqMAIvHtg45ZXU0s8CqOnBaHa_SJ6ar6GhPm0QuF3rNDLDJ7oRlGtTCa1KcK-UPQsckJf4E_DxLCNsiBCWl4-eHAUTY3_M5bBnY5iLZSFg8nw6UhMphsD6ogxofRHpSjyItMtmcA',
    },
  ];

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
          <h1 className="font-black text-xl tracking-tight text-[#F2F2F2] uppercase">PROFILE</h1>
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#888888] bg-[#141414] border border-[#262626] px-2 py-0.5 rounded-full">
            IDENTITY
          </span>
        </div>
        <button
          onClick={() => onNavigate('settings')}
          className="text-[#999999] hover:text-[#F2F2F2] transition-colors p-2 rounded-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="settings">settings</span>
        </button>
      </header>

      {/* Main Profile Canvas */}
      <main className="pt-28 px-4 max-w-xl mx-auto space-y-8">
        {/* Profile Card Header */}
        <section className="bold-card rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden border border-[#262626] bg-[#0d0d0d]">
          {/* Large Avatar with neon border */}
          <div className="relative mb-4 group cursor-pointer" onClick={() => onNavigate('profile-setup')}>
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#444444] relative shadow-2xl">
              <img
                alt={profileUser.name}
                className="w-full h-full object-cover"
                src={profileUser.avatar}
              />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#F2F2F2] text-[#050505] rounded-full flex items-center justify-center border border-black shadow">
              <span className="material-symbols-outlined text-[13px]">edit</span>
            </div>
          </div>

          {/* Name and Handle */}
          <div className="flex items-center gap-2">
            <h2 className="font-black text-2xl text-[#F2F2F2] uppercase tracking-tight">{profileUser.name}</h2>
            <span className="material-symbols-outlined text-[#F2F2F2] text-[18px]">verified</span>
          </div>
          <p className="text-xs text-[#888888] font-mono mt-0.5">@{profileUser.username}</p>

          {/* Bio */}
          <p className="text-xs text-[#AAAAAA] max-w-md mt-3 leading-relaxed font-sans">
            {profileUser.bio}
          </p>

          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-2 w-full mt-6 pt-5 border-t border-[#262626]">
            <div className="flex flex-col items-center">
              <span className="font-black text-xl text-[#F2F2F2]">{circles.length}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#777777] mt-0.5">Circles</span>
            </div>
            <div className="flex flex-col items-center border-x border-[#262626]">
              <span className="font-black text-xl text-[#F2F2F2]">142</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#777777] mt-0.5">Loops</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-black text-xl text-[#F2F2F2]">89</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#777777] mt-0.5">Memories</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full mt-6">
            <button
              onClick={() => onNavigate('profile-setup')}
              className="flex-1 py-3 rounded-xl bg-[#F2F2F2] text-[#050505] hover:bg-white font-black text-xs uppercase tracking-widest shadow-[0_0_16px_rgba(255,255,255,0.2)] transition-all cursor-pointer"
            >
              EDIT PROFILE
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('Alex Rivers profile link copied!');
              }}
              className="px-4 py-3 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-[#F2F2F2] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center cursor-pointer border border-[#262626]"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
            </button>
          </div>
        </section>

        {/* Circles Slider Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-[#777777] uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="text-[#555555] font-mono">01 //</span> AFFILIATE SQUADS ({circles.length})
            </h3>
            <button
              onClick={() => onNavigate('profile-setup')}
              className="text-[10px] text-[#AAAAAA] hover:text-[#F2F2F2] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              + CREATE SQUAD
            </button>
          </div>

          <div className="flex overflow-x-auto gap-3.5 no-scrollbar pb-2 snap-x">
            {circles.map((circle) => (
              <div
                key={circle.id}
                onClick={() => onNavigate('feed')}
                className="snap-center shrink-0 w-44 rounded-2xl bold-card overflow-hidden border border-[#262626] bg-[#0d0d0d] p-3 flex flex-col gap-2.5 hover:border-[#555555] transition-all cursor-pointer group"
              >
                <div className="w-full h-24 rounded-xl overflow-hidden relative border border-[#262626]">
                  <img
                    src={circle.cover}
                    alt={circle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <span className="absolute bottom-1.5 left-2 text-[9px] text-white font-mono bg-black/70 px-2 py-0.5 rounded border border-[#333333]">
                    {circle.members} MEMBERS
                  </span>
                </div>
                <div className="px-0.5">
                  <h4 className="font-black text-xs text-[#F2F2F2] uppercase tracking-tight truncate">{circle.name}</h4>
                  <p className="text-[10px] text-[#777777] font-mono uppercase mt-0.5">OPEN SQUAD FEED</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Profile Tabs */}
        <section className="space-y-4">
          <div className="flex border-b border-[#262626] pb-1 gap-6">
            <button
              onClick={() => setActiveTab('loops')}
              className={`font-black text-xs uppercase tracking-widest pb-2 transition-all relative cursor-pointer ${
                activeTab === 'loops' ? 'text-[#F2F2F2]' : 'text-[#777777] hover:text-[#AAAAAA]'
              }`}
            >
              RECENT LOOPS
              {activeTab === 'loops' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2F2F2]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('memories')}
              className={`font-black text-xs uppercase tracking-widest pb-2 transition-all relative cursor-pointer ${
                activeTab === 'memories' ? 'text-[#F2F2F2]' : 'text-[#777777] hover:text-[#AAAAAA]'
              }`}
            >
              MEDIA VAULT
              {activeTab === 'memories' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2F2F2]" />
              )}
            </button>
          </div>

          {/* Loops Content */}
          {activeTab === 'loops' && (
            <div className="space-y-4">
              {/* Loop Post 1 */}
              <article className="bold-card rounded-2xl p-4 sm:p-5 border border-[#262626] bg-[#0d0d0d] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={profileUser.avatar}
                      alt={profileUser.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#333333]"
                    />
                    <div>
                      <h4 className="font-black text-xs text-[#F2F2F2] uppercase tracking-tight">{profileUser.name}</h4>
                      <p className="text-[10px] text-[#777777] font-mono">YESTERDAY // 11:42 PM • DESIGN SQUAD</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#666666] text-sm">more_horiz</span>
                </div>

                <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
                  Strobe lights and subwoofers. Best set of the year so far 🔊
                </p>

                <div className="rounded-xl overflow-hidden border border-[#262626] max-h-64">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_VTCkekPprSCc9GwQfevw6aeXVdqupTkw5_APQlVwVo-0RMyZmMHzWMcUbv1oJSVYvrHq5VPMNTvwSk7eaYc0nXBdBnV1GSGu3rFOMzg9pZ-EQ3F_Bvt8P5ALSCFUhed2T_pPFQelgIKMhkuwhnzJpWnbPpUVQgQmvhBTkDwUIqaN0Y-b8CwSFMxuD-yoPwjfYF7WNyDqaa1KGr2gRrOQoatWCTthX6iYhoMUZuWvOhFbBFmgeI8"
                    alt="Concert setup"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#777777] font-mono pt-2 border-t border-[#1f1f1f]">
                  <span className="flex items-center gap-1.5 font-bold text-[#AAAAAA]">
                    <span>⚡</span> 42 PULSES
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">chat_bubble_outline</span>
                    14 LOGS
                  </span>
                </div>
              </article>

              {/* Loop Post 2: Poll */}
              <article className="bold-card rounded-2xl p-4 sm:p-5 border border-[#262626] bg-[#0d0d0d] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={profileUser.avatar}
                      alt={profileUser.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#333333]"
                    />
                    <div>
                      <h4 className="font-black text-xs text-[#F2F2F2] uppercase tracking-tight">{profileUser.name}</h4>
                      <p className="text-[10px] text-[#777777] font-mono">3 DAYS AGO • SYNTH LAB</p>
                    </div>
                  </div>
                  <span className="bg-[#141414] text-[#AAAAAA] text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-[#262626]">
                    POLL
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
                  Which synthesizer module should I add to the rack next?
                </p>

                <div className="space-y-2 bg-[#121212] p-3 rounded-xl border border-[#262626]">
                  <button
                    onClick={() => setSynthPollVotes({ moog: 59, clouds: 41, userVoted: 'moog' })}
                    className={`relative w-full border rounded-xl p-3 flex justify-between items-center overflow-hidden transition-all text-left cursor-pointer ${
                      synthPollVotes.userVoted === 'moog'
                        ? 'border-[#F2F2F2] bg-[#1a1a1a]'
                        : 'border-[#262626] hover:border-[#444444]'
                    }`}
                  >
                    <div
                      style={{ width: `${synthPollVotes.moog}%` }}
                      className="absolute inset-y-0 left-0 bg-[#262626] transition-all duration-500"
                    />
                    <span className="font-black text-xs text-[#F2F2F2] relative z-10 uppercase tracking-wide">Moog Mother-32</span>
                    <span className="text-xs font-mono font-black text-[#F2F2F2] relative z-10">{synthPollVotes.moog}%</span>
                  </button>

                  <button
                    onClick={() => setSynthPollVotes({ moog: 57, clouds: 43, userVoted: 'clouds' })}
                    className={`relative w-full border rounded-xl p-3 flex justify-between items-center overflow-hidden transition-all text-left cursor-pointer ${
                      synthPollVotes.userVoted === 'clouds'
                        ? 'border-[#F2F2F2] bg-[#1a1a1a]'
                        : 'border-[#262626] hover:border-[#444444]'
                    }`}
                  >
                    <div
                      style={{ width: `${synthPollVotes.clouds}%` }}
                      className="absolute inset-y-0 left-0 bg-[#262626] transition-all duration-500"
                    />
                    <span className="font-black text-xs text-[#F2F2F2] relative z-10 uppercase tracking-wide">Mutable Instruments Clouds</span>
                    <span className="text-xs font-mono font-black text-[#F2F2F2] relative z-10">{synthPollVotes.clouds}%</span>
                  </button>
                </div>
              </article>
            </div>
          )}

          {activeTab === 'memories' && (
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => onNavigate('gallery')}
                className="h-44 rounded-xl overflow-hidden relative group cursor-pointer border border-[#262626]"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr2QjNkpywtQN7qOP3N-xvpTV0r7NZ1DuOi_EtpkCAcV_ym-DSPf1XVXdFyVjUEUlwcyD7kJ07lK7V6uDLwBDDVtLG_TG0uaPOA5uqXEvRvkHOfVHXSolpt2HVlRuOMKfmq1Q04R9f03nbENZqJEv8s2UHRNwE4ZQbfDI4LwBpCRI3fIdpUaIbnx5GxzegfOWYx2PRoIgaHmfUHI36TdE2YYjOQUikIIV6ut9mXeknDIE2ew-3iXU"
                  alt="Memory 1"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-white">NEON WORKSPACE</span>
                </div>
              </div>

              <div 
                onClick={() => onNavigate('gallery')}
                className="h-44 rounded-xl overflow-hidden relative group cursor-pointer border border-[#262626]"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUlAhyo2m-TC5N-LmVd6eIiqviXg2OTkFEg5TMsi6oUF-ksO3Pi0GpyImCDYdN9-TlETUctbOCLuHxOhWFLTzy7hUf2ofAFAkeIhCAqU4SpOryqMAIvHtg45ZXU0s8CqOnBaHa_SJ6ar6GhPm0QuF3rNDLDJ7oRlGtTCa1KcK-UPQsckJf4E_DxLCNsiBCWl4-eHAUTY3_M5bBnY5iLZSFg8nw6UhMphsD6ogxofRHpSjyItMtmcA"
                  alt="Memory 2"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-white">PARTY NIGHTCLUB</span>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
