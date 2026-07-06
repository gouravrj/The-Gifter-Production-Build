import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { errorMessage } from '../services/api';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { ProductSkeleton } from '../components/Loading';

export default function Shop() {
  const [params,setParams]=useSearchParams(); const [products,setProducts]=useState([]); const [categories,setCategories]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState('');
  const category=params.get('category')||'', subcategory=params.get('subcategory')||'', search=params.get('search')||'';
  useEffect(()=>{api.get('/categories').then(r=>setCategories(r.data.categories));},[]);
  useEffect(()=>{setLoading(true);setError('');api.get('/products',{params:{category,subcategory,search,limit:50}}).then(r=>setProducts(r.data.products)).catch(e=>setError(errorMessage(e))).finally(()=>setLoading(false));},[category,subcategory,search]);
  const selected=categories.find(c=>c.name===category); const update=(key,value)=>{const next=new URLSearchParams(params);value?next.set(key,value):next.delete(key);if(key==='category')next.delete('subcategory');setParams(next)};
  return <section className="container-page py-12"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-widest text-clay">Our collection</p><h1 className="mt-2 text-5xl">Small wonders, handmade.</h1></div><div className="mt-10 grid gap-4 rounded-2xl bg-white p-4 md:grid-cols-[1fr_220px_220px]"><input value={search} onChange={e=>update('search',e.target.value)} placeholder="Search crafts…"/><select value={category} onChange={e=>update('category',e.target.value)}><option value="">All categories</option>{categories.map(c=><option key={c._id}>{c.name}</option>)}</select><select value={subcategory} onChange={e=>update('subcategory',e.target.value)} disabled={!selected?.subcategories.length}><option value="">All subcategories</option>{selected?.subcategories.map(s=><option key={s.slug}>{s.name}</option>)}</select></div>{error&&<div className="mt-8 rounded-xl bg-red-50 p-4 text-red-700">{error}</div>}<div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{loading?Array.from({length:8},(_,i)=><ProductSkeleton key={i}/>):products.map(p=><ProductCard key={p._id} product={p}/>)}</div>{!loading&&!products.length&&<div className="mt-10"><EmptyState title="No crafts found" text="Try a different search or clear your filters." action={<button onClick={()=>setParams({})} className="btn-secondary">Clear filters</button>}/></div>}</section>;
}
