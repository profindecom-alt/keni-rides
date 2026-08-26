# Keni Rides — Asset Guide

Drop the real photos/videos into the `public/` folder using the exact filenames
below. The site picks them up automatically — until then, a branded dark
placeholder is shown, so nothing ever looks broken.

**Recommended format:** JPG (or WebP renamed to .jpg works in all modern
browsers only if served with correct type — prefer real JPG), sRGB,
quality ~80. Landscape ~1600×1200 for bikes, ~1920×1080+ for heroes.

## Branding

| File | Used for |
|---|---|
| `public/logo.png` | Navbar, footer, favicon (transparent PNG, ~200×80) |
| `public/founder.jpg` | About page + home founder section (portrait, 4:5) |

## Motorcycles (`public/bikes/`) — 4:3 landscape, one per bike

| File | Motorcycle |
|---|---|
| `bmw-gs1200-adventure.jpg` | BMW GS 1200 Adventure |
| `yamaha-tenere-700.jpg` | Yamaha Ténéré 700 |
| `yamaha-tenere-700-world-raid.jpg` | Yamaha Ténéré 700 World Raid |
| `suzuki-dr650.jpg` | Suzuki DR650 |
| `yamaha-xt660r.jpg` | Yamaha XT660R |
| `yamaha-xtz660-tenere.jpg` | Yamaha XTZ660 Ténéré |
| `bmw-f800gs-adventure.jpg` | BMW F800GS Adventure |
| `suzuki-dr200.jpg` | Suzuki DR200 |
| `honda-crf250.jpg` | Honda CRF250 |
| `honda-transalp-700.jpg` | Honda Transalp 700 |
| `suzuki-dr400.jpg` | Suzuki DR400 |

## Gallery & heroes (`public/gallery/`, `public/destinations/`)

Filenames are descriptive and keyword-bearing, not camera names — Google Image
search is this site's largest source of impressions, and the filename is one of
the few signals it has about an image's subject. Use lowercase, hyphenated,
French (the default locale), ending in the subject and place:

    moto-dunes-sahara-maroc.jpg
    cote-mediterranee-moto-maroc.webp
    groupe-moto-point-de-vue-montagne-maroc.jpg

**Size them before committing.** Source files are capped at 2400px on the long
edge, quality ~82. The originals were 6000px camera exports and the folder was
327 MB; it is now ~16 MB for the same visible quality. next/image generates
every smaller width from these, so anything above 2400px is bytes nobody reads.

**Renaming an existing photo needs a redirect.** Old image URLs are indexed, so
add a `{ source, destination }` pair to LEGACY_REDIRECTS in `next.config.ts`
rather than letting the old path 404.

Alt text lives in the message files, never in the component:
- Gallery grid — `galleryPage.images` in `messages/<locale>.json`, matched
  **by index** to `GALLERY_SRCS` in `lib/gallery.ts`.
- City itinerary photos — `common.photoAlt.<filename-without-extension>`.
- Bikes — `common.bikeImageAlt` / `bikeAngleAlt`, interpolated with the name.

## Testimonial videos

Embedded directly from YouTube (click-to-play facade, see `components/YouTubeEmbed.tsx`) — no local files needed. Video IDs are set in `app/[locale]/testimonials/page.tsx`. To add or swap a video, just update the `videoId` prop with the YouTube video ID (the part after `youtu.be/` or `v=`).

## Connecting the forms (n8n)

Copy `.env.example` to `.env.local` and set the two webhook URLs
(`NEXT_PUBLIC_BOOKING_WEBHOOK_URL` and `NEXT_PUBLIC_CONTACT_WEBHOOK_URL`),
or edit the fallback values in `lib/config.ts`. Restart `next dev` after
changing `.env.local`. Forms POST JSON like:

```json
{
  "type": "booking",
  "motorcycle": "BMW GS 1200 Adventure",
  "motorcycleSlug": "bmw-gs1200-adventure",
  "pricePerDayEUR": "150",
  "fullName": "…", "email": "…", "phone": "…", "country": "…",
  "pickupLocation": "Marrakech", "returnLocation": "Marrakech",
  "pickupDate": "2026-08-01", "returnDate": "2026-08-05",
  "riders": "2", "message": "…",
  "page": "https://keni-rides.com/motorcycles/bmw-gs1200-adventure",
  "submittedAt": "2026-07-04T12:00:00.000Z"
}
```

No data is stored locally — every submission goes straight to n8n from the
browser. In n8n, set the Webhook node's **Response** to a 2xx status and
enable CORS (allow origin `https://keni-rides.com`) so browser submissions
succeed.
