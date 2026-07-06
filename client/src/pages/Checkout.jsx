import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const {user}=useAuth(); const {cart,refresh}=useCart(); const nav=useNavigate(); const [busy,setBusy]=useState(false); const [form,setForm]=useState({name:user.fullName,email:user.email,phone:user.phone||'',address:user.address||'',codAccepted:true});
  if(!cart.items.length)return <Navigate to="/cart" replace/>;
  const submit=async e=>{e.preventDefault();setBusy(true);try{const {data}=await api.post('/orders',form);await refresh();toast.success('Order placed successfully');nav(`/account?order=${data.order._id}`);}catch(err){toast.error(errorMessage(err));}finally{setBusy(false)}};
  return <section className="container-page py-12"><h1 className="text-5xl">Checkout</h1><form onSubmit={submit} className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_380px]"><div className="card grid gap-5 p-6 sm:p-8"><h2 className="text-2xl">Delivery details</h2>{[['name','Name','text'],['email','Email','email'],['phone','Phone number','tel']].map(([key,label,type])=><div key={key}><label className="label">{label}</label><input type={type} required value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/></div>)}<div><label className="label">Delivery address</label><textarea rows="4" required value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></div></div><aside className="card p-6"><h2 className="text-2xl">Payment</h2><label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border-2 border-sage bg-sage/5 p-4"><input className="mt-1 h-4 w-4 accent-sage" type="checkbox" checked={form.codAccepted} onChange={e=>setForm({...form,codAccepted:e.target.checked})}/><span><strong className="flex items-center gap-2"><CheckCircle2 size={18}/> Cash on Delivery</strong><small className="mt-1 block text-ink/55">Pay when your handmade order arrives.</small></span></label><div className="mt-6 flex justify-between text-xl font-bold"><span>Total</span><span>₹{cart.total.toLocaleString('en-IN')}</span></div><button disabled={busy||!form.codAccepted} className="btn-primary mt-6 w-full">{busy?'Placing order…':'Place COD order'}</button></aside></form></section>;
}
