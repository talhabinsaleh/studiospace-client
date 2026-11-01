import { Camera, Clapperboard, Mic, Music, Palette, type LucideIcon } from "lucide-react";

export const CATEGORIES: { value: string; label: string; icon: LucideIcon; blurb: string; image: string }[] = [
  {
    value: "Photo Studio",
    label: "Photo Studios",
    icon: Camera,
    blurb: "Cyc walls, strobes and tabletop rigs",
    image: "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800&q=70&auto=format&fit=crop",
  },
  {
    value: "Film Stage",
    label: "Sound Stages",
    icon: Clapperboard,
    blurb: "Treated stages with lighting grids",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=70&auto=format&fit=crop",
  },
  {
    value: "Podcast Lounge",
    label: "Podcast Rooms",
    icon: Mic,
    blurb: "Mics and cameras already framed",
    image: "https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=800&q=70&auto=format&fit=crop",
  },
  {
    value: "Music Suite",
    label: "Music Suites",
    icon: Music,
    blurb: "Control rooms and live rooms",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=70&auto=format&fit=crop",
  },
  {
    value: "Workshop",
    label: "Art Workshops",
    icon: Palette,
    blurb: "Ateliers, presses and pottery wheels",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=70&auto=format&fit=crop",
  },
];

export const AMENITIES = [
  "Wi-Fi",
  "Air conditioning",
  "Parking",
  "Soundproofing",
  "Natural light",
  "Changing room",
  "Lighting grid",
  "Green screen",
  "Studio monitors",
  "Refreshments",
];

export const FALLBACK_IMAGE =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><rect width="400" height="260" fill="#26211c"/><circle cx="200" cy="130" r="46" fill="none" stroke="#6b6158" stroke-width="6"/><circle cx="200" cy="130" r="14" fill="#6b6158"/></svg>',
  );
