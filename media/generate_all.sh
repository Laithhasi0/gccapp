#!/bin/bash
export PATH="/opt/homebrew/bin:$PATH"
cd ~/gccapp/media/generated
RESULTS=~/gccapp/media/results.tsv
> "$RESULTS"

gen() {
  local key="$1"; local model="$2"; local ratio="$3"; local resflag="$4"; local prompt="$5"
  local url
  url=$(higgsfield generate create "$model" --prompt "$prompt" --aspect_ratio "$ratio" $resflag --wait --json 2>/dev/null | jq -r '.[0].result_url // "FAILED"')
  printf '%s\t%s\n' "$key" "$url" >> "$RESULTS"
  echo "DONE $key -> $url"
}

# Services 6-8 (gpt_image_2, 1:1)
gen "06-service-branding" gpt_image_2 1:1 "--resolution 2k" "A clean flat-lay on a bright white surface in soft daylight: blank business cards, a folded sheet, and a small swatch card in white, light grey and cyan tones, arranged with generous spacing. Matte surfaces, soft natural shadows, minimal and modern. Comfortable branding mockup photography, photorealistic, high detail, 4k. Tack sharp, no printed text, no real logos, no clutter." &
gen "07-service-digital-marketing" gpt_image_2 1:1 "--resolution 2k" "A clean minimal workspace still-life in soft daylight: a laptop showing simple cyan-accented analytics charts, a notebook and a cup of coffee on a bright white desk. White and off-white palette with calm cyan highlights, matte surfaces, soft shadows, shallow depth of field, airy space. Modern comfortable product photography, photorealistic, high detail, 4k. Tack sharp, no text, no logos, no clutter." &
gen "08-service-seo" gpt_image_2 1:1 "--resolution 2k" "A clean minimal still-life: a laptop on a bright white desk in soft daylight showing a simple, calm search-results style layout with cyan accents, beside a small plant and a notebook. White and off-white palette with calm cyan highlights, matte surfaces, gentle shadow, shallow depth of field, spacious. Modern comfortable product photography, photorealistic, high detail, 4k. Tack sharp, no text, no logos, no clutter." &

# About lifestyle (Soul 2.0, 16:9)
gen "09-about-lifestyle" text2image_soul_v2 16:9 "--quality 2k" "A bright modern tech office in soft daylight: a small team collaborating, slightly out of focus, around a clean white table with laptops near large windows, a few cyan accent details. White and soft off-white palette with calm cyan highlights, matte surfaces, soft shadows, shallow depth of field, comfortable and human. Modern lifestyle photography, friendly and professional, photorealistic, high detail, 4k. Natural and authentic, no text, no logos, no clutter." &

# Portfolio covers (Nano Banana 2, 16:9)
gen "10-portfolio-ecommerce" nano_banana_2 16:9 "--resolution 2k" "A laptop on a bright white desk in soft daylight showing a clean, elegant online-store layout with cyan accents, a neat parcel beside it. White and off-white palette with calm cyan highlights, matte surfaces, soft shadows, shallow depth of field, spacious. Modern comfortable product photography, photorealistic, high detail, 4k. Tack sharp, no text, no logos, no clutter." &
gen "11-portfolio-branding" nano_banana_2 16:9 "--resolution 2k" "A clean branding flat-lay on a bright white surface in soft daylight: blank business cards, a folded brochure, and a cyan-and-grey swatch, with generous negative space. Matte surfaces, soft shadows, minimal and modern. Comfortable mockup photography, photorealistic, high detail, 4k. Tack sharp, no printed text, no real logos, no clutter." &
gen "12-portfolio-mobile-ios" nano_banana_2 16:9 "--resolution 2k" "A modern smartphone on a bright white surface in soft daylight, screen showing a clean minimal app interface with cyan accents, a notebook beside it. White and off-white palette with calm cyan highlights, matte surfaces, gentle shadow, shallow depth of field, airy space. Modern comfortable product photography, photorealistic, high detail, 4k. Tack sharp, no harsh reflections, no text, no logos, no clutter." &
gen "13-portfolio-dashboard-crm" nano_banana_2 16:9 "--resolution 2k" "A large monitor on a clean white desk in soft daylight showing a simple, calm dashboard with cyan-accented charts and cards, a keyboard and a cup of coffee nearby. White and off-white palette with calm cyan highlights, matte surfaces, soft shadows, shallow depth of field, spacious. Modern comfortable product photography, photorealistic, high detail, 4k. Tack sharp, no text, no logos, no clutter." &
gen "14-portfolio-cloud-infra" nano_banana_2 16:9 "--resolution 2k" "A clean minimal still-life suggesting cloud technology: a laptop and a small abstract matte light-grey sculptural form with a subtle cyan accent on a bright white surface in soft daylight, calm and conceptual. White and off-white palette with cyan highlights, matte finish, gentle shadows, airy empty space. Modern comfortable photography, photorealistic, high detail, 4k. Tack sharp, no text, no logos, no clutter." &

# OG share card (gpt_image_2, 16:9)
gen "15-og-share-card" gpt_image_2 16:9 "--resolution 2k" "A minimal, bright composition for a social share card: a clean white background with a soft pale-cyan gradient and a single tasteful object, a small device with a cyan accent, to one side, with generous empty space in the center reserved for a logo. Comfortable, modern, professional, photorealistic, high detail. Clean and uncluttered, no text, no logos, no busy center." &

wait
echo "ALL DONE"
