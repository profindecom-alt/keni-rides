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

## Gallery & heroes (`public/gallery/`) — 16:9 or wider for heroes

| File | Used for |
|---|---|
| `hero.jpg` | Home page full-screen hero (most important image on the site) |
| `fleet-hero.jpg` | Motorcycles page hero |
| `gallery-hero.jpg` | Gallery page hero |
| `testimonials-hero.jpg` | Testimonials page hero |
| `about-hero.jpg` | About page hero |
| `faq-hero.jpg` | FAQ page hero |
| `conditions-hero.jpg` | Rental conditions page hero |
| `contact-hero.jpg` | Contact page hero |
| `cta.jpg` | Background of the orange call-to-action bands |
| `sahara.jpg` | Sahara destination card |
| `atlas.jpg` | Atlas destination card |
| `mediterranean.jpg` | Mediterranean destination card |
| `atlantic.jpg` | Atlantic destination card |
| `gallery-01.jpg` … `gallery-12.jpg` | Gallery grid (01, 03/06/08 shown large — pick your best) |

## Testimonial videos (`public/testimonials/`) — MP4 (H.264), 16:9

| File | Used for |
|---|---|
| `testimonial-1.mp4` | Video story #1 |
| `testimonial-2.mp4` | Video story #2 |
| `testimonial-3.mp4` | Video story #3 |

## Connecting the forms (n8n)

Edit `js/config.js` and replace the two placeholder URLs with your real n8n
webhook URLs (`booking` and `contact`). Forms POST JSON like:

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
  "page": "https://keni-rides.com/motorcycle.html?bike=bmw-gs1200-adventure",
  "submittedAt": "2026-07-04T12:00:00.000Z"
}
```

No data is stored locally — every submission goes straight to n8n.
In n8n, set the Webhook node's **Response** to a 2xx status and enable CORS
(allow origin `https://keni-rides.com`) so browser submissions succeed.
