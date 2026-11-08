# Brigitte — Le trou, c’est vous.

A 24-second French motion graphic rendered by HyperFrames, in 1920×1080 and 1080×1920 at 30 fps. Cream, charcoal and red tokens follow the public Brigitte site. No voice, music, paid API or private client material.

## Reproduce (Linux / GitHub Actions)

Install Node 22, FFmpeg and fonts-liberation; run `npm ci`, `node scripts/page.mjs`, and `npm run build`. Render each generated composition using the workflow in `.github/workflows/render.yml`. Browser execution is CI-only for this project.

The workflow fails on render errors, incorrect dimensions/duration/frame count, undecodable video, page errors, horizontal overflow or a delivery folder over 40 MiB. Artifacts include two MP4s, three landscape stills, portrait/ending review stills, phone/desktop page screenshots and a machine-readable verification report.

## Public sources and editorial limits

- https://brigittebox.com/comprendre-ia/ (retrieved 9 November 2026): verbatim labels, dates and displayed rounded numbers, with their qualifications. It cites OpenAI announcements of 21 January 2025 and 31 March 2026, and Anthropic's SEC Form S-1/A of 2 November 2026.
- https://brigittebox.com/technologie/, https://brigittebox.com/sur-mesure/, https://brigittebox.com/demo/ and homepage: product wording for six storyboards. Unverified product journeys are labelled **Prévu**. Public text is not treated as a shipped-feature test.
- Public `monday-launch/site/base.css` and `home.css`: #f5f3ed, #20211f, #bb2c2c; Arial/Helvetica-style typography. CI uses Liberation Sans, an open metric-compatible substitute (SIL Open Font License), installed from Ubuntu's fonts-liberation package. No proprietary font is redistributed in source.

Investment intentions, multi-year commitments and revenue measured over different periods are **not** a deficit. Both charts share the same 0–895 billion USD scale. No subtraction or company-replacement claim is made. Links to original sources and limits appear on the review page.

Source contains only animation, public-facing storyboard copy, the review page and CI code. No internal status reports, investor files, credentials or client documents.
