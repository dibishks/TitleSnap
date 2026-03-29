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
