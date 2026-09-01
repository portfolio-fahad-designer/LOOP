import React, { useState, useEffect, useRef } from 'react';
import { ScreenType, ChatMessage } from '../../types';
import { currentUser, allUsers } from '../../data/mockData';

interface GroupChatScreenProps {
  messages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const GroupChatScreen: React.FC<GroupChatScreenProps> = ({
  messages,
  onSendMessage,
  onNavigate,
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCallModal, setShowCallModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ senderName: string; text: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: currentUser,
      isUser: true,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      replyTo: replyingTo || undefined,
      status: 'read',
    };

    onSendMessage(newMsg);
    setInputText('');
    setReplyingTo(null);

    // Simulate smart team response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Love this direction! Let's lock in the specs for Friday's sprint review. 🚀",
        "Pushed the latest design tokens to Figma. Check the 'Cyberpunk Vibe' page!",
        "Agreed! Dropping the updated SVG assets into the shared gallery now.",
        "Just tested this on an OLED display, the contrast is unreal.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const botMsg: ChatMessage = {
        id: `m-${Date.now() + 1}`,
        sender: Math.random() > 0.5 ? allUsers.alex : allUsers.chloe,
        isUser: false,
        text: randomResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onSendMessage(botMsg);
    }, 2500);
  };

  return (
    <div className="bg-[#050505] text-[#F2F2F2] min-h-screen flex flex-col antialiased">
      {/* TopAppBar */}
      <header className="fixed top-10 left-0 w-full z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-[#262626] flex justify-between items-center px-4 py-2 h-16">
        <button
          onClick={() => onNavigate('feed')}
          className="text-[#999999] hover:text-[#F2F2F2] transition-colors flex items-center justify-center p-2 rounded-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="arrow_back">arrow_back</span>
        </button>

        <div className="flex flex-col items-center flex-1 cursor-pointer" onClick={() => onNavigate('settings')}>
          <div className="flex items-center gap-2">
            <h1 className="font-black text-base tracking-tight text-[#F2F2F2] uppercase">
              DESIGN SQUAD
            </h1>
            <span className="text-[9px] font-mono text-[#888888] bg-[#141414] border border-[#262626] px-1.5 py-0.2 rounded">
              ENCRYPTED
            </span>
          </div>
          <p className="text-[10px] text-[#777777] font-mono flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2F2F2] animate-pulse"></span>
            4 MEMBERS ACTIVE
          </p>
        </div>

        <button
          onClick={() => setShowCallModal(true)}
          className="text-[#999999] hover:text-[#F2F2F2] transition-colors flex items-center justify-center p-2 rounded-full cursor-pointer"
          title="Start Squad Video Call"
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="videocam">videocam</span>
        </button>
      </header>

      {/* Chat Messages Canvas */}
      <main className="flex-1 overflow-y-auto no-scrollbar pt-28 pb-44 px-4 max-w-2xl mx-auto w-full flex flex-col gap-4">
        {/* Date divider */}
        <div className="flex justify-center my-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#777777] bg-[#121212] px-4 py-1 rounded-full border border-[#262626]">
            TODAY // SESSION LOG
          </span>
        </div>

        {/* Message Items */}
        {messages.map((msg) => {
          if (msg.isUser) {
            // User message (Right-aligned)
            return (
              <div key={msg.id} className="flex flex-col items-end gap-1 max-w-[85%] self-end mt-1">
                {msg.replyTo && (
                  <div className="text-[10px] font-mono text-[#999999] bg-[#141414] px-3 py-1 rounded-t-lg border-l-2 border-[#F2F2F2] mr-1">
                    Replying to {msg.replyTo.senderName}: "{msg.replyTo.text}"
                  </div>
                )}
                <div className="bg-[#F2F2F2] text-[#050505] px-4 py-3 rounded-2xl rounded-br-sm shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                  {msg.text && <p className="text-sm font-semibold leading-relaxed">{msg.text}</p>}
                </div>
                <div className="mr-1 text-[10px] text-[#777777] font-mono flex items-center gap-1">
                  <span>{msg.time}</span> • 
                  <span className="material-symbols-outlined text-[13px] text-[#F2F2F2]">done_all</span>
                </div>
              </div>
            );
          }

          // Friend Message (Left-aligned)
          return (
            <div key={msg.id} className="flex flex-col items-start gap-1 max-w-[85%] self-start mt-1 group">
              <div className="flex items-end gap-2.5">
                <img
                  src={msg.sender.avatar}
                  alt={msg.sender.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#333333] shadow"
                />

                <div className="flex flex-col gap-1">
                  {/* Reply preview if available */}
                  {msg.replyTo && (
                    <div className="flex items-center gap-2 pl-2 pb-0.5 opacity-80">
                      <span className="material-symbols-outlined text-[13px] text-[#777777]">reply</span>
                      <div className="bg-[#121212] px-2 py-0.5 rounded text-[10px] font-mono border border-[#262626] truncate max-w-[200px]">
                        <span className="text-[#F2F2F2] font-black uppercase">{msg.replyTo.senderName}:</span>
                        <span className="text-[#888888] ml-1">{msg.replyTo.text}</span>
                      </div>
                    </div>
                  )}

                  {/* Text Message */}
                  {msg.text && (
                    <div className="bg-[#121212] text-[#F2F2F2] px-4 py-3 rounded-2xl rounded-bl-sm border border-[#262626] shadow">
                      <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                    </div>
                  )}

                  {/* Image Attachment */}
                  {msg.imageUrl && (
                    <div className="bg-[#121212] p-1.5 rounded-2xl rounded-bl-sm border border-[#262626] shadow">
                      <div className="relative w-56 sm:w-64 h-72 rounded-xl overflow-hidden">
                        <img
                          src={msg.imageUrl}
                          alt="Shared media"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="ml-11 text-[10px] text-[#777777] font-mono flex items-center gap-2">
                <span className="uppercase font-bold text-[#AAAAAA]">{msg.sender.name}</span> • <span>{msg.time}</span>
                <button
                  onClick={() => setReplyingTo({ senderName: msg.sender.name, text: msg.text || 'Photo' })}
                  className="opacity-0 group-hover:opacity-100 hover:text-[#F2F2F2] text-[9px] uppercase tracking-widest font-black transition-opacity cursor-pointer"
                >
                  REPLY
                </button>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2.5 mt-2 ml-11">
            <div className="flex gap-1.5 bg-[#141414] px-3 py-2 rounded-full items-center border border-[#262626] shadow-sm">
              <div className="w-1.5 h-1.5 bg-[#F2F2F2] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-1.5 h-1.5 bg-[#F2F2F2] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
              <div className="w-1.5 h-1.5 bg-[#F2F2F2] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
            <span className="text-[11px] text-[#777777] font-mono">CHLOE IS TYPING...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Reply Banner */}
      {replyingTo && (
        <div className="fixed bottom-[140px] left-0 right-0 max-w-2xl mx-auto px-4 z-40">
          <div className="bg-[#141414] border border-[#262626] rounded-t-xl px-4 py-2.5 flex items-center justify-between text-xs text-[#F2F2F2] shadow-lg">
            <span className="truncate font-mono text-[11px]">
              Replying to <b className="text-[#F2F2F2] font-black uppercase">{replyingTo.senderName}</b>: "{replyingTo.text}"
            </span>
            <button onClick={() => setReplyingTo(null)} className="p-1 text-[#888888] hover:text-[#F2F2F2] cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="fixed bottom-20 left-0 right-0 z-40 px-4 py-2 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent pointer-events-none">
        <form
          onSubmit={handleSend}
          className="bg-[#121212] rounded-full flex items-center p-1.5 max-w-2xl mx-auto pointer-events-auto shadow-2xl border border-[#262626]"
        >
          <button
            type="button"
            onClick={() => {
              const sampleUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsXPWjo8M_jJgn881gWHCmUgauRApULiQgMRgFpKT3Alh55oOeSk9LtIrvLrZfA1uQP4PN7zqvgTRGdYi8bBbY9rID50oB1RqUlwDOPFtvkM5TKFjIBKsGq5WrssV1cd7XMkUgFMG_dP2mvp2JeHo6yBRG86LTM6P27BdtiudjmKjVupB1GkEwTcJXRMIwjpU2jsT1uPvM8w6UPqw4tV2GEZ49xN_EjkukZAVWXq01_4EHEzL_RNY';
              const photoMsg: ChatMessage = {
                id: `m-${Date.now()}`,
                sender: currentUser,
                isUser: true,
                imageUrl: sampleUrl,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'read',
              };
              onSendMessage(photoMsg);
            }}
            className="p-2 text-[#888888] hover:text-[#F2F2F2] transition-colors flex-shrink-0 cursor-pointer"
            title="Attach Media Preview"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm text-[#F2F2F2] placeholder:text-[#666666] focus:ring-0 focus:outline-none px-3 py-2 font-sans"
            placeholder="Type your message to Design Squad..."
          />

          <button
            type="button"
            onClick={() => setInputText((prev) => prev + ' ⚡🔥')}
            className="p-2 text-[#888888] hover:text-[#F2F2F2] transition-colors flex-shrink-0 cursor-pointer"
            title="Emoji"
          >
            <span className="material-symbols-outlined text-[20px]">mood</span>
          </button>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-[#F2F2F2] text-[#050505] w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 hover:scale-105 active:scale-95 transition-all ml-1 disabled:opacity-30 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>
      </div>

      {/* Video Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-[95] bg-[#050505]/90 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] w-full max-w-md rounded-2xl p-6 border border-[#262626] shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#333333] mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[#F2F2F2] text-3xl">videocam</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#777777]">HUDDLE INITIATED</span>
              <h3 className="font-black text-xl text-[#F2F2F2] uppercase tracking-tight mt-1">SQUAD AUDIO & VIDEO</h3>
              <p className="text-xs text-[#888888] mt-1">Connecting 4 members to encrypted room...</p>
            </div>
            <div className="flex justify-center gap-3">
              <img className="w-12 h-12 rounded-full border border-[#444444] object-cover" src={allUsers.alex.avatar} alt="Alex" />
              <img className="w-12 h-12 rounded-full border border-[#444444] object-cover" src={allUsers.chloe.avatar} alt="Chloe" />
              <img className="w-12 h-12 rounded-full border border-[#444444] object-cover" src={allUsers.leo.avatar} alt="Leo" />
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setShowCallModal(false)}
                className="px-6 py-2.5 rounded-full bg-[#1a1a1a] text-[#888888] border border-[#262626] font-black text-[11px] uppercase tracking-widest hover:text-white transition-colors cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  alert('Audio and Video stream connected!');
                  setShowCallModal(false);
                }}
                className="px-6 py-2.5 rounded-full bg-[#F2F2F2] text-[#050505] font-black text-[11px] uppercase tracking-widest hover:bg-white transition-colors cursor-pointer"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
