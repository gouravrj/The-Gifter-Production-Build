import Category from '../models/Category.js';
import Product from '../models/Product.js';

const categories = [
  { name: 'Candles', slug: 'candles', subcategories: [] },
  { name: 'Resin Works', slug: 'resin-works', subcategories: ['Rakhi', 'Vermala Preservation', 'Key Rings', 'Action Figures', 'Flower Preservation', 'Jewellery'].map((name) => ({ name, slug: name.toLowerCase().replaceAll(' ', '-') })) },
  { name: 'Pipe Cleaner', slug: 'pipe-cleaner', subcategories: ['Bouquets', 'Table Buddies', 'Key Rings'].map((name) => ({ name, slug: name.toLowerCase().replaceAll(' ', '-') })) },
  { name: 'Accessories', slug: 'accessories', subcategories: ['Hair Accessories', 'Clutches', 'Earrings', 'Necklace', 'Hair Bows'].map((name) => ({ name, slug: name.toLowerCase().replaceAll(' ', '-') })) }
];
const placeholder = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#ead6ce"/><stop offset="1" stop-color="#d8c2aa"/></linearGradient></defs><rect width="900" height="900" fill="url(#g)"/><circle cx="450" cy="410" r="185" fill="none" stroke="#a96248" stroke-width="32"/><circle cx="450" cy="410" r="70" fill="#fbf8f3" stroke="#a96248" stroke-width="20"/><path d="M265 410H75M635 410h190" stroke="#a96248" stroke-width="25" stroke-linecap="round"/><text x="450" y="720" text-anchor="middle" font-family="Georgia" font-size="52" fill="#2f2925">Resin Rakhi</text><text x="450" y="775" text-anchor="middle" font-family="Arial" font-size="25" fill="#2f2925">Sample image — replace from admin</text></svg>')}`;

export async function seedCatalog() {
  for (const category of categories) await Category.findOneAndUpdate({ slug: category.slug }, category, { upsert: true, setDefaultsOnInsert: true });
  await Product.findOneAndUpdate({ slug: 'handcrafted-resin-rakhi' }, {
    $setOnInsert: { name: 'Handcrafted Resin Rakhi', slug: 'handcrafted-resin-rakhi', description: 'A keepsake resin rakhi, thoughtfully handcrafted and ready to personalize for someone special.', price: 1000, category: 'Resin Works', subcategory: 'Rakhi', images: [{ url: placeholder }], stock: 25, featured: true, active: true }
  }, { upsert: true, setDefaultsOnInsert: true });
}
export async function getCategories(_req, res) { res.json({ success: true, categories: await Category.find().sort({ name: 1 }) }); }
