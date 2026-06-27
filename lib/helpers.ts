export type DbSubmission = {
  id: number;
  created_at: string;
  name: string;
  city: string;
  score: number;
  message: string;
  lat: number | null;
  lng: number | null;
  tempc: number | null;
  tiktoklink?: string | null;
};

export type FeedEntry = {
  id: string;
  name: string;
  flag: string;
  city: string;
  score: number;
  message: string;
  time: string;
  initial: string;
  lat?: number;
  lng?: number;
  tempC?: number;
  tiktokLink?: string;
  source?: "user" | "ambient";
};

export function toFeedEntry(db: DbSubmission): FeedEntry {
  const ago = db.created_at
    ? (() => {
        const s = Math.floor((Date.now() - new Date(db.created_at).getTime()) / 1000);
        if (s < 10) return "Just now";
        if (s < 60) return `${s}s ago`;
        const m = Math.floor(s / 60);
        if (m < 60) return `${m}m ago`;
        return `${Math.floor(m / 60)}h ago`;
      })()
    : "Just now";

  return {
    id: String(db.id),
    name: db.name,
    flag: "📍",
    city: db.city,
    score: db.score,
    message: db.message,
    time: ago,
    initial: db.name.charAt(0).toUpperCase(),
    lat: db.lat ?? undefined,
    lng: db.lng ?? undefined,
    tempC: db.tempc ?? undefined,
    tiktokLink: db.tiktoklink ?? undefined,
  };
}
