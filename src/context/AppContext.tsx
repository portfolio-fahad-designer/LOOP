import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Squad, 
  Post, 
  Story, 
  GalleryItem, 
  ChatMessage, 
  ToastMessage,
  Comment
} from '../types';
import { 
  currentUser as initialUser, 
  allUsers, 
  initialPosts, 
  initialSquads, 
  initialStories, 
  galleryItems, 
  initialChatMessages 
} from '../data/mockData';
import { sound } from '../utils/sound';

interface AppContextType {
  currentUser: User;
  currentSquad: Squad;
  allSquads: Squad[];
  posts: Post[];
  stories: Story[];
  galleryPhotos: GalleryItem[];
  chatMessages: ChatMessage[];
  membersList: User[];
  toasts: ToastMessage[];
  soundMuted: boolean;
  setSoundMuted: (muted: boolean) => void;
  addPost: (post: Post) => void;
  deletePost: (postId: string) => void;
  toggleReaction: (postId: string, emoji: string) => void;
  votePoll: (postId: string, optionId: string) => void;
  addComment: (postId: string, text: string) => void;
  likeComment: (postId: string, commentId: string) => void;
  addStory: (story: Story) => void;
  markStorySeen: (storyId: string) => void;
  addGalleryItem: (item: GalleryItem) => void;
  toggleGalleryLike: (itemId: string) => void;
  deleteGalleryItem: (itemId: string) => void;
  sendMessage: (text: string, imageUrl?: string, replyTo?: { senderName: string; text: string }) => void;
  updateProfile: (updates: Partial<User>) => void;
  updateSquad: (updates: Partial<Squad>) => void;
  createSquad: (name: string, description: string, avatar?: string, privacy?: 'invite-only' | 'members-approval' | 'open') => Squad;
  joinSquadByCode: (code: string) => boolean;
  switchSquad: (squadId: string) => void;
  switchUser: (user: User) => void;
  addMember: (member: User) => void;
  removeMember: (memberId: string) => void;
  updateMemberRole: (memberId: string, role: 'owner' | 'admin' | 'member') => void;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'loop_v2_user',
  SQUADS: 'loop_v2_squads',
  CURRENT_SQUAD_ID: 'loop_v2_curr_squad_id',
  POSTS: 'loop_v2_posts',
  STORIES: 'loop_v2_stories',
  GALLERY: 'loop_v2_gallery',
  MESSAGES: 'loop_v2_messages',
  MEMBERS: 'loop_v2_members',
  SOUND_MUTED: 'loop_v2_muted',
};

function loadStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => loadStorage(STORAGE_KEYS.USER, initialUser));
  const [allSquads, setAllSquads] = useState<Squad[]>(() => loadStorage(STORAGE_KEYS.SQUADS, initialSquads));
  const [currentSquadId, setCurrentSquadId] = useState<string>(() => loadStorage(STORAGE_KEYS.CURRENT_SQUAD_ID, initialSquads[0].id));
  const [posts, setPosts] = useState<Post[]>(() => loadStorage(STORAGE_KEYS.POSTS, initialPosts));
  const [stories, setStories] = useState<Story[]>(() => loadStorage(STORAGE_KEYS.STORIES, initialStories));
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryItem[]>(() => loadStorage(STORAGE_KEYS.GALLERY, galleryItems));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => loadStorage(STORAGE_KEYS.MESSAGES, initialChatMessages));
  const [membersList, setMembersList] = useState<User[]>(() => loadStorage(STORAGE_KEYS.MEMBERS, Object.values(allUsers)));
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [soundMuted, setSoundMutedState] = useState<boolean>(() => loadStorage(STORAGE_KEYS.SOUND_MUTED, false));

  const setSoundMuted = (muted: boolean) => {
    setSoundMutedState(muted);
    sound.isMuted = muted;
    saveStorage(STORAGE_KEYS.SOUND_MUTED, muted);
  };

  useEffect(() => {
    sound.isMuted = soundMuted;
  }, [soundMuted]);

  const currentSquad = allSquads.find((s) => s.id === currentSquadId) || allSquads[0];

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `t-${Date.now()}-${Math.random()}`;
    const newToast = { id, text, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // State Persisters
  useEffect(() => saveStorage(STORAGE_KEYS.USER, currentUser), [currentUser]);
  useEffect(() => saveStorage(STORAGE_KEYS.SQUADS, allSquads), [allSquads]);
  useEffect(() => saveStorage(STORAGE_KEYS.CURRENT_SQUAD_ID, currentSquadId), [currentSquadId]);
  useEffect(() => saveStorage(STORAGE_KEYS.POSTS, posts), [posts]);
  useEffect(() => saveStorage(STORAGE_KEYS.STORIES, stories), [stories]);
  useEffect(() => saveStorage(STORAGE_KEYS.GALLERY, galleryPhotos), [galleryPhotos]);
  useEffect(() => saveStorage(STORAGE_KEYS.MESSAGES, chatMessages), [chatMessages]);
  useEffect(() => saveStorage(STORAGE_KEYS.MEMBERS, membersList), [membersList]);

  // Handlers
  const addPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
    sound.playSuccess();
    showToast('Post published to Squad Feed');
  };

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    sound.playPop();
    showToast('Post deleted', 'info');
  };

  const toggleReaction = (postId: string, emoji: string) => {
    sound.playPulse();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const reactions = p.reactions ? [...p.reactions] : [];
          const idx = reactions.findIndex((r) => r.emoji === emoji);
          if (idx > -1) {
            const cur = reactions[idx];
            if (cur.active) {
              reactions[idx] = { ...cur, count: Math.max(0, cur.count - 1), active: false };
            } else {
              reactions[idx] = { ...cur, count: cur.count + 1, active: true };
            }
          } else {
            reactions.push({ emoji, count: 1, active: true });
          }
          return { ...p, reactions: reactions.filter((r) => r.count > 0 || r.active) };
        }
        return p;
      })
    );
  };

  const votePoll = (postId: string, optionId: string) => {
    sound.playPop();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.poll) {
          const prevVote = p.poll.userVotedId;
          const isRemoving = prevVote === optionId;
          const updatedOptions = p.poll.options.map((opt) => {
            if (opt.id === optionId) {
              return { ...opt, votes: isRemoving ? Math.max(0, opt.votes - 1) : opt.votes + 1 };
            }
            if (opt.id === prevVote) {
              return { ...opt, votes: Math.max(0, opt.votes - 1) };
            }
            return opt;
          });
          const totalVotes = updatedOptions.reduce((a, b) => a + b.votes, 0);
          return {
            ...p,
            poll: {
              ...p.poll,
              userVotedId: isRemoving ? undefined : optionId,
              totalVotes,
              options: updatedOptions,
            },
          };
        }
        return p;
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: currentUser,
      content: text.trim(),
      timeAgo: 'Just now',
      likes: 0,
    };

    sound.playSend();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const list = p.commentsList || [];
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            commentsList: [...list, newComment],
          };
        }
        return p;
      })
    );

    // Realistic squad member automated witty reply simulation
    setTimeout(() => {
      const bots = [allUsers.chloe, allUsers.mia, allUsers.leo, allUsers.david];
      const bot = bots[Math.floor(Math.random() * bots.length)];
      const replies = [
        '100% on point! ⚡',
        'Could not agree more.',
        'This is the vibe we need today.',
        'Adding this to the sprint backlog! 🚀',
        'So crisp! ✨',
      ];
      const replyComment: Comment = {
        id: `c-${Date.now() + 1}`,
        author: bot,
        content: replies[Math.floor(Math.random() * replies.length)],
        timeAgo: 'Just now',
        likes: 1,
      };

      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const list = p.commentsList || [];
            return {
              ...p,
              commentsCount: p.commentsCount + 1,
              commentsList: [...list, replyComment],
            };
          }
          return p;
        })
      );
      sound.playReceive();
    }, 2200);
  };

  const likeComment = (postId: string, commentId: string) => {
    sound.playPulse();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.commentsList) {
          return {
            ...p,
            commentsList: p.commentsList.map((c) =>
              c.id === commentId ? { ...c, likes: c.likes + 1 } : c
            ),
          };
        }
        return p;
      })
    );
  };

  const addStory = (newStory: Story) => {
    setStories((prev) => [newStory, ...prev]);
    sound.playSuccess();
    showToast('Story added to Squad Loop');
  };

  const markStorySeen = (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, seen: true } : s))
    );
  };

  const addGalleryItem = (item: GalleryItem) => {
    setGalleryPhotos((prev) => [item, ...prev]);
    sound.playSuccess();
    showToast('Media uploaded to Vault');
  };

  const toggleGalleryLike = (itemId: string) => {
    sound.playPulse();
    setGalleryPhotos((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const isLiked = !item.isLiked;
          return {
            ...item,
            isLiked,
            likes: isLiked ? item.likes + 1 : Math.max(0, item.likes - 1),
          };
        }
        return item;
      })
    );
  };

  const deleteGalleryItem = (itemId: string) => {
    setGalleryPhotos((prev) => prev.filter((g) => g.id !== itemId));
    sound.playPop();
    showToast('Visual removed from Vault', 'info');
  };

  const sendMessage = (
    text: string, 
    imageUrl?: string, 
    replyTo?: { senderName: string; text: string }
  ) => {
    if (!text.trim() && !imageUrl) return;

    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: currentUser,
      isUser: true,
      text: text.trim() || undefined,
      imageUrl,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      replyTo,
      status: 'read',
    };

    setChatMessages((prev) => [...prev, userMsg]);
    sound.playSend();

    // Context-aware Squad member automatic response simulation
    setTimeout(() => {
      const lower = text.toLowerCase();
      let responseText = "Looking sharp! Let's lock in the specs for Friday's sprint review. 🚀";

      if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
        responseText = "Hey Alex! Just pushed the latest design tokens. Check it out!";
      } else if (lower.includes('design') || lower.includes('ui') || lower.includes('figma')) {
        responseText = "Figma file is synced with the new high-contrast dark theme components. Ready for QA!";
      } else if (lower.includes('call') || lower.includes('meet') || lower.includes('sync')) {
        responseText = "I'm free to jump on the squad call anytime! Let's sync up.";
      } else if (lower.includes('music') || lower.includes('vibe') || lower.includes('sound')) {
        responseText = "Spinning up the modular synth live stream now 🎛️✨";
      } else if (imageUrl) {
        responseText = "Love this visual! The lighting and composition are top tier 🔥";
      }

      const botMsg: ChatMessage = {
        id: `m-${Date.now() + 1}`,
        sender: Math.random() > 0.5 ? allUsers.chloe : allUsers.alex,
        isUser: false,
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, botMsg]);
      sound.playReceive();
    }, 1800);
  };

  const updateProfile = (updates: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
    sound.playSuccess();
    showToast('Profile credentials updated');
  };

  const updateSquad = (updates: Partial<Squad>) => {
    setAllSquads((prev) =>
      prev.map((s) => (s.id === currentSquad.id ? { ...s, ...updates } : s))
    );
    sound.playSuccess();
    showToast('Squad settings saved');
  };

  const createSquad = (
    name: string,
    description: string,
    avatar?: string,
    privacy: 'invite-only' | 'members-approval' | 'open' = 'invite-only'
  ): Squad => {
    const newSquad: Squad = {
      id: `squad-${Date.now()}`,
      name: name.trim().toUpperCase(),
      tagline: description.trim() || 'A private creative collective on Loop.',
      description: description.trim() || 'A private creative collective on Loop.',
      avatar:
        avatar ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAr2QjNkpywtQN7qOP3N-xvpTV0r7NZ1DuOi_EtpkCAcV_ym-DSPf1XVXdFyVjUEUlwcyD7kJ07lK7V6uDLwBDDVtLG_TG0uaPOA5uqXEvRvkHOfVHXSolpt2HVlRuOMKfmq1Q04R9f03nbENZqJEv8s2UHRNwE4ZQbfDI4LwBpCRI3fIdpUaIbnx5GxzegfOWYx2PRoIgaHmfUHI36TdE2YYjOQUikIIV6ut9mXeknDIE2ew-3iXU',
      coverImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA_VTCkekPprSCc9GwQfevw6aeXVdqupTkw5_APQlVwVo-0RMyZmMHzWMcUbv1oJSVYvrHq5VPMNTvwSk7eaYc0nXBdBnV1GSGu3rFOMzg9pZ-EQ3F_Bvt8P5ALSCFUhed2T_pPFQelgIKMhkuwhnzJpWnbPpUVQgQmvhBTkDwUIqaN0Y-b8CwSFMxuD-yoPwjfYF7WNyDqaa1KGr2gRrOQoatWCTthX6iYhoMUZuWvOhFbBFmgeI8',
      memberCount: 1,
      privacy,
      tags: ['EXCLUSIVE', 'CORE'],
      inviteCode: `SQD-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setAllSquads((prev) => [newSquad, ...prev]);
    setCurrentSquadId(newSquad.id);
    sound.playSuccess();
    showToast(`Created and entered squad: ${newSquad.name}`);
    return newSquad;
  };

  const joinSquadByCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    const existing = allSquads.find((s) => s.inviteCode?.toUpperCase() === cleanCode);
    if (existing) {
      setCurrentSquadId(existing.id);
      sound.playSuccess();
      showToast(`Joined squad: ${existing.name}!`);
      return true;
    }

    // If it's a new valid code format, join/create connection
    const generatedSquad: Squad = {
      id: `squad-joined-${Date.now()}`,
      name: `SQUAD // ${cleanCode.slice(0, 8)}`,
      description: `Authenticated circle joined via access key ${cleanCode}`,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA_VTCkekPprSCc9GwQfevw6aeXVdqupTkw5_APQlVwVo-0RMyZmMHzWMcUbv1oJSVYvrHq5VPMNTvwSk7eaYc0nXBdBnV1GSGu3rFOMzg9pZ-EQ3F_Bvt8P5ALSCFUhed2T_pPFQelgIKMhkuwhnzJpWnbPpUVQgQmvhBTkDwUIqaN0Y-b8CwSFMxuD-yoPwjfYF7WNyDqaa1KGr2gRrOQoatWCTthX6iYhoMUZuWvOhFbBFmgeI8',
      memberCount: 8,
      privacy: 'invite-only',
      tags: ['JOINED', 'ENCRYPTED'],
      inviteCode: cleanCode,
    };

    setAllSquads((prev) => [generatedSquad, ...prev]);
    setCurrentSquadId(generatedSquad.id);
    sound.playSuccess();
    showToast(`Access granted to ${generatedSquad.name}`);
    return true;
  };

  const switchUser = (user: User) => {
    setCurrentUser(user);
    sound.playPop();
    showToast(`Logged in as ${user.name}`);
  };

  const switchSquad = (squadId: string) => {
    setCurrentSquadId(squadId);
    sound.playPop();
    const target = allSquads.find((s) => s.id === squadId);
    showToast(`Switched squad to: ${target?.name || 'Selected'}`);
  };

  const addMember = (newMember: User) => {
    setMembersList((prev) => [newMember, ...prev]);
    sound.playSuccess();
    showToast(`Added ${newMember.name} to Squad`);
  };

  const removeMember = (memberId: string) => {
    setMembersList((prev) => prev.filter((m) => m.id !== memberId));
    sound.playPop();
    showToast('Member removed from squad', 'info');
  };

  const updateMemberRole = (memberId: string, role: 'owner' | 'admin' | 'member') => {
    setMembersList((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role } : m))
    );
    sound.playSuccess();
    showToast(`Member permission set to ${role.toUpperCase()}`);
  };

  const resetDemoData = () => {
    localStorage.clear();
    setCurrentUser(initialUser);
    setAllSquads(initialSquads);
    setCurrentSquadId(initialSquads[0].id);
    setPosts(initialPosts);
    setStories(initialStories);
    setGalleryPhotos(galleryItems);
    setChatMessages(initialChatMessages);
    setMembersList(Object.values(allUsers));
    sound.playSuccess();
    showToast('Factory state restored');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentSquad,
        allSquads,
        posts,
        stories,
        galleryPhotos,
        chatMessages,
        membersList,
        toasts,
        soundMuted,
        setSoundMuted,
        addPost,
        deletePost,
        toggleReaction,
        votePoll,
        addComment,
        likeComment,
        addStory,
        markStorySeen,
        addGalleryItem,
        toggleGalleryLike,
        deleteGalleryItem,
        sendMessage,
        updateProfile,
        updateSquad,
        createSquad,
        joinSquadByCode,
        switchSquad,
        switchUser,
        addMember,
        removeMember,
        updateMemberRole,
        showToast,
        resetDemoData,
      }}
    >
      {children}

      {/* Floating Toast Notification Stack */}
      <div className="fixed top-14 right-4 z-[120] flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-2.5 rounded-xl border font-mono text-xs shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200 ${
              toast.type === 'error'
                ? 'bg-[#1f0a0a] border-[#ff4444] text-[#ffaaaa]'
                : toast.type === 'info'
                ? 'bg-[#141414] border-[#444444] text-[#e0e0e0]'
                : 'bg-[#0d0d0d] border-[#F2F2F2] text-[#F2F2F2]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-white">
              {toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'check_circle'}
            </span>
            <span className="font-black uppercase tracking-wider">{toast.text}</span>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
