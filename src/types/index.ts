export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  watchHistory?: string[];
  createdAt: string;
  updatedAt: string;
  subscribersCount?: number;
  channelsSubscribedToCount?: number;
  isSubscribed?: boolean;
}

export interface Video {
  _id: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner: User;
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean;
  totalLikeCount?: number;
}

export interface Comment {
  _id: string;
  content: string;
  video: string;
  owner: User;
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  _id: string;
  title: string;
  description: string;
  video: any[];
  owner: User;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
