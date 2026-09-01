import React, { useState, useRef } from 'react';
import { ScreenType, GalleryItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { galleryHighlights } from '../../data/mockData';

interface GalleryScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenCreate?: () => void;
}

export const GalleryScreen: React.FC<GalleryScreenProps> = ({
  onNavigate,
  onOpenCreate,
}) => {
  const {
    galleryPhotos,
    toggleGalleryLike,
    deleteGalleryItem,
    addGalleryItem,
    currentUser,
    currentSquad,
    showToast,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Events' | 'Workshops' | 'Vibes'>('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [lightboxComment, setLightboxComment] = useState('');
  const [itemComments, setItemComments] = useState<{ [id: string]: string[] }>({
    g1: ['The contrast on this setup is mindblowing!', 'What monitor arm is that?'],
    g3: ['Saving this whole moodboard for inspiration.'],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const newItem: GalleryItem = {
            id: `g-${Date.now()}`,
            title: file.name.replace(/\.[^/.]+$/, ''),
            imageUrl: reader.result,
            authorAvatar: currentUser.avatar,
            authorName: currentUser.name,
            likes: 1,
            isLiked: true,
            category: activeFilter === 'All' ? 'Vibes' : activeFilter,
            aspect: 'tall',
          };
          addGalleryItem(newItem);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLightboxComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !lightboxComment.trim()) return;
    const prev = itemComments[selectedItem.id] || [];
    setItemComments({
      ...itemComments,
      [selectedItem.id]: [...prev, `${currentUser.name}: ${lightboxComment.trim()}`],
    });
    setLightboxComment('');
    showToast('Comment posted to visual asset');
  };

  const filteredItems = activeFilter === 'All' 
    ? galleryPhotos 
    : galleryPhotos.filter(item => item.category === activeFilter);

  return (
    <div className="bg-[#050505] text-[#F2F2F2] min-h-screen pb-32">
      {/* Sub Header Toolbar */}
      <div className="pt-20 px-4 max-w-4xl mx-auto flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('feed')}
            className="text-[#999999] hover:text-[#F2F2F2] transition-colors p-1.5 rounded-full hover:bg-[#181818] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h1 className="font-black text-xl tracking-tighter text-[#F2F2F2] uppercase">
              {currentSquad.name} // VAULT
            </h1>
            <p className="text-[10px] text-[#777] font-mono">ENCRYPTED MEDIA ARCHIVE</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#888888] bg-[#141414] border border-[#262626] px-3 py-1 rounded-full">
            {filteredItems.length} ASSETS
          </span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-white/90 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Hidden File Picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      <main className="pt-28 px-4 max-w-5xl mx-auto">
        {/* Featured Highlights Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#777777]">01 //</span>
              <h2 className="font-black text-base text-[#F2F2F2] uppercase tracking-tight">FEATURED HIGHLIGHTS</h2>
            </div>
            <span className="text-[10px] font-mono uppercase text-[#777777] tracking-widest">
              {galleryHighlights.length} ARCHIVES
            </span>
          </div>

          <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2 snap-x">
            {galleryHighlights.map((highlight, index) => (
              <div
                key={highlight.id}
                onClick={() => {
                  setSelectedItem({
                    id: highlight.id,
                    title: highlight.title,
                    imageUrl: highlight.imageUrl,
                    authorAvatar: highlight.authorAvatar,
                    authorName: highlight.author,
                    likes: 48,
                    category: 'Vibes',
                    aspect: 'tall',
                  });
                }}
                className="snap-center shrink-0 w-64 h-80 rounded-2xl overflow-hidden relative group cursor-pointer border border-[#262626] bg-[#0d0d0d]"
              >
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={highlight.title}
                  src={highlight.imageUrl}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <span className="text-[9px] font-mono font-black text-[#F2F2F2] bg-[#050505]/80 backdrop-blur-md px-2 py-0.5 rounded border border-[#333333]">
                    #{String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-black text-sm text-[#F2F2F2] uppercase tracking-tight mb-2 line-clamp-1">{highlight.title}</p>
                  <div className="flex items-center gap-2">
                    <img
                      className="w-6 h-6 rounded-full border border-[#444444] object-cover"
                      alt={highlight.author}
                      src={highlight.authorAvatar}
                    />
                    <span className="text-xs text-[#AAAAAA] font-bold uppercase tracking-wider">{highlight.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filter Pills */}
        <section className="mb-6">
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-2">
            <div className="flex gap-2">
              {(['All', 'Events', 'Workshops', 'Vibes'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    activeFilter === filter
                      ? 'bg-[#F2F2F2] text-[#050505] shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                      : 'bg-[#121212] text-[#888888] hover:text-[#F2F2F2] border border-[#262626]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-[#141414] hover:bg-[#202020] text-white border border-[#333333] flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              <span>Upload Photo</span>
            </button>
          </div>
        </section>

        {/* Gallery Masonry Grid */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`relative rounded-2xl overflow-hidden border border-[#262626] bg-[#0d0d0d] group cursor-pointer ${
                  item.aspect === 'tall' ? 'row-span-2 h-96' : 'h-48 md:h-56'
                }`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || 'Gallery item'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-black uppercase tracking-widest text-white bg-black/60 px-2 py-0.5 rounded-full border border-white/20">
                      {item.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGalleryLike(item.id);
                      }}
                      className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-[#ff4444] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {item.isLiked ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>
                  </div>

                  <div>
                    {item.title && (
                      <p className="font-black text-xs uppercase text-white tracking-tight line-clamp-1">{item.title}</p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1.5">
                        <img src={item.authorAvatar} alt="Author" className="w-4 h-4 rounded-full object-cover" />
                        <span className="text-[10px] text-white/80 font-mono">{item.authorName || 'Squad Member'}</span>
                      </div>
                      <span className="text-[10px] text-white font-mono flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">favorite</span>
                        {item.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-[#0d0d0d] border border-[#333333] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#262626] bg-[#121212]">
              <div className="flex items-center gap-3">
                <img src={selectedItem.authorAvatar} alt="Author" className="w-8 h-8 rounded-full object-cover border border-[#444]" />
                <div>
                  <h3 className="font-black text-xs text-white uppercase tracking-tight">{selectedItem.title || 'Vault Item'}</h3>
                  <p className="text-[10px] text-[#888] font-mono">{selectedItem.authorName || 'Collective Asset'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = selectedItem.imageUrl;
                    a.download = `vault-asset-${selectedItem.id}.jpg`;
                    a.target = '_blank';
                    a.click();
                    showToast('Initiated asset download');
                  }}
                  className="p-2 text-[#888] hover:text-white rounded-full hover:bg-[#222]"
                  title="Download Image"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                </button>
                {selectedItem.authorName === currentUser.name && (
                  <button
                    onClick={() => {
                      deleteGalleryItem(selectedItem.id);
                      setSelectedItem(null);
                    }}
                    className="p-2 text-[#888] hover:text-[#ff4444] rounded-full hover:bg-[#222]"
                    title="Delete Media"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 text-[#888] hover:text-white rounded-full hover:bg-[#222]"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            {/* Lightbox Image Preview */}
            <div className="flex-1 max-h-[50vh] bg-black flex items-center justify-center p-2">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title || 'Preview'}
                className="max-h-[48vh] w-auto object-contain rounded-xl"
              />
            </div>

            {/* Comments & Interactions */}
            <div className="p-4 border-t border-[#262626] bg-[#101010] space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleGalleryLike(selectedItem.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold transition-all ${
                    selectedItem.isLiked
                      ? 'bg-white text-black border-white'
                      : 'bg-[#181818] text-[#888] border-[#333] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {selectedItem.isLiked ? 'favorite' : 'favorite_border'}
                  </span>
                  <span>{selectedItem.likes} Likes</span>
                </button>
                <span className="text-[10px] font-mono text-[#666] uppercase">VAULT ASSET #{selectedItem.id.slice(-4)}</span>
              </div>

              {/* Comments on this asset */}
              <div className="space-y-1 max-h-24 overflow-y-auto no-scrollbar">
                {(itemComments[selectedItem.id] || []).map((comm, idx) => (
                  <p key={idx} className="text-xs text-[#BBB] font-sans bg-[#181818] p-2 rounded-lg border border-[#262626]">
                    {comm}
                  </p>
                ))}
              </div>

              <form onSubmit={handleAddLightboxComment} className="flex gap-2">
                <input
                  type="text"
                  value={lightboxComment}
                  onChange={(e) => setLightboxComment(e.target.value)}
                  placeholder="Drop a note on this photo..."
                  className="flex-1 bg-[#181818] border border-[#2c2c2c] rounded-full px-4 py-2 text-xs text-white placeholder:text-[#555] focus:outline-none focus:border-white"
                />
                <button
                  type="submit"
                  disabled={!lightboxComment.trim()}
                  className="px-4 py-2 rounded-full bg-white text-black text-xs font-black uppercase disabled:opacity-30"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
