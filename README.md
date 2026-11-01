# StudioSpace

A peer-to-peer marketplace where creators find and book photo studios, sound stages, podcast rooms, music suites and art workshops by the hour, and studio owners earn from their empty hours.

**Live site:** https://studiospace-talha.vercel.app

**Server repository:** https://github.com/talhabinsaleh/studiospace-server

## Examiner test credentials

| Role | Email | Password |
| --- | --- | --- |
| Creator (has bookings for every status) | `creator@studiospace.demo` | `Reel-Creator-4827` |
| Host (has listings and booking requests) | `host@studiospace.demo` | `Reel-Host-6193` |

## Features

- **Discover studios:** search by name, area or amenity, and filter by category
- **Live availability:** the booking window marks confirmed hours and shows the full price with deposit
- **Double-booking prevention:** the server rejects any time that overlaps a confirmed booking, with a clear message
- **Host dashboard:** hosts confirm, decline and complete booking requests
- **Secure sessions:** BetterAuth with email and Google login, plus a JWT in an HTTPOnly cookie that protects server changes
- **Studio management:** add, update and delete listings, with imgbb image upload and a confirmation before deleting
- **Light and dark themes:** the whole site switches, and your choice is remembered
- **PDF invoices and saved studios:** download a receipt for confirmed bookings, and save favourites with the heart icon

## Tech stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS 4, DaisyUI 5, Swiper, Sonner, jsPDF
- **Authentication:** BetterAuth, MongoDB adapter, JWT (jose)
- **Backend:** Express 5, MongoDB, TypeScript

## Local setup

Start [the server](https://github.com/talhabinsaleh/studiospace-server) first, then:

```bash
git clone https://github.com/talhabinsaleh/studiospace-client.git
cd studiospace-client
npm install
cp .env.example .env.local   # fill in the values
npm run dev                  # http://localhost:3000
```

`JWT_SECRET` must be the same value on the client and the server. Google login needs `http://localhost:3000/api/auth/callback/google` added as a redirect URI in Google Cloud.

## How the login cookie works

After BetterAuth confirms a session, `/api/session-token` signs a JWT and stores it in an HTTPOnly cookie. Browser requests to `/api/*` pass through a Next.js rewrite to Express, so the cookie stays first-party and is not blocked as a third-party cookie.

## Photo credits

Studio photos come from Wikimedia Commons, used under the licenses listed here and resized for the web.

- `softbox-loft.jpg`: Katie Chan, CC BY-SA 3.0, [source](https://commons.wikimedia.org/wiki/File:PhotoSEL_LS21E52_Softbox_Studio_Lighting_Kit_(2).jpg)
- `timber-portrait.jpg`: Macchrissli, CC BY-SA 4.0, [source](https://commons.wikimedia.org/wiki/File:Scheinwerfer_mit_softbox.jpg)
- `tabletop-lab.jpg`: Klaus Ohlenschläger, CC BY-SA 4.0, [source](https://commons.wikimedia.org/wiki/File:Professionelle_Produktfotografie_im_Fotostudio.jpg)
- `gear-ring.jpg`: Dmitry Makeev, CC BY-SA 4.0, [source](https://commons.wikimedia.org/wiki/File:Softbox_flash_bowens.jpg)
- `vintage-camera.jpg`: Ansgar Koreng from Leipzig, Germany, CC BY-SA 2.0, [source](https://commons.wikimedia.org/wiki/File:Voigtl%C3%A4nder_Vitomatic_IIa_(Top)_-_Flickr_-_ako_law.jpg)
- `empty-stage.jpg`: Dennis G. Jarvis, CC BY-SA 2.0, [source](https://commons.wikimedia.org/wiki/File:NS-01455_-_Huge_Room_(Sound_Stage)_(51445072321).jpg)
- `broadcast-camera.jpg`: Achim Raschka (talk), CC BY-SA 3.0, [source](https://commons.wikimedia.org/wiki/File:13-06-07_RaR_Fujinon_film_camera.jpg)
- `green-screen.jpg`: HeatherSignal, CC BY-SA 4.0, [source](https://commons.wikimedia.org/wiki/File:BTS_studio.jpg)
- `stage-door.jpg`: Dennis G. Jarvis, CC BY-SA 2.0, [source](https://commons.wikimedia.org/wiki/File:NS-01457_-_Entrance_to_Sound_Stage_(51444308367).jpg)
- `field-camera.jpg`: Nirvana Studios - Custom Circus, CC BY 4.0, [source](https://commons.wikimedia.org/wiki/File:Camera_crew_setting_everything_up.jpg)
- `round-table.jpg`: Myotus, CC BY 4.0, [source](https://commons.wikimedia.org/wiki/File:Microphones_in_SPNN_Podcast_studio.jpg)
- `solo-mic.jpg`: Myotus, CC BY 4.0, [source](https://commons.wikimedia.org/wiki/File:Microphone_in_SPNN_Podcast_studio.jpg)
- `panel-room.jpg`: Myotus, CC BY 4.0, [source](https://commons.wikimedia.org/wiki/File:SPNN_Podcast_room.jpg)
- `desk-mic.jpg`: Infrogmation, CC BY-SA 4.0, [source](https://commons.wikimedia.org/wiki/File:WWOZ_radio_studios_in_Jackson_Brewery,_May_2025_-_microphones.jpg)
- `desk-mixer.jpg`: Tim Wilson, CC BY 2.0, [source](https://commons.wikimedia.org/wiki/File:The_Podcave_home_studio_update_(179160280).jpg)
- `long-desk.jpg`: Ajcosta, CC BY-SA 4.0, [source](https://commons.wikimedia.org/wiki/File:Podcast_Studio.jpg)
- `control-suite.jpg`: Dayron Villaverde from Miami, USA, CC0, [source](https://commons.wikimedia.org/wiki/File:Recording_studio_console_for_DAW_work_(2016-03-23_15.01.29_by_DayronV_@pixabay_1290087).jpg)
- `drum-room.jpg`: Shixart1985, CC BY 2.0, [source](https://commons.wikimedia.org/wiki/File:Drum_set_in_a_music_studio_with_wooden_walls.jpg)
- `piano-room.jpg`: Will Fisher from Richmond, VA, United States, CC BY-SA 2.0, [source](https://commons.wikimedia.org/wiki/File:Keyboards_-_Rhodes_piano,_Leslie_speaker_with_microphone,_Hammond_C3,_Grand_piano_with_microphones_-_Studio_A,_In_Your_Ear_Studios.jpg)
- `big-console.jpg`: Rebecca Wilson, CC BY 2.0, [source](https://commons.wikimedia.org/wiki/File:SSL_SL9000J_(72ch)_@_The_Cutting_Room_Recording_Studios,_NYC.jpg)
- `keys-corner.jpg`: Dejan Krsmanovic, CC BY 2.0, [source](https://commons.wikimedia.org/wiki/File:Small_Bedroom_Recording_Studio_(46148886084).jpg)
- `stone-live-room.jpg`: Forward Studios, CC BY-SA 4.0, [source](https://commons.wikimedia.org/wiki/File:27356430_Live_Room.jpg)
- `clay-wheel.jpg`: Rayhan Ahmed, CC BY-SA 4.0, [source](https://commons.wikimedia.org/wiki/File:7.The_Rhythm_of_Clay_Echoes_of_an_Ancient_Craft.jpg)
- `hand-shaping.jpg`: Lodz Design, CC BY 2.0, [source](https://commons.wikimedia.org/wiki/File:Japanese_wheel_pottery_workshop_02.jpg)
- `green-pots.jpg`: Rayhan Ahmed, CC BY-SA 4.0, [source](https://commons.wikimedia.org/wiki/File:3.The_Rhythm_of_Clay_Echoes_of_an_Ancient_Craft.jpg)
