/**
 * Movie Detail Types
 */

export interface MovieVariant {
  language: string;
  format: string;
}

export interface VideoData {
  url: string;
  thumbnail: string;
  type: string;
}

export interface TitleSnap {
  id: string;
  movieId: string;
  userId: string;
  image: string;
  imageKey: string;
  thumbnailUrl: string;
  status: string;
  uploadOn: string;
  updatedAt: string;
  userName?: string;
  userPicture?: string;
}

export interface MovieSnapsPagination {
  page: number;
  limit: number;
  total: number;
  has_more: boolean;
}

export interface MovieSnapsResponse {
  status: boolean;
  data?: {
    movie: {
      movie_id: string;
      name: string;
      image: string;
    };
    snaps: Array<{
      id: string;
      movie_id: string;
      user_id: string;
      image_url: string;
      image_key: string;
      thumbnail_url: string;
      status: string;
      user?: {
        id: string;
        google_sub: string;
        name: string;
        email: string;
        picture: string;
        email_verified: boolean;
        created_at: string;
        updated_at: string;
        last_login_at: string;
      };
      created_at: string;
      updated_at: string;
    }>;
    pagination: MovieSnapsPagination;
  };
}

export interface UploadedSnapMovie {
  movie_id: string;
  name: string;
  genres: string[];
  image: string;
  movie_variants: MovieVariant[];
  censor: string;
  release_date: string;
  format_id: string;
  video_data?: VideoData;
  spotlight_thumbnail_url?: string;
  spotlight_video_url?: string;
  premium_tags?: string[];
  reason_to_watch?: string;
  story_thumbnail_url?: string;
  description?: string;
  reminder_count?: number;
}

export interface UserUploadedSnap {
  id: string;
  movie_id: string;
  user_id: string;
  image_url: string;
  image_key: string;
  thumbnail_url: string;
  status: string;
  created_at: string;
  updated_at: string;
  movie: UploadedSnapMovie;
}

export interface MyUploadsResponse {
  status: boolean;
  data?: {
    user: {
      id: string;
      google_sub: string;
      email: string;
      name: string;
    };
    snaps: UserUploadedSnap[];
    pagination: MovieSnapsPagination;
  };
}

export interface MovieDetail {
  id: string;
  image: string;
  name: string;
  description: string;
  censor: string;
  genres: string[];
  movieVariants: MovieVariant[];
  reasonToWatch: string;
  releaseDate: string;
  reminderCount: number;
  premiumTags: string[];
  videoData: VideoData | null;
}

export interface MovieDetailResponse {
  _id: string;
  movie_id: string;
  image: string;
  name: string;
  description?: string;
  censor?: string;
  genres?: string[];
  movie_variants?: MovieVariant[];
  reason_to_watch?: string;
  release_date?: string;
  reminder_count?: number;
  premium_tags?: string[];
  video_data?: VideoData;
}
