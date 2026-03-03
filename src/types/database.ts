export interface Collection {
  id: string;
  user_id: string;
  name: string;
  is_public: boolean;
  share_slug: string | null;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  collection_id: string | null;
  url: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  site_name: string | null;
  is_read: boolean;
  created_at: string;
}
