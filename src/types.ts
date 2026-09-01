export type ScreenType = 
  | 'landing'
  | 'feed'
  | 'gallery'
  | 'chat'
  | 'members'
  | 'settings'
  | 'profile'
  | 'profile-setup'
  | 'onboarding-success'
  | 'auth';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  role?: 'owner' | 'admin' | 'member';
  isOnline?: boolean;
  isMuted?: boolean;
  verified?: boolean;
  groupsCount?: number;
  postsCount?: number;
  likesCount?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollData {
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedId?: string;
  endsIn: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timeAgo: string;
  likes: number;
}

export interface Post {
  id: string;
  author: User;
  groupName?: string;
  timeAgo: string;
  content: string;
  imageUrl?: string;
  reactions?: { emoji: string; count: number; active?: boolean }[];
  commentsCount: number;
  commentsList?: Comment[];
  sharesCount?: number;
  poll?: PollData;
  isLiked?: boolean;
  likesCount?: number;
}

export interface GalleryHighlight {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  imageUrl: string;
}

export interface GalleryItem {
  id: string;
  title?: string;
  imageUrl: string;
  authorAvatar: string;
  authorName?: string;
  likes: number;
  comments?: number;
  isLiked?: boolean;
  category: 'All' | 'Events' | 'Workshops' | 'Vibes';
  aspect: 'tall' | 'short' | 'wide';
}

export interface ChatMessage {
  id: string;
  sender: User;
  isUser: boolean;
  text?: string;
  time: string;
  imageUrl?: string;
  replyTo?: {
    senderName: string;
    text: string;
  };
  status?: 'sent' | 'delivered' | 'read';
}

export interface Circle {
  id: string;
  name: string;
  imageUrl: string;
  borderColor: string;
}

export interface Story {
  id: string;
  user: User;
  imageUrl: string;
  caption?: string;
  timestamp: string;
  seen?: boolean;
}

export interface Squad {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  avatar: string;
  coverImage?: string;
  inviteCode: string;
  privacy: 'invite-only' | 'members-approval' | 'open';
  memberCount: number;
  tags: string[];
  themeColor?: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'error';
}

