import React, { useState } from 'react';
import { ScreenType, Post, GalleryItem, ChatMessage } from './types';
import { 
  initialPosts, 
  galleryHighlights, 
  galleryItems, 
  initialChatMessages,
  currentUser 
} from './data/mockData';
import { TopScreenSwitcher, BottomNavBar } from './components/Navigation';
import { CreateModal } from './components/CreateModal';

// Screens
import { LandingScreen } from './components/screens/LandingScreen';
import { GroupFeedScreen } from './components/screens/GroupFeedScreen';
import { GalleryScreen } from './components/screens/GalleryScreen';
import { GroupChatScreen } from './components/screens/GroupChatScreen';
import { GroupSettingsScreen } from './components/screens/GroupSettingsScreen';
import { MembersScreen } from './components/screens/MembersScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { ProfileSetupScreen } from './components/screens/ProfileSetupScreen';
import { OnboardingSuccessScreen } from './components/screens/OnboardingSuccessScreen';
import { AuthScreen } from './components/screens/AuthScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // App-wide interactive states
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryItem[]>(galleryItems);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);

  // Handlers for interactive actions
  const handleAddPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleAddGalleryItem = (newItem: GalleryItem) => {
    setGalleryPhotos([newItem, ...galleryPhotos]);
  };

  const handleToggleGalleryLike = (itemId: string) => {
    setGalleryPhotos((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const isLiked = !item.isLiked;
          return {
            ...item,
            isLiked,
            likes: isLiked ? item.likes + 1 : item.likes - 1,
          };
        }
        return item;
      })
    );
  };

  const handleVotePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.poll) {
          const previousVote = p.poll.userVotedId;
          const isRemovingVote = previousVote === optionId;

          const updatedOptions = p.poll.options.map((opt) => {
            if (opt.id === optionId) {
              return { ...opt, votes: isRemovingVote ? Math.max(0, opt.votes - 1) : opt.votes + 1 };
            }
            if (opt.id === previousVote) {
              return { ...opt, votes: Math.max(0, opt.votes - 1) };
            }
            return opt;
          });

          const totalVotes = updatedOptions.reduce((acc, curr) => acc + curr.votes, 0);

          return {
            ...p,
            poll: {
              ...p.poll,
              userVotedId: isRemovingVote ? undefined : optionId,
              totalVotes,
              options: updatedOptions,
            },
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author: currentUser,
            content: text,
            timeAgo: 'Just now',
          };
          const existing = p.commentsList || [];
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            commentsList: [...existing, newComment],
          };
        }
        return p;
      })
    );
  };

  const handleToggleReaction = (postId: string, emoji: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const reactions = p.reactions ? [...p.reactions] : [];
          const existingIndex = reactions.findIndex((r) => r.emoji === emoji);

          if (existingIndex > -1) {
            const current = reactions[existingIndex];
            if (current.active) {
              reactions[existingIndex] = {
                ...current,
                count: Math.max(0, current.count - 1),
                active: false,
              };
            } else {
              reactions[existingIndex] = {
                ...current,
                count: current.count + 1,
                active: true,
              };
            }
          } else {
            reactions.push({ emoji, count: 1, active: true });
          }

          return {
            ...p,
            reactions: reactions.filter((r) => r.count > 0 || r.active),
          };
        }
        return p;
      })
    );
  };

  const handleSendMessage = (msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-body selection:bg-primary-container selection:text-white">
      {/* Top Screen Selector for seamless switching between all 10 prototype designs */}
      <TopScreenSwitcher currentScreen={currentScreen} onNavigate={setCurrentScreen} />

      {/* Screen Render Canvas */}
      <div className="flex-1 w-full">
        {currentScreen === 'landing' && (
          <LandingScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'feed' && (
          <GroupFeedScreen
            posts={posts}
            onAddPost={handleAddPost}
            onVotePoll={handleVotePoll}
            onAddComment={handleAddComment}
            onToggleReaction={handleToggleReaction}
            onNavigate={setCurrentScreen}
            onOpenCreate={() => setIsCreateModalOpen(true)}
          />
        )}

        {currentScreen === 'gallery' && (
          <GalleryScreen
            highlights={galleryHighlights}
            galleryItems={galleryPhotos}
            onToggleLike={handleToggleGalleryLike}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'chat' && (
          <GroupChatScreen
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'settings' && (
          <GroupSettingsScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'members' && (
          <MembersScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'profile-setup' && (
          <ProfileSetupScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'onboarding-success' && (
          <OnboardingSuccessScreen
            onNavigate={setCurrentScreen}
            onOpenCreate={() => setIsCreateModalOpen(true)}
          />
        )}

        {currentScreen === 'auth' && (
          <AuthScreen onNavigate={setCurrentScreen} />
        )}
      </div>

      {/* Bottom Floating Navigation for Mobile / Tablet */}
      <BottomNavBar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onOpenCreate={() => setIsCreateModalOpen(true)}
      />

      {/* Versatile Creation Modal */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAddPost={handleAddPost}
        onAddGalleryItem={handleAddGalleryItem}
      />
    </div>
  );
}
