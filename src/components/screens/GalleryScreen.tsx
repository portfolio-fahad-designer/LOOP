import React, { useState } from 'react';
import { ScreenType, GalleryItem, GalleryHighlight } from '../../types';

interface GalleryScreenProps {
  highlights: GalleryHighlight[];
  galleryItems: GalleryItem[];
  onToggleLike: (itemId: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const GalleryScreen: React.FC<GalleryScreenProps> = ({
  highlights,
  galleryItems,
  onToggleLike,
  onNavigate,
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Events' | 'Workshops' | 'Vibes'>('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = activeFilter === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <div className="bg-[#050505] text-[#F2F2F2] min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="bg-[#050505]/95 backdrop-blur-md fixed top-10 left-0 w-full z-40 flex items-center justify-between px-5 h-16 border-b border-[#262626]">
        <button
          onClick={() => onNavigate('feed')}
          className="text-[#999999] hover:text-[#F2F2F2] transition-colors p-2 rounded-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="arrow_back">arrow_back</span>
        </button>
        <div className="flex items-center gap-3">
          <h1 className="font-black text-xl tracking-tighter text-[#F2F2F2] uppercase">
            GALLERY
          </h1>
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#888888] bg-[#141414] border border-[#262626] px-2 py-0.5 rounded-full">
            VAULT
          </span>
        </div>
        <button
          onClick={() => onNavigate('feed')}
          className="text-[#999999] hover:text-[#F2F2F2] transition-colors p-2 rounded-full cursor-pointer"
          title="Group Feed"
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="photo_library">photo_library</span>
        </button>
      </header>

      <main className="pt-28 px-4 max-w-5xl mx-auto">
        {/* Highlights Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#777777]">01 //</span>
              <h2 className="font-black text-base text-[#F2F2F2] uppercase tracking-tight">FEATURED HIGHLIGHTS</h2>
            </div>
            <span className="text-[10px] font-mono uppercase text-[#777777] tracking-widest">{highlights.length} ARCHIVES</span>
          </div>

          <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2 snap-x">
            {highlights.map((highlight, index) => (
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

        {/* Filters */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#777777]">02 //</span>
              <h3 className="font-black text-sm text-[#F2F2F2] uppercase tracking-tight">COLLECTION FILTER</h3>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {(['All', 'Events', 'Workshops', 'Vibes'] as const).map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#F2F2F2] text-[#050505] shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                      : 'bg-[#121212] text-[#888888] border border-[#262626] hover:text-[#F2F2F2] hover:border-[#444444]'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </section>

        {/* Masonry Grid */}
        <section className="grid grid-cols-2 gap-4 pb-12">
          {filteredItems.map((item, index) => {
            const isWide = item.aspect === 'wide' || index === 2;
            const isTall = item.aspect === 'tall' || index === 0 || index === 4;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`relative rounded-2xl overflow-hidden bold-card group cursor-pointer border border-[#262626] bg-[#0d0d0d] ${
                  isWide ? 'col-span-2 h-72 sm:h-80' : isTall ? 'h-80 sm:h-96' : 'h-64 sm:h-72'
                }`}
              >
                <img
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  alt={item.title || 'Gallery image'}
                  src={item.imageUrl}
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Bottom user badge & caption */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <img
                      className="w-7 h-7 rounded-full border border-[#333333] object-cover shadow"
                      alt="Avatar"
                      src={item.authorAvatar}
                    />
                    {item.title && (
                      <span className="text-xs font-bold text-[#F2F2F2] line-clamp-1 uppercase tracking-tight">
                        {item.title}
                      </span>
                    )}
                  </div>

                  {/* Actions (Like / Comment) */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(item.id);
                      }}
                      className="flex items-center gap-1 bg-[#121212]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#333333] text-[#F2F2F2] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <span
                        className={`material-symbols-outlined text-[15px] ${
                          item.isLiked ? 'text-[#F2F2F2]' : 'text-[#888888]'
                        }`}
                      >
                        favorite
                      </span>
                      <span className="text-[11px] font-mono font-bold">{item.likes}</span>
                    </button>

                    {item.comments !== undefined && (
                      <div className="flex items-center gap-1 bg-[#121212]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#333333] text-[#AAAAAA]">
                        <span className="material-symbols-outlined text-[14px]">chat_bubble</span>
                        <span className="text-[11px] font-mono font-bold">{item.comments}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* Lightbox Preview Modal */}
      {selectedItem && (
        <div 
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-[90] bg-[#050505]/95 backdrop-blur-xl flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full bg-[#0d0d0d] rounded-2xl overflow-hidden border border-[#262626] shadow-2xl relative"
          >
            <div className="p-4 flex items-center justify-between border-b border-[#262626] bg-[#121212]">
              <div className="flex items-center gap-3">
                <img
                  src={selectedItem.authorAvatar}
                  alt="Author"
                  className="w-8 h-8 rounded-full border border-[#333333] object-cover"
                />
                <div>
                  <h4 className="font-black text-sm text-[#F2F2F2] uppercase tracking-tight">{selectedItem.title || 'ARCHIVED CAPTURE'}</h4>
                  <p className="text-[11px] text-[#777777] font-mono uppercase">{selectedItem.category} // THE SQUAD</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-full text-[#888888] hover:text-[#F2F2F2] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="max-h-[65vh] overflow-hidden flex items-center justify-center bg-[#050505]">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title || 'Expanded view'}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="p-4 flex items-center justify-between bg-[#121212] border-t border-[#262626]">
              <button
                onClick={() => onToggleLike(selectedItem.id)}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-[#1a1a1a] text-[#F2F2F2] px-4 py-2 rounded-full border border-[#333333] hover:border-[#666666] transition-all cursor-pointer"
              >
                <span className={`material-symbols-outlined text-[16px] ${selectedItem.isLiked ? 'text-[#F2F2F2]' : 'text-[#888888]'}`}>
                  favorite
                </span>
                <span>{selectedItem.likes} Likes</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(selectedItem.imageUrl);
                  alert('Photo URL copied to clipboard!');
                }}
                className="flex items-center gap-1.5 text-xs text-[#AAAAAA] hover:text-[#F2F2F2] px-3 py-1.5 uppercase font-bold tracking-wider cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">share</span> Share Visual
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
