# GCC App — Generated Media Manifest

Generated via Higgsfield. Local files in `media/generated/`. Source prompts: `../generating_images.md`.

| File | Asset | Where it's used | Model | Ratio |
|------|-------|-----------------|-------|-------|
| `05-service-ecommerce.png` | Service: E-Commerce | Services section / `/services/e-commerce` | GPT Image 2 | 1:1 |
| `06-service-branding.png` | Service: Branding | Services section / `/services/branding` | GPT Image 2 | 1:1 |
| `07-service-digital-marketing.png` | Service: Digital Marketing | Services section / `/services/digital-marketing` | GPT Image 2 | 1:1 |
| `08-service-seo.png` | Service: SEO | Services section / `/services/seo` | GPT Image 2 | 1:1 |
| `09-about-lifestyle.png` | About / "Why us" lifestyle | About page hero / Home "why us" | Soul 2.0 | 16:9 |
| `10-portfolio-ecommerce.png` | Portfolio: E-Commerce | Portfolio grid cover | Nano Banana 2 | 16:9 |
| `11-portfolio-branding.png` | Portfolio: Branding | Portfolio grid cover | Nano Banana 2 | 16:9 |
| `12-portfolio-mobile-ios.png` | Portfolio: Mobile / iOS | Portfolio grid cover | Nano Banana 2 | 16:9 |
| `13-portfolio-dashboard-crm.png` | Portfolio: Dashboard / CRM | Portfolio grid cover | Nano Banana 2 | 16:9 |
| `14-portfolio-cloud-infra.png` | Portfolio: Cloud / infra | Portfolio grid cover | Nano Banana 2 | 16:9 |
| `15-og-share-card.png` | OG / social share card | `metadata.openGraph` (center reserved for logo overlay) | GPT Image 2 | 16:9 |

## Videos (`media/video/`)
| File | Use |
|------|-----|
| `hero-background-loop.mp4` | Home hero background (muted, autoplay, playsInline, poster) |
| `services-ambient-loop.mp4` | Services section ambient background |
| `mobile-app-showcase.mp4` | Mobile App service / portfolio showcase |

## SVGs (`media/svg/`)
| File | Use |
|------|-----|
| `service-mobile-app.svg` | Service: Mobile App Development (IMAGE 3) |
| `service-web-design.svg` | Service: Web Design & Development (IMAGE 4) |
| `section-bg-soft-alt.svg` | Soft section background, alt |
| `background.svg` | General section background |

## Not generated
- **IMAGE 16 — Team headshots (Soul ID):** skipped. Marked optional in the brief ("only if not using real photos") and requires training one Soul ID per person from real reference photos. Provide per-person photos to generate these.

## Notes
- All images are 2k, photorealistic, cyan/white on soft daylight, no text/logos baked in.
- Result URLs are CloudFront links (recorded in `results.tsv`); local PNGs are the source of truth.
