import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
const fallback = 'https://placehold.co/800x800/ead6ce/2f2925?text=Handmade';
export default function ProductCard({ product }) {
  const { user } = useAuth(); const { add } = useCart();
  return <article className="group"><Link to={`/products/${product.slug}`} className="block overflow-hidden rounded-2xl bg-blush"><img src={product.images?.[0]?.url || fallback} alt={product.name} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy"/></Link><div className="mt-4 flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-widest text-clay">{product.category}</p><Link to={`/products/${product.slug}`}><h3 className="mt-1 text-xl leading-tight">{product.name}</h3></Link><p className="mt-1 font-semibold">₹{product.price.toLocaleString('en-IN')}</p></div><button aria-label="Add to cart" title={user ? 'Add to cart' : 'Login to purchase'} onClick={() => user ? add(product._id) : location.assign('/login')} className="rounded-full border border-sand p-3 transition hover:bg-ink hover:text-white"><ShoppingBag size={19}/></button></div></article>;
}
