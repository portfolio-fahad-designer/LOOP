import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { sound } from '../utils/sound';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, membersList, showToast } = useApp();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [speakingMember, setSpeakingMember] = useState<string>('Alex');
  const [activeCameraStream, setActiveCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    sound.playJoinCall();

    // Try to request real webcam if available
    let stream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          setActiveCameraStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          setCameraError(true);
        });
    }

    // Active speaker simulator
    const interval = setInterval(() => {
      const names = ['Alex', 'Chloe', 'Leo', 'Mia', currentUser.name];
      const randomSpeaker = names[Math.floor(Math.random() * names.length)];
      setSpeakingMember(randomSpeaker);
    }, 2800);

    return () => {
      clearInterval(interval);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, currentUser.name]);

  if (!isOpen) return null;

  const handleEndCall = () => {
    if (activeCameraStream) {
      activeCameraStream.getTracks().forEach((t) => t.stop());
    }
    sound.playPop();
    showToast('Squad session disconnected', 'info');
    onClose();
  };

  const handleToggleMic = () => {
    setIsMuted(!isMuted);
    sound.playPop();
    showToast(!isMuted ? 'Microphone muted' : 'Microphone unmuted', 'info');
  };

  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    sound.playPop();
    showToast(!isVideoOff ? 'Camera paused' : 'Camera live', 'info');
  };

  const handleToggleShare = () => {
    setIsScreenSharing(!isScreenSharing);
    sound.playPop();
    showToast(!isScreenSharing ? 'Broadcasting display screen' : 'Screen broadcast ended');
  };

  const callMembers = membersList.slice(0, 4);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Top Status Bar */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66] animate-pulse"></span>
          <div>
            <h3 className="font-black text-sm text-[#F2F2F2] uppercase tracking-wider">
              DESIGN SQUAD // SPATIAL VOX
            </h3>
            <p className="text-[10px] text-[#888888] font-mono">
              ENCRYPTED STEREO STREAM • {callMembers.length} CONNECTED
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#121212] border border-[#262626] px-3 py-1.5 rounded-full">
          <span className="material-symbols-outlined text-[15px] text-[#00FF66]">graphic_eq</span>
          <span className="text-[10px] font-mono text-[#CCCCCC]">
            ACTIVE: <strong className="text-white uppercase">{speakingMember}</strong>
          </span>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl w-full mx-auto my-auto flex-1 max-h-[70vh] py-4">
        {/* Current User Tile */}
        <div className={`relative rounded-2xl overflow-hidden border bg-[#0d0d0d] flex items-center justify-center transition-all ${
          speakingMember === currentUser.name ? 'border-white shadow-[0_0_24px_rgba(255,255,255,0.2)]' : 'border-[#262626]'
        }`}>
          {activeCameraStream && !isVideoOff && !cameraError ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover mirror"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-center p-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#444444] shadow-lg relative">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                {isMuted && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-xl">mic_off</span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-black text-xs text-white uppercase">{currentUser.name} (You)</p>
                <span className="text-[10px] text-[#777777] font-mono">
                  {isVideoOff ? 'CAMERA OFF' : 'AUDIO MESH'}
                </span>
              </div>
            </div>
          )}

          {/* User Tag Overlay */}
          <div className="absolute bottom-3 left-3 bg-[#0a0a0a]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#262626] flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-white tracking-wider">YOU</span>
            {isMuted && <span className="material-symbols-outlined text-[13px] text-[#ff5555]">mic_off</span>}
          </div>
        </div>

        {/* Remote Members */}
        {callMembers.filter(m => m.id !== currentUser.id).slice(0, 3).map((member) => {
          const isSpeaking = speakingMember.toLowerCase().includes(member.name.toLowerCase());
          return (
            <div
              key={member.id}
              className={`relative rounded-2xl overflow-hidden border bg-[#0d0d0d] flex items-center justify-center transition-all ${
                isSpeaking ? 'border-[#F2F2F2] shadow-[0_0_24px_rgba(255,255,255,0.2)]' : 'border-[#262626]'
              }`}
            >
              <div className="flex flex-col items-center gap-3 text-center p-4">
                <div className={`w-20 h-20 rounded-full overflow-hidden border-2 transition-transform duration-300 ${
                  isSpeaking ? 'scale-105 border-white' : 'border-[#333333]'
                }`}>
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-black text-xs text-white uppercase">{member.name}</p>
                  <span className={`text-[10px] font-mono ${isSpeaking ? 'text-[#00FF66]' : 'text-[#777777]'}`}>
                    {isSpeaking ? 'SPEAKING • 98 kbps' : 'CONNECTED'}
                  </span>
                </div>
              </div>

              {/* Dynamic waveform visualizer bar */}
              {isSpeaking && (
                <div className="absolute top-3 right-3 flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-white rounded-full animate-bounce"></span>
                  <span className="w-1 h-5 bg-white rounded-full animate-bounce delay-75"></span>
                  <span className="w-1 h-2 bg-white rounded-full animate-bounce delay-150"></span>
                </div>
              )}

              <div className="absolute bottom-3 left-3 bg-[#0a0a0a]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#262626]">
                <span className="text-[10px] font-black uppercase text-white tracking-wider">{member.name}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Controls Dock */}
      <div className="flex items-center justify-center gap-3 z-10 py-2">
        <button
          onClick={handleToggleMic}
          className={`p-4 rounded-full border transition-all cursor-pointer ${
            isMuted
              ? 'bg-[#331111] border-[#ff4444] text-[#ff8888]'
              : 'bg-[#141414] border-[#333333] text-white hover:bg-[#222222]'
          }`}
          title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
        >
          <span className="material-symbols-outlined text-[22px]">{isMuted ? 'mic_off' : 'mic'}</span>
        </button>

        <button
          onClick={handleToggleVideo}
          className={`p-4 rounded-full border transition-all cursor-pointer ${
            isVideoOff
              ? 'bg-[#331111] border-[#ff4444] text-[#ff8888]'
              : 'bg-[#141414] border-[#333333] text-white hover:bg-[#222222]'
          }`}
          title={isVideoOff ? 'Start Camera' : 'Pause Camera'}
        >
          <span className="material-symbols-outlined text-[22px]">{isVideoOff ? 'videocam_off' : 'videocam'}</span>
        </button>

        <button
          onClick={handleToggleShare}
          className={`p-4 rounded-full border transition-all cursor-pointer ${
            isScreenSharing
              ? 'bg-white text-black border-white'
              : 'bg-[#141414] border-[#333333] text-white hover:bg-[#222222]'
          }`}
          title="Share Screen"
        >
          <span className="material-symbols-outlined text-[22px]">screen_share</span>
        </button>

        <button
          onClick={handleEndCall}
          className="px-6 py-4 rounded-full bg-[#ff3333] hover:bg-[#ff4444] text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_0_24px_rgba(255,51,51,0.4)] active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">call_end</span>
          <span>DISCONNECT</span>
        </button>
      </div>
    </div>
  );
};
