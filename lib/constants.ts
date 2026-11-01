import { Camera, Clapperboard, Mic, Music, Palette, type LucideIcon } from "lucide-react";

export const CATEGORIES: { value: string; label: string; icon: LucideIcon; blurb: string; image: string }[] = [
  {
    value: "Photo Studio",
    label: "Photo Studios",
    icon: Camera,
    blurb: "Softboxes, tabletops and portrait rooms",
    image: "/photos/softbox-loft.jpg",
  },
  {
    value: "Film Stage",
    label: "Sound Stages",
    icon: Clapperboard,
    blurb: "Green screens and full crew floors",
    image: "/photos/green-screen.jpg",
  },
  {
    value: "Podcast Lounge",
    label: "Podcast Rooms",
    icon: Mic,
    blurb: "Round tables and quiet solo booths",
    image: "/photos/round-table.jpg",
  },
  {
    value: "Music Suite",
    label: "Music Suites",
    icon: Music,
    blurb: "Control desks, drums and grand pianos",
    image: "/photos/control-suite.jpg",
  },
  {
    value: "Workshop",
    label: "Art Workshops",
    icon: Palette,
    blurb: "Clay, wheels and hand-shaping benches",
    image: "/photos/clay-wheel.jpg",
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
