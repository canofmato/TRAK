// 테이블 구조를 바탕으로 한 타입 정의
export interface Trip {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  start_date: string | null;
  end_date: string | null;
  cover_image_url: string | null;
  color: string | null;
  hashtags: string[] | null;
  created_at: string;
}

export interface PhotoFolder {
  id: string;
  trip_id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  created_at: string;
}

export interface Photo {
  id: string;
  folder_id: string;
  user_id: string;
  image_url: string;
  description: string | null;
  display: boolean;
  display_order: number;
  created_at: string;
}