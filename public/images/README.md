# Image Assets

This directory contains all the locally hosted images for the SuberCraftex e-commerce platform.

## Directory Structure

```
public/images/
├── categories/          # Category images (6 images)
│   ├── electronics.jpg
│   ├── clothing.jpg
│   ├── home-living.jpg
│   ├── sports-fitness.jpg
│   ├── beauty.jpg
│   └── books-media.jpg
│
├── products/           # Product images (21 images)
│   ├── headphones-1.jpg
│   ├── headphones-2.jpg
│   ├── headphones-3.jpg
│   ├── headphones-4.jpg
│   ├── smartwatch-1.jpg
│   ├── smartwatch-2.jpg
│   ├── smartwatch-3.jpg
│   ├── tshirt-1.jpg
│   ├── tshirt-2.jpg
│   ├── lamp-1.jpg
│   ├── lamp-2.jpg
│   ├── lamp-3.jpg
│   ├── yoga-mat-1.jpg
│   ├── yoga-mat-2.jpg
│   ├── serum-1.jpg
│   ├── serum-2.jpg
│   ├── book-1.jpg
│   ├── book-2.jpg
│   ├── webcam-1.jpg
│   ├── webcam-2.jpg
│   └── webcam-3.jpg
│
└── support/           # Support/branding images (4 images)
    ├── hero-banner.jpg
    ├── about-us.jpg
    ├── contact-banner.jpg
    └── logo-placeholder.jpg
```

## Image Sources

All images were downloaded from Unsplash and are stored locally for:
- **Faster loading** - No external CDN dependencies
- **Reliability** - Images always available
- **Control** - Easy to replace or customize

## Usage

### In Database Seed
The `supabase/seed.sql` file references these images using local paths:
```sql
'/images/categories/electronics.jpg'
'/images/products/headphones-1.jpg'
```

### In Next.js Components
Use Next.js Image component for optimized loading:
```tsx
import Image from 'next/image';

<Image
  src="/images/products/headphones-1.jpg"
  alt="Wireless Headphones"
  width={800}
  height={800}
/>
```

## Replacing Images

To replace an image:
1. Save the new image with the same filename in the appropriate directory
2. Ensure the image dimensions are adequate (recommended: 800x800px minimum for products)
3. Optimize the image for web (compress to reduce file size)
4. The database references will automatically use the new image

## Adding New Product Images

When adding new products:
1. Save product images to `public/images/products/`
2. Use descriptive filenames (e.g., `product-name-1.jpg`, `product-name-2.jpg`)
3. Update your database insert with the new image paths
4. Consider creating multiple product images (1-4 images per product)

## Support Images

The `support/` directory contains:
- **hero-banner.jpg** - Homepage hero section background
- **about-us.jpg** - About page banner
- **contact-banner.jpg** - Contact page banner
- **logo-placeholder.jpg** - Temporary logo (replace with your brand logo)

## Image Optimization

For production, consider:
- Running images through an optimizer (TinyPNG, ImageOptim, etc.)
- Using WebP format for better compression
- Implementing responsive images for different screen sizes
- Using Next.js Image Optimization (automatic with next/image component)

## License

Images sourced from Unsplash are free to use under the Unsplash License.
Replace with your own images or properly licensed stock photos for production use.
