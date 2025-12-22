import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

// Category images
const categoryImages = [
  { url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80', name: 'electronics.jpg' },
  { url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80', name: 'clothing.jpg' },
  { url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80', name: 'home-living.jpg' },
  { url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', name: 'sports-fitness.jpg' },
  { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80', name: 'beauty.jpg' },
  { url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80', name: 'books-media.jpg' },
];

// Product images
const productImages = [
  // Wireless Headphones
  { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', name: 'headphones-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80', name: 'headphones-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80', name: 'headphones-3.jpg' },
  { url: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&q=80', name: 'headphones-4.jpg' },

  // Smart Watch
  { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', name: 'smartwatch-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80', name: 'smartwatch-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80', name: 'smartwatch-3.jpg' },

  // T-Shirt
  { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', name: 'tshirt-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80', name: 'tshirt-2.jpg' },

  // Desk Lamp
  { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80', name: 'lamp-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80', name: 'lamp-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1534105615926-77c8e2f83bb6?w=800&q=80', name: 'lamp-3.jpg' },

  // Yoga Mat
  { url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80', name: 'yoga-mat-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', name: 'yoga-mat-2.jpg' },

  // Face Serum
  { url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80', name: 'serum-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80', name: 'serum-2.jpg' },

  // Book
  { url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80', name: 'book-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80', name: 'book-2.jpg' },

  // Webcam
  { url: 'https://images.unsplash.com/photo-1589739900243-c842288fe025?w=800&q=80', name: 'webcam-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80', name: 'webcam-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&q=80', name: 'webcam-3.jpg' },
];

// Support/branding images (placeholders for now)
const supportImages = [
  { url: 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=1200&q=80', name: 'hero-banner.jpg' },
  { url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80', name: 'about-us.jpg' },
  { url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80', name: 'contact-banner.jpg' },
  { url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80', name: 'logo-placeholder.jpg' },
];

function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded: ${path.basename(filepath)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      console.error(`✗ Failed: ${path.basename(filepath)} - ${err.message}`);
      reject(err);
    });
  });
}

async function downloadAllImages() {
  console.log('📥 Downloading category images...');
  for (const img of categoryImages) {
    const filepath = path.join(process.cwd(), 'public', 'images', 'categories', img.name);
    await downloadImage(img.url, filepath);
  }

  console.log('\n📥 Downloading product images...');
  for (const img of productImages) {
    const filepath = path.join(process.cwd(), 'public', 'images', 'products', img.name);
    await downloadImage(img.url, filepath);
  }

  console.log('\n📥 Downloading support images...');
  for (const img of supportImages) {
    const filepath = path.join(process.cwd(), 'public', 'images', 'support', img.name);
    await downloadImage(img.url, filepath);
  }

  console.log('\n✅ All images downloaded successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Update your seed.sql to use local image paths');
  console.log('2. Replace Unsplash URLs with /images/... paths');
  console.log('3. Run your database seed script');
}

downloadAllImages().catch(console.error);
