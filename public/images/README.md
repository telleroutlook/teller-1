# SEO Image Specifications

This directory contains SEO-related images for the website. Please prepare images according to the following specifications:

## Open Graph Image (og-image.png)
- **Dimensions**: 1200 × 630 pixels
- **Format**: PNG or JPG
- **Purpose**: Preview image for Facebook, LinkedIn and other social media sharing
- **Design Requirements**: 
  - Include website name "Teller"
  - Include subtitle or brief description
  - Use brand colors (#3b82f6)
  - Ensure text remains readable at small sizes

## Twitter Card Image (twitter-card.png)
- **Dimensions**: 1200 × 600 pixels
- **Format**: PNG or JPG
- **Purpose**: Preview image for Twitter sharing
- **Design Requirements**: 
  - Maintain consistent design style with Open Graph image
  - Can be a cropped version of og-image.png

## App Screenshots (for PWA)
### Mobile Screenshot (screenshot-mobile.png)
- **Dimensions**: 390 × 844 pixels (iPhone 12/13/14 standard size)
- **Format**: PNG
- **Purpose**: Preview image for PWA installation
- **Content**: Mobile interface screenshot of the main app

### Desktop Screenshot (screenshot-desktop.png)
- **Dimensions**: 1920 × 1080 pixels
- **Format**: PNG
- **Purpose**: Preview image for PWA installation
- **Content**: Desktop interface screenshot of the main app

## Additional Icon Files
The following files should be designed based on the main icon:

### Files to Add (place in /public root directory)
- `mstile-70x70.png` - 70×70px, Windows small tile
- `mstile-150x150.png` - 150×150px, Windows medium tile
- `mstile-310x150.png` - 310×150px, Windows wide tile
- `mstile-310x310.png` - 310×310px, Windows large tile
- `safari-pinned-tab.svg` - SVG format monochrome icon for Safari pinned tabs

### Existing Files (in /public/favicon directory)
- `favicon-16x16.png` ✅ Exists
- `favicon-32x32.png` ✅ Exists
- `apple-touch-icon.png` ✅ Exists (should be 180×180px)
- `android-chrome-192x192.png` ✅ Exists
- `android-chrome-512x512.png` ✅ Exists

## Design Guidelines
1. All icons should use consistent design style
2. Primary color: #3b82f6 (blue)
3. Background can use #0f172a (dark) or white
4. Ensure icons are clear and recognizable at all sizes
5. For square icons, recommend appropriate padding in design

## Recommended Tools
- [Favicon Generator](https://realfavicongenerator.net/) - One-stop icon generation
- [Open Graph Image Generator](https://www.bannerbear.com/tools/open-graph-image-generator/) - OG image generation
- [Canva](https://canva.com) - Online design tool 