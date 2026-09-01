import React, { useState, useRef } from 'react';
import { ScreenType, Post } from '../../types';
import { useApp } from '../../context/AppContext';
import { StoryViewer } from '../StoryViewer';

interface GroupFeedScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenCreate: () => void;
}

export const GroupFeedScreen: React.FC<GroupFeedScreenProps> = ({
  onNavigate,
  onOpenCreate,
}) => {
  const {
    currentUser,
    currentSquad,
    allSquads,
    switchSquad,
    posts,
    stories,
    addPost,
    deletePost,
    toggleReaction,
    votePoll,
    addComment,
    likeComment,
    showToast,
  } = useApp();

  const [newPostText, setNewPostText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string>('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [storyViewerIndex, setStoryViewerIndex] = useState<number | null>(null);
  const [showSquadSelector, setShowSquadSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCommentPost = posts.find((p) => p.id === activeCommentPostId);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAttachedImage(reader.result);
          showToast('Image attached to post');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateQuickPost = () => {
    if (!newPostText.trim() && !attachedImage) return;
    const post: Post = {
      id: `p-${Date.now()}`,
      author: currentUser,
      timeAgo: 'Just now',
      content: newPostText.trim(),
      imageUrl: attachedImage || undefined,
      reactions: [{ emoji: '🔥', count: 1, active: true }],
      commentsCount: 0,
      commentsList: [],
    };
    addPost(post);
    setNewPostText('');
    setAttachedImage('');
  };

  const handlePostCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCommentPostId || !commentInput.trim()) return;
    addComment(activeCommentPostId, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="bg-[#050505] text-[#F2F2F2] min-h-screen pb-32">
      {/* Main Feed Canvas */}
      <main className="pt-20 md:pt-24 px-4 max-w-2xl mx-auto flex flex-col gap-6">
        {/* Horizontal Stories / Loops Row */}
        <section className="bold-card rounded-2xl p-4 border border-[#262626] bg-[#0d0d0d]">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F2F2F2] animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#888888] font-mono">
                SQUAD LOOPS &amp; MOMENTS
              </span>
            </div>
            <button
              onClick={onOpenCreate}
              className="text-[10px] font-black uppercase tracking-wider text-[#AAAAAA] hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[13px]">add</span> Add Story
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
            {/* Create your own story button */}
            <button
              onClick={onOpenCreate}
              className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#555555] group-hover:border-white flex items-center justify-center bg-[#141414] transition-all relative">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full object-cover opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xl">add</span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-tight text-[#888888] group-hover:text-white">Your Loop</span>
            </button>

            {/* Stories */}
            {stories.map((st, idx) => (
              <button
                key={st.id}
                onClick={() => setStoryViewerIndex(idx)}
                className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-full p-0.5 transition-all ${
                  st.seen ? 'border border-[#333333]' : 'border-2 border-white shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                }`}>
                  <img
                    src={st.user.avatar}
                    alt={st.user.name}
                    className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tight text-[#CCCCCC] group-hover:text-white max-w-[60px] truncate">
                  {st.user.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Hidden File Picker */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        {/* Post Creation Input Area */}
        <section className="bold-card rounded-2xl p-5 border border-[#262626] bg-[#0d0d0d]">
          <div className="flex gap-3.5 items-start">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#333333] shadow">
              <img
                className="w-full h-full object-cover"
                alt={currentUser.name}
                src={currentUser.avatar}
              />
            </div>
            <div className="flex-1">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                className="w-full bg-[#141414] border border-[#262626] rounded-xl p-3.5 text-xs text-[#F2F2F2] placeholder:text-[#666666] focus:border-[#666666] focus:outline-none transition-all resize-none font-sans leading-relaxed"
                placeholder={`Drop an update or idea for ${currentSquad.name}...`}
                rows={2}
              />

              {/* Preview attached image */}
              {attachedImage && (
                <div className="relative h-28 w-full rounded-xl overflow-hidden border border-[#333333] mt-2">
                  <img src={attachedImage} alt="Attachment" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setAttachedImage('')}
                    className="absolute top-2 right-2 p-1 bg-black/80 rounded-full text-white hover:bg-black"
                  >
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-[#222222]">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-[#AAAAAA] hover:text-[#F2F2F2] hover:bg-[#1a1a1a] rounded-full transition-colors flex items-center justify-center cursor-pointer"
                    title="Upload Image"
                  >
                    <span className="material-symbols-outlined text-[18px]">image</span>
                  </button>
                  <button
                    onClick={onOpenCreate}
                    className="p-2 text-[#AAAAAA] hover:text-[#F2F2F2] hover:bg-[#1a1a1a] rounded-full transition-colors flex items-center justify-center cursor-pointer"
                    title="Create Poll"
                  >
                    <span className="material-symbols-outlined text-[18px]">poll</span>
                  </button>
                  <button
                    onClick={() => {
                      setNewPostText((prev) => prev + ' ⚡🔥');
                    }}
                    className="p-2 text-[#AAAAAA] hover:text-[#F2F2F2] hover:bg-[#1a1a1a] rounded-full transition-colors flex items-center justify-center cursor-pointer"
                    title="Add Emoji"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_reaction</span>
                  </button>
                </div>
                <button
                  onClick={handleCreateQuickPost}
                  disabled={!newPostText.trim() && !attachedImage}
                  className={`font-black text-[11px] uppercase tracking-widest px-6 py-2 rounded-full transition-all duration-200 ${
                    newPostText.trim() || attachedImage
                      ? 'bg-[#F2F2F2] text-[#050505] hover:bg-white active:scale-95 cursor-pointer shadow-[0_0_16px_rgba(255,255,255,0.2)]'
                      : 'bg-[#1a1a1a] text-[#555555] cursor-not-allowed border border-[#222222]'
                  }`}
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Feed Posts */}
        {posts.map((post, postIndex) => (
          <article
            key={post.id}
            className="bold-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4 border border-[#262626] bg-[#0d0d0d]"
          >
            {/* Author Header */}
            <div className="flex justify-between items-center">
              <div className="flex gap-3.5 items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#333333] shadow">
                  <img
                    className="w-full h-full object-cover"
                    alt={post.author.name}
                    src={post.author.avatar}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm text-[#F2F2F2] uppercase tracking-tight">{post.author.name}</h3>
                    <span className="text-[9px] font-mono text-[#777777]">#{String(postIndex + 1).padStart(2, '0')}</span>
                  </div>
                  <span className="text-[11px] text-[#777777] font-mono">{post.timeAgo}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {post.poll && (
                  <span className="bg-[#1a1a1a] text-[#F2F2F2] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#333333]">
                    POLL
                  </span>
                )}
                {post.author.id === currentUser.id && (
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-[#666666] hover:text-[#ff4444] p-1 rounded-full cursor-pointer transition-colors"
                    title="Delete Post"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                )}
              </div>
            </div>

            {/* Content Body */}
            <div>
              <p className="font-body text-xs sm:text-sm text-[#E0E0E0] leading-relaxed mb-3">
                {post.content}
              </p>

              {/* Photo attachment */}
              {post.imageUrl && (
                <div 
                  onClick={() => setLightboxImage(post.imageUrl!)}
                  className="rounded-xl overflow-hidden border border-[#262626] mb-3 relative group cursor-pointer"
                >
                  <img
                    className="w-full h-auto max-h-[340px] object-cover transition-transform duration-500 group-hover:scale-102"
                    alt="Post visual"
                    src={post.imageUrl}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#F2F2F2] bg-[#111111]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#333333]">
                      Expand Visual
                    </span>
                  </div>
                </div>
              )}

              {/* Poll Interface */}
              {post.poll && (
                <div className="flex flex-col gap-2 mb-3 bg-[#121212] p-4 rounded-xl border border-[#262626]">
                  {post.poll.options.map((opt) => {
                    const total = post.poll!.options.reduce((acc, o) => acc + o.votes, 0) || 1;
                    const percent = Math.round((opt.votes / total) * 100);
                    const isVoted = post.poll!.userVotedId === opt.id;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => votePoll(post.id, opt.id)}
                        className={`relative w-full border rounded-xl p-3.5 flex justify-between items-center overflow-hidden transition-all text-left group cursor-pointer ${
                          isVoted
                            ? 'border-[#F2F2F2] bg-[#1c1c1c]'
                            : 'border-[#262626] hover:border-[#555555] bg-[#0f0f0f]'
                        }`}
                      >
                        {/* Fill Progress Bar */}
                        <div
                          style={{ width: `${percent}%` }}
                          className={`absolute inset-y-0 left-0 transition-all duration-500 ease-out z-0 ${
                            isVoted
                              ? 'bg-[#F2F2F2]/20'
                              : 'bg-white/5 group-hover:bg-white/10'
                          }`}
                        />
                        <span className="font-bold text-xs text-[#F2F2F2] relative z-10 flex items-center gap-2">
                          {isVoted && <span className="material-symbols-outlined text-[15px] text-[#F2F2F2]">check_circle</span>}
                          {opt.text}
                        </span>
                        <span className="text-xs font-mono font-black text-[#AAAAAA] relative z-10">
                          {percent}%
                        </span>
                      </button>
                    );
                  })}
                  <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider text-[#777777] mt-1 pt-1 border-t border-[#222222]">
                    <span>{post.poll.totalVotes} votes total</span>
                    <span>Ends in: {post.poll.endsIn}</span>
                  </div>
                </div>
              )}

              {/* Reactions and Comments Bar */}
              <div className="flex items-center gap-2.5 mt-2 text-[#888888] pt-2 border-t border-[#1e1e1e]">
                {post.reactions?.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => toggleReaction(post.id, r.emoji)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                      r.active
                        ? 'bg-[#222222] border-[#555555] text-[#F2F2F2]'
                        : 'bg-[#121212] border-[#262626] text-[#888888] hover:border-[#444444]'
                    }`}
                  >
                    <span>{r.emoji}</span>
                    <span className="font-mono text-[11px]">{r.count}</span>
                  </button>
                ))}

                {/* Quick Add Reaction buttons */}
                <button
                  onClick={() => toggleReaction(post.id, '❤️')}
                  className="hover:scale-125 transition-transform p-1 text-xs opacity-70 hover:opacity-100 cursor-pointer"
                  title="Love"
                >
                  ❤️
                </button>
                <button
                  onClick={() => toggleReaction(post.id, '⚡')}
                  className="hover:scale-125 transition-transform p-1 text-xs opacity-70 hover:opacity-100 cursor-pointer"
                  title="Energy"
                >
                  ⚡
                </button>
                <button
                  onClick={() => toggleReaction(post.id, '🔥')}
                  className="hover:scale-125 transition-transform p-1 text-xs opacity-70 hover:opacity-100 cursor-pointer"
                  title="Fire"
                >
                  🔥
                </button>

                {/* Comments trigger */}
                <button
                  onClick={() => setActiveCommentPostId(post.id)}
                  className="flex items-center gap-1.5 hover:text-[#F2F2F2] transition-colors text-xs font-black uppercase tracking-wider ml-auto p-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                  <span>{post.commentsCount} Comments</span>
                </button>

                {/* Share trigger */}
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    showToast('Link to post copied');
                  }}
                  className="flex items-center hover:text-[#F2F2F2] transition-colors p-1 cursor-pointer"
                  title="Share Post"
                >
                  <span className="material-symbols-outlined text-[16px]">share</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </main>

      {/* Lightbox for post images */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[90] bg-[#050505]/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="relative max-w-2xl max-h-[85vh]">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 p-2 bg-[#141414] border border-[#333333] rounded-full text-[#F2F2F2] hover:bg-white hover:text-black cursor-pointer z-10"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <img
              src={lightboxImage}
              alt="Expanded visual"
              className="rounded-2xl max-h-[80vh] object-contain border border-[#333333] shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Comments Drawer / Modal */}
      {activeCommentPost && (
        <div 
          onClick={() => setActiveCommentPostId(null)}
          className="fixed inset-0 z-[85] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0d0d0d] w-full max-w-lg rounded-t-3xl sm:rounded-2xl border border-[#262626] shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
          >
            <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-[#121212]">
              <div>
                <h4 className="font-black text-xs uppercase tracking-tight text-[#F2F2F2]">
                  Thread Responses ({activeCommentPost.commentsCount})
                </h4>
                <p className="text-[11px] text-[#888888] truncate max-w-xs font-mono">
                  {activeCommentPost.content}
                </p>
              </div>
              <button
                onClick={() => setActiveCommentPostId(null)}
                className="p-1 rounded-full text-[#888888] hover:text-[#F2F2F2] cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-[#1e1e1e]">
              {activeCommentPost.commentsList && activeCommentPost.commentsList.length > 0 ? (
                activeCommentPost.commentsList.map((comm) => (
                  <div key={comm.id} className="pt-3 first:pt-0 flex gap-3 items-start">
                    <img
                      src={comm.author.avatar}
                      alt={comm.author.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#333333] shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-[#F2F2F2] uppercase tracking-tight">{comm.author.name}</span>
                        <span className="text-[10px] text-[#777777] font-mono">{comm.timeAgo}</span>
                      </div>
                      <p className="text-xs text-[#CCCCCC] mt-0.5 leading-relaxed">{comm.content}</p>
                    </div>
                    <button
                      onClick={() => likeComment(activeCommentPost.id, comm.id)}
                      className="text-[#777777] hover:text-white flex items-center gap-1 text-[10px] font-mono p-1"
                    >
                      <span className="material-symbols-outlined text-[13px]">favorite</span>
                      <span>{comm.likes || 0}</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[#777777] text-xs font-mono">
                  No responses recorded yet. Be the first to chime in!
                </div>
              )}
            </div>

            {/* Add Comment input */}
            <form onSubmit={handlePostCommentSubmit} className="p-3.5 bg-[#121212] border-t border-[#262626] flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Write a response..."
                className="flex-1 bg-[#1a1a1a] border border-[#262626] rounded-full px-4 py-2 text-xs text-[#F2F2F2] placeholder:text-[#666666] focus:outline-none focus:border-[#666666]"
                autoFocus
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-5 py-2 bg-[#F2F2F2] text-[#050505] font-black text-[10px] uppercase tracking-widest rounded-full disabled:opacity-30 cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Story Viewer Modal */}
      {storyViewerIndex !== null && (
        <StoryViewer
          initialStoryIndex={storyViewerIndex}
          onClose={() => setStoryViewerIndex(null)}
        />
      )}
    </div>
  );
};
