import React, { useState, useRef, useEffect } from 'react';
import { ScreenType } from '../../types';
import { useApp } from '../../context/AppContext';
import { VideoCallModal } from '../VideoCallModal';
import { sound } from '../../utils/sound';

interface GroupChatScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const GroupChatScreen: React.FC<GroupChatScreenProps> = ({ onNavigate }) => {
  const {
    currentUser,
    currentSquad,
    chatMessages,
    sendMessage,
    showToast,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string>('');
  const [replyingTo, setReplyingTo] = useState<{ senderName: string; text: string } | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const voiceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAttachedImage(reader.result);
          showToast('Image ready to send');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachedImage) return;

    sendMessage(
      inputText.trim(),
      attachedImage || undefined,
      replyingTo ? replyingTo : undefined
    );

    setInputText('');
    setAttachedImage('');
    setReplyingTo(null);
  };

  const startVoiceRecording = () => {
    setIsRecordingVoice(true);
    setVoiceSeconds(0);
    sound.playPop();
    voiceTimerRef.current = setInterval(() => {
      setVoiceSeconds((sec) => sec + 1);
    }, 1000);
  };

  const finishVoiceRecording = () => {
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    setIsRecordingVoice(false);
    sound.playSend();
    sendMessage(`🎤 Voice Note (${voiceSeconds}s)`);
    showToast('Voice memo transmitted');
  };

  const cancelVoiceRecording = () => {
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    setIsRecordingVoice(false);
    setVoiceSeconds(0);
    sound.playPop();
  };

  const quickPrompts = [
    'Hey team! ⚡',
    'Figma tokens updated ✨',
    'Let’s hop on a sync 📞',
    'Soundcheck in 10 mins 🎛️',
  ];

  return (
    <div className="bg-[#050505] text-[#F2F2F2] min-h-screen flex flex-col pb-20">
      {/* Top Chat Action Bar (below global navbar) */}
      <header className="bg-[#080808]/95 backdrop-blur-lg fixed top-16 left-0 w-full z-30 border-b border-[#262626] h-14 flex items-center shadow-lg">
        <div className="flex justify-between items-center px-4 w-full max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src={currentSquad.avatar}
                  alt={currentSquad.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#333333]"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#00FF66] border-2 border-[#050505] rounded-full"></span>
              </div>
              <div>
                <h1 className="font-black text-xs text-[#F2F2F2] uppercase tracking-tight">
                  {currentSquad.name} // VOX ENCRYPTED
                </h1>
                <p className="text-[9px] text-[#777777] font-mono">
                  {currentSquad.memberCount} OPERATORS ONLINE
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVideoCallOpen(true)}
              className="px-3 py-1.5 rounded-full bg-[#161616] hover:bg-[#222222] border border-[#333333] text-white flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[16px] text-[#00FF66]">videocam</span>
              <span className="hidden sm:inline">Join Call</span>
            </button>
            <button
              onClick={() => onNavigate('members')}
              className="p-1.5 text-[#999999] hover:text-[#F2F2F2] rounded-full cursor-pointer"
              title="Members"
            >
              <span className="material-symbols-outlined text-[18px]">group</span>
            </button>
          </div>
        </div>
      </header>

      {/* Messages Canvas */}
      <main className="flex-1 pt-36 pb-28 px-4 max-w-3xl w-full mx-auto flex flex-col gap-4 overflow-y-auto">
        {/* Encrypted Channel Notice */}
        <div className="flex flex-col items-center justify-center my-2 text-center">
          <div className="inline-flex items-center gap-1.5 bg-[#0e0e0e] border border-[#222222] px-3 py-1 rounded-full text-[10px] font-mono text-[#777777]">
            <span className="material-symbols-outlined text-[13px] text-[#00FF66]">lock</span>
            <span>END-TO-END ENCRYPTED CIRCLE VAULT</span>
          </div>
        </div>

        {/* Message bubbles */}
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'} group`}
          >
            {/* Sender Name if not user */}
            {!msg.isUser && (
              <div className="flex items-center gap-2 mb-1 px-1">
                <img
                  src={msg.sender.avatar}
                  alt={msg.sender.name}
                  className="w-4 h-4 rounded-full object-cover border border-[#333]"
                />
                <span className="text-[10px] font-black uppercase text-[#888888] tracking-wider">
                  {msg.sender.name}
                </span>
                <span className="text-[9px] font-mono text-[#555555]">{msg.time}</span>
              </div>
            )}

            {/* Replying banner if present */}
            {msg.replyTo && (
              <div className={`text-[10px] font-mono px-3 py-1 mb-1 rounded-lg border max-w-sm ${
                msg.isUser
                  ? 'bg-[#181818] border-[#333333] text-[#AAAAAA] text-right'
                  : 'bg-[#141414] border-[#262626] text-[#888888]'
              }`}>
                Replying to <strong>{msg.replyTo.senderName}</strong>: {msg.replyTo.text}
              </div>
            )}

            {/* Bubble */}
            <div
              className={`relative max-w-md rounded-2xl p-3.5 sm:p-4 text-xs font-sans leading-relaxed shadow-lg ${
                msg.isUser
                  ? 'bg-[#F2F2F2] text-[#050505] font-medium rounded-tr-none'
                  : 'bg-[#121212] text-[#E0E0E0] border border-[#262626] rounded-tl-none'
              }`}
            >
              {/* Optional image in message */}
              {msg.imageUrl && (
                <div 
                  onClick={() => setLightboxImage(msg.imageUrl!)}
                  className="rounded-xl overflow-hidden mb-2 border border-black/10 cursor-pointer"
                >
                  <img src={msg.imageUrl} alt="Attached visual" className="w-full h-auto max-h-56 object-cover" />
                </div>
              )}

              {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}

              {/* Timestamp & status */}
              <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] font-mono ${
                msg.isUser ? 'text-black/50' : 'text-[#666666]'
              }`}>
                <span>{msg.time}</span>
                {msg.isUser && (
                  <span className="material-symbols-outlined text-[13px] text-black">
                    done_all
                  </span>
                )}
              </div>
            </div>

            {/* Action Bar on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 mt-1 px-1">
              <button
                onClick={() => setReplyingTo({ senderName: msg.sender.name, text: msg.text || 'Image' })}
                className="text-[10px] font-mono text-[#777777] hover:text-white flex items-center gap-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[13px]">reply</span> Reply
              </button>
              <button
                onClick={() => sendMessage(`🔥 to "${msg.text?.slice(0, 20) || 'message'}..."`)}
                className="text-[10px] text-[#777777] hover:text-white cursor-pointer"
              >
                🔥
              </button>
              <button
                onClick={() => sendMessage(`⚡ to "${msg.text?.slice(0, 20) || 'message'}..."`)}
                className="text-[10px] text-[#777777] hover:text-white cursor-pointer"
              >
                ⚡
              </button>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Hidden File Picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Bottom Fixed Input Dock */}
      <footer className="fixed bottom-0 left-0 w-full bg-[#050505]/95 backdrop-blur-xl border-t border-[#262626] p-3 z-40">
        <div className="max-w-3xl mx-auto space-y-2">
          {/* Quick Prompts */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-[#141414] hover:bg-[#202020] border border-[#2a2a2a] text-[#AAAAAA] hover:text-white shrink-0 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Replying banner */}
          {replyingTo && (
            <div className="flex items-center justify-between bg-[#141414] border border-[#333333] px-3 py-1.5 rounded-xl text-xs text-[#CCCCCC]">
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-sm text-[#AAAAAA]">reply</span>
                <span className="font-mono text-[10px] text-[#888888]">Replying to {replyingTo.senderName}:</span>
                <span className="truncate max-w-xs">{replyingTo.text}</span>
              </div>
              <button onClick={() => setReplyingTo(null)} className="text-[#888888] hover:text-white">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          {/* Attached image preview */}
          {attachedImage && (
            <div className="relative inline-block border border-[#333333] rounded-xl overflow-hidden">
              <img src={attachedImage} alt="Attachment" className="h-16 w-24 object-cover" />
              <button
                onClick={() => setAttachedImage('')}
                className="absolute top-1 right-1 p-0.5 bg-black/70 rounded-full text-white hover:bg-black"
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            </div>
          )}

          {/* Input Bar */}
          {isRecordingVoice ? (
            <div className="flex items-center justify-between bg-[#1f0a0a] border border-[#ff4444] rounded-full px-4 py-2.5 animate-pulse">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#ff3333] animate-ping"></span>
                <span className="font-mono text-xs text-[#ffaaaa] uppercase font-black tracking-widest">
                  RECORDING VOX MEMO • 00:0{voiceSeconds}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={cancelVoiceRecording}
                  className="px-3 py-1 text-xs text-[#ff8888] hover:text-white font-mono uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={finishVoiceRecording}
                  className="px-4 py-1 bg-[#ff4444] text-white text-xs font-black uppercase tracking-wider rounded-full hover:bg-[#ff5555] cursor-pointer"
                >
                  Transmit
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-[#888888] hover:text-white rounded-full bg-[#121212] hover:bg-[#1c1c1c] border border-[#262626] transition-colors cursor-pointer"
                title="Attach photo"
              >
                <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
              </button>

              <button
                type="button"
                onClick={startVoiceRecording}
                className="p-2.5 text-[#888888] hover:text-white rounded-full bg-[#121212] hover:bg-[#1c1c1c] border border-[#262626] transition-colors cursor-pointer"
                title="Record Voice Memo"
              >
                <span className="material-symbols-outlined text-[18px]">mic</span>
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Broadcast a message to squad..."
                className="flex-1 bg-[#121212] border border-[#262626] rounded-full px-4 py-2.5 text-xs text-[#F2F2F2] placeholder:text-[#555555] focus:outline-none focus:border-[#666666] font-sans"
              />

              <button
                type="submit"
                disabled={!inputText.trim() && !attachedImage}
                className="p-2.5 rounded-full bg-[#F2F2F2] text-[#050505] hover:bg-white disabled:opacity-30 active:scale-95 transition-all shadow-[0_0_12px_rgba(255,255,255,0.2)] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
          )}
        </div>
      </footer>

      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
      />

      {/* Lightbox for chat images */}
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
    </div>
  );
};
