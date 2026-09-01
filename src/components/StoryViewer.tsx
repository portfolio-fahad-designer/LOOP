import React, { useState, useEffect } from 'react';
import { Story } from '../types';
import { useApp } from '../context/AppContext';

interface StoryViewerProps {
  initialStoryIndex: number;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ initialStoryIndex, onClose }) => {
  const { stories, markStorySeen, sendMessage, showToast } = useApp();
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (currentStory) {
      markStorySeen(currentStory.id);
    }
  }, [currentIndex, currentStory, markStorySeen]);

  // Timer loop for auto-advancing story
  useEffect(() => {
    if (isPaused) return;

    const interval = 50; // update every 50ms
    const step = 100 / (5000 / interval); // 5 seconds duration

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((c) => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, stories.length, onClose]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((c) => c + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((c) => c - 1);
      setProgress(0);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    sendMessage(`Replied to story: "${replyText.trim()}"`);
    showToast(`Reply sent to ${currentStory.user.name}`);
    setReplyText('');
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black flex items-center justify-center select-none">
      <div 
        className="relative w-full max-w-md h-full sm:h-[90vh] sm:rounded-2xl overflow-hidden bg-[#050505] flex flex-col justify-between border border-[#262626]"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Top Progress Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex gap-1.5">
          {stories.map((story, i) => (
            <div key={story.id} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75 ease-linear"
                style={{
                  width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Story Author Header */}
        <div className="absolute top-7 left-4 right-4 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentStory.user.avatar}
              alt={currentStory.user.name}
              className="w-9 h-9 rounded-full object-cover border border-white/50 shadow"
            />
            <div>
              <p className="font-black text-xs text-white uppercase tracking-tight">{currentStory.user.name}</p>
              <p className="text-[10px] text-white/70 font-mono">{currentStory.timestamp}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 text-white/80 hover:text-white rounded-full bg-black/40 backdrop-blur-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPaused ? 'play_arrow' : 'pause'}
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white rounded-full bg-black/40 backdrop-blur-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Story Visual Media */}
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <img
            src={currentStory.imageUrl}
            alt="Story media"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        </div>

        {/* Left & Right Tap Zones for navigation */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute inset-y-20 left-0 w-1/3 z-20 opacity-0 cursor-pointer"
          title="Previous story"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute inset-y-20 right-0 w-1/3 z-20 opacity-0 cursor-pointer"
          title="Next story"
        />

        {/* Bottom Caption & Reply Bar */}
        <div className="relative z-30 p-4 space-y-3 mt-auto">
          {currentStory.caption && (
            <p className="text-white text-sm font-bold text-center bg-black/50 backdrop-blur-md py-2 px-4 rounded-xl border border-white/10 shadow-lg">
              {currentStory.caption}
            </p>
          )}

          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${currentStory.user.name}...`}
              className="flex-1 bg-black/60 border border-white/20 rounded-full px-4 py-2.5 text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-white backdrop-blur-md"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-2.5 rounded-full bg-white text-black font-black disabled:opacity-40 hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
