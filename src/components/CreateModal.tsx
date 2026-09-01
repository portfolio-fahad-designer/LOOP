import React, { useState, useRef } from 'react';
import { Post, GalleryItem, Story } from '../types';
import { useApp } from '../context/AppContext';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPost?: (post: Post) => void;
  onAddGalleryItem?: (item: GalleryItem) => void;
}

export const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onAddPost,
  onAddGalleryItem,
}) => {
  const { currentUser, addPost, addGalleryItem, addStory, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'post' | 'photo' | 'poll' | 'story'>('post');
  const [content, setContent] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '', '']);
  const [photoTitle, setPhotoTitle] = useState('');
  const [storyCaption, setStoryCaption] = useState('');
  const [category, setCategory] = useState<'All' | 'Events' | 'Workshops' | 'Vibes'>('Vibes');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
          showToast('Image loaded successfully');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'post') {
      if (!content.trim()) return;
      const newPost: Post = {
        id: `p-${Date.now()}`,
        author: currentUser,
        timeAgo: 'Just now',
        content: content.trim(),
        imageUrl: photoUrl.trim() || undefined,
        reactions: [{ emoji: '🔥', count: 1, active: true }],
        commentsCount: 0,
        commentsList: [],
      };
      if (onAddPost) onAddPost(newPost);
      else addPost(newPost);
    } else if (activeTab === 'photo') {
      if (!photoUrl.trim()) return;
      const newItem: GalleryItem = {
        id: `g-${Date.now()}`,
        title: photoTitle.trim() || 'Vault Snapshot',
        imageUrl: photoUrl.trim(),
        authorAvatar: currentUser.avatar,
        authorName: currentUser.name,
        likes: 1,
        isLiked: true,
        category,
        aspect: 'tall',
      };
      if (onAddGalleryItem) onAddGalleryItem(newItem);
      else addGalleryItem(newItem);
    } else if (activeTab === 'poll') {
      if (!pollQuestion.trim()) return;
      const validOptions = pollOptions.filter((opt) => opt.trim().length > 0);
      if (validOptions.length < 2) return;

      const newPost: Post = {
        id: `p-${Date.now()}`,
        author: currentUser,
        timeAgo: 'Just now',
        content: pollQuestion.trim(),
        poll: {
          question: pollQuestion.trim(),
          totalVotes: 0,
          endsIn: '24 hrs',
          options: validOptions.map((opt, i) => ({
            id: `opt-${i}`,
            text: opt.trim(),
            votes: 0,
          })),
        },
        commentsCount: 0,
        commentsList: [],
      };
      if (onAddPost) onAddPost(newPost);
      else addPost(newPost);
    } else if (activeTab === 'story') {
      if (!photoUrl.trim()) return;
      const newStory: Story = {
        id: `st-${Date.now()}`,
        user: currentUser,
        imageUrl: photoUrl.trim(),
        caption: storyCaption.trim() || undefined,
        timestamp: 'Just now',
        seen: false,
      };
      addStory(newStory);
    }

    // Reset & close
    setContent('');
    setPhotoUrl('');
    setPollQuestion('');
    setPhotoTitle('');
    setStoryCaption('');
    onClose();
  };

  const samplePhotoUrls = [
    {
      label: 'Neon Workspace',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr2QjNkpywtQN7qOP3N-xvpTV0r7NZ1DuOi_EtpkCAcV_ym-DSPf1XVXdFyVjUEUlwcyD7kJ07lK7V6uDLwBDDVtLG_TG0uaPOA5uqXEvRvkHOfVHXSolpt2HVlRuOMKfmq1Q04R9f03nbENZqJEv8s2UHRNwE4ZQbfDI4LwBpCRI3fIdpUaIbnx5GxzegfOWYx2PRoIgaHmfUHI36TdE2YYjOQUikIIV6ut9mXeknDIE2ew-3iXU',
    },
    {
      label: 'Concert Lights',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_VTCkekPprSCc9GwQfevw6aeXVdqupTkw5_APQlVwVo-0RMyZmMHzWMcUbv1oJSVYvrHq5VPMNTvwSk7eaYc0nXBdBnV1GSGu3rFOMzg9pZ-EQ3F_Bvt8P5ALSCFUhed2T_pPFQelgIKMhkuwhnzJpWnbPpUVQgQmvhBTkDwUIqaN0Y-b8CwSFMxuD-yoPwjfYF7WNyDqaa1KGr2gRrOQoatWCTthX6iYhoMUZuWvOhFbBFmgeI8',
    },
    {
      label: 'Nightclub Vibe',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUlAhyo2m-TC5N-LmVd6eIiqviXg2OTkFEg5TMsi6oUF-ksO3Pi0GpyImCDYdN9-TlETUctbOCLuHxOhWFLTzy7hUf2ofAFAkeIhCAqU4SpOryqMAIvHtg45ZXU0s8CqOnBaHa_SJ6ar6GhPm0QuF3rNDLDJ7oRlGtTCa1KcK-UPQsckJf4E_DxLCNsiBCWl4-eHAUTY3_M5bBnY5iLZSFg8nw6UhMphsD6ogxofRHpSjyItMtmcA',
    },
    {
      label: 'Moodboard Wall',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkgKTgGcJOTvtEE9WiN5BECNB9xY1apqDCMpqD-y-6w-UqbRQ2D-NY3nLgJJ43CD_SJ8twcR1Vwex9oa1nJpe9a3Nrnk0_PnzhwRtCSXDlEoBvrC6jEFglTGwl-0mS3dQUaT3YuayXHR6urhtRsTw9ayIMVRCsQhC5W6YPpukXK-cCnTzC39Iu0jmUuCDE5E-5JoNgM4W-5rU6Yn4xJ4TbJ9j-qgwjLrkya0rV3CmD5jYslZD61j0',
    },
  ];

  return (
    <div className="fixed inset-0 z-[80] bg-[#050505]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bold-card bg-[#0d0d0d] w-full max-w-lg rounded-2xl border border-[#262626] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#F2F2F2] text-xl">add_circle</span>
            <h3 className="font-black text-sm text-[#F2F2F2] uppercase tracking-wider">CREATE &amp; BROADCAST</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#777777] hover:text-[#F2F2F2] rounded-full hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#262626] bg-[#080808] p-1.5 gap-1 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('post')}
            className={`flex-1 py-2 px-3 rounded-xl font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'post'
                ? 'bg-[#F2F2F2] text-[#050505] shadow'
                : 'text-[#777777] hover:text-[#AAAAAA]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">edit_note</span>
            Post
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('story')}
            className={`flex-1 py-2 px-3 rounded-xl font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'story'
                ? 'bg-[#F2F2F2] text-[#050505] shadow'
                : 'text-[#777777] hover:text-[#AAAAAA]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">play_circle</span>
            Story
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`flex-1 py-2 px-3 rounded-xl font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'photo'
                ? 'bg-[#F2F2F2] text-[#050505] shadow'
                : 'text-[#777777] hover:text-[#AAAAAA]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">photo_library</span>
            Vault
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('poll')}
            className={`flex-1 py-2 px-3 rounded-xl font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'poll'
                ? 'bg-[#F2F2F2] text-[#050505] shadow'
                : 'text-[#777777] hover:text-[#AAAAAA]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">poll</span>
            Poll
          </button>
        </div>

        {/* Hidden File Picker */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {activeTab === 'post' && (
            <>
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full border border-[#333333] object-cover"
                />
                <div>
                  <p className="font-black text-xs text-[#F2F2F2] uppercase tracking-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-[#777777] font-mono">BROADCASTING TO SQUAD FEED</p>
                </div>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening in your circle?..."
                rows={3}
                className="w-full bg-[#121212] border border-[#262626] rounded-xl p-3.5 text-xs text-[#F2F2F2] placeholder:text-[#555555] focus:outline-none focus:border-[#F2F2F2] resize-none leading-relaxed font-sans"
                autoFocus
              />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-[#777777] font-black uppercase tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#AAAAAA]">image</span>
                    Attach Visual Media
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] text-[#F2F2F2] bg-[#1a1a1a] hover:bg-[#252525] border border-[#333333] px-2.5 py-1 rounded-lg font-mono uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[13px]">upload_file</span>
                    Browse Device
                  </button>
                </div>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Or paste image URL..."
                  className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-[#F2F2F2] placeholder:text-[#555555] focus:outline-none focus:border-[#F2F2F2]"
                />
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  <span className="text-[9px] text-[#666666] font-mono uppercase shrink-0">Presets:</span>
                  {samplePhotoUrls.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(preset.url)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-[#181818] hover:bg-[#222222] text-[#AAAAAA] hover:text-white shrink-0 border border-[#2a2a2a] cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                {photoUrl && (
                  <div className="relative h-28 w-full rounded-xl overflow-hidden border border-[#262626] mt-2">
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="absolute top-2 right-2 p-1 bg-black/70 rounded-full text-white hover:bg-black"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'story' && (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-[#777777] font-black uppercase tracking-widest">
                    Story Visual Media
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] text-[#F2F2F2] bg-[#1a1a1a] hover:bg-[#252525] border border-[#333333] px-2.5 py-1 rounded-lg font-mono uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[13px]">upload_file</span>
                    Browse Device
                  </button>
                </div>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Paste Image URL or pick from device..."
                  className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-[#F2F2F2] placeholder:text-[#555555] focus:outline-none focus:border-[#F2F2F2]"
                  required
                />
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  <span className="text-[9px] text-[#666666] font-mono uppercase shrink-0">Sample Presets:</span>
                  {samplePhotoUrls.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(preset.url)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-[#181818] hover:bg-[#222222] text-[#AAAAAA] hover:text-white shrink-0 border border-[#2a2a2a] cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#777777] font-black uppercase tracking-widest">Story Overlay Caption</label>
                  <input
                    type="text"
                    value={storyCaption}
                    onChange={(e) => setStoryCaption(e.target.value)}
                    placeholder="e.g. 3 AM synth experiment ⚡"
                    className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-[#F2F2F2] placeholder:text-[#555555] focus:outline-none focus:border-[#F2F2F2]"
                  />
                </div>

                {photoUrl && (
                  <div className="h-44 w-full rounded-xl overflow-hidden border border-[#262626] relative">
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    {storyCaption && (
                      <div className="absolute bottom-3 left-3 right-3 text-center bg-black/60 backdrop-blur-md py-1.5 px-3 rounded-lg text-white font-bold text-xs">
                        {storyCaption}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'photo' && (
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] text-[#777777] font-black uppercase tracking-widest">Photo Title / Caption</label>
                <input
                  type="text"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="e.g. Midnight Design Session"
                  className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-[#F2F2F2] placeholder:text-[#555555] focus:outline-none focus:border-[#F2F2F2]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-[#777777] font-black uppercase tracking-widest">Image Source</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] text-[#F2F2F2] bg-[#1a1a1a] hover:bg-[#252525] border border-[#333333] px-2.5 py-1 rounded-lg font-mono uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[13px]">upload_file</span>
                    Browse Device
                  </button>
                </div>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Paste image URL..."
                  className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-[#F2F2F2] placeholder:text-[#555555] focus:outline-none focus:border-[#F2F2F2]"
                  required
                />
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  <span className="text-[9px] text-[#666666] font-mono uppercase shrink-0">Sample Images:</span>
                  {samplePhotoUrls.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(preset.url)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-[#181818] hover:bg-[#222222] text-[#AAAAAA] hover:text-white shrink-0 border border-[#2a2a2a] cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-[#777777] font-black uppercase tracking-widest">Category Collection</label>
                <div className="flex gap-2">
                  {(['Events', 'Workshops', 'Vibes'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                        category === cat
                          ? 'bg-[#F2F2F2] text-[#050505] border-[#F2F2F2]'
                          : 'bg-[#121212] border-[#262626] text-[#777777] hover:text-[#AAAAAA]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {photoUrl && (
                <div className="h-32 w-full rounded-xl overflow-hidden border border-[#262626]">
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </>
          )}

          {activeTab === 'poll' && (
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] text-[#777777] font-black uppercase tracking-widest">Poll Question</label>
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="e.g. Which soundtrack should we vibe to?"
                  className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-[#F2F2F2] placeholder:text-[#555555] focus:outline-none focus:border-[#F2F2F2]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-[#777777] font-black uppercase tracking-widest">Options</label>
                {pollOptions.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const updated = [...pollOptions];
                      updated[i] = e.target.value;
                      setPollOptions(updated);
                    }}
                    placeholder={`Option ${i + 1}`}
                    className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2 text-xs text-[#F2F2F2] placeholder:text-[#555555] focus:outline-none focus:border-[#F2F2F2]"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setPollOptions([...pollOptions, ''])}
                  className="text-xs text-[#AAAAAA] hover:text-[#F2F2F2] flex items-center gap-1 font-black uppercase tracking-wider cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span> Add another option
                </button>
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#262626]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-[#777777] hover:text-[#F2F2F2] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-[#F2F2F2] text-[#050505] hover:bg-white active:scale-95 transition-all shadow-[0_0_16px_rgba(255,255,255,0.2)] cursor-pointer"
            >
              PUBLISH →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
