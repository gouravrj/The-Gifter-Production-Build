import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

function AuthShell({ title, subtitle, children }) { return <section className="container-page grid min-h-[70vh] place-items-center py-12"><div className="card w-full max-w-lg p-7 sm:p-10"><p className="text-sm font-bold uppercase tracking-widest text-clay">The Gifter</p><h1 className="mt-2 text-4xl">{title}</h1><p className="mt-2 text-ink/60">{subtitle}</p><div className="mt-7">{children}</div></div></section>; }
export function Login() {
  const {user,saveSession}=useAuth(); const nav=useNavigate(); const loc=useLocation(); const [form,setForm]=useState({email:'',password:''}); const [busy,setBusy]=useState(false);
  if(user)return <Navigate to={user.role==='admin'?'/admin/dashboard':'/account'} replace/>;
  const submit=async e=>{e.preventDefault();setBusy(true);try{const {data}=await api.post('/auth/login',form);saveSession(data);toast.success('Welcome back');nav(loc.state?.from?.pathname||'/account');}catch(err){toast.error(errorMessage(err));}finally{setBusy(false)}};
  return <AuthShell title="Welcome back" subtitle="Sign in to view orders, quotes, and saved details."><form onSubmit={submit} className="grid gap-4"><div><label className="label">Email</label><input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div><div><label className="label">Password</label><input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div><button disabled={busy} className="btn-primary mt-2">{busy?'Signing in…':'Sign in'}</button><p className="text-center text-sm">New here? <Link className="font-semibold text-clay" to="/signup">Create an account</Link></p></form></AuthShell>;
}
export function Signup() {
  const nav=useNavigate(); const [form,setForm]=useState({fullName:'',email:'',password:'',address:''}); const [busy,setBusy]=useState(false);
  const submit=async e=>{e.preventDefault();setBusy(true);try{await api.post('/auth/signup',form);toast.success('OTP sent to your email');nav('/verify-email',{state:{email:form.email}});}catch(err){toast.error(errorMessage(err));}finally{setBusy(false)}};
  return <AuthShell title="Create your account" subtitle="A quick email verification keeps your account secure."><form onSubmit={submit} className="grid gap-4">{[['fullName','Full name','text'],['email','Email','email'],['password','Password (8+ characters)','password']].map(([key,label,type])=><div key={key}><label className="label">{label}</label><input type={type} required minLength={key==='password'?8:undefined} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/></div>)}<div><label className="label">Address</label><textarea required rows="3" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></div><button disabled={busy} className="btn-primary mt-2">{busy?'Sending OTP…':'Create account'}</button><p className="text-center text-sm">Already registered? <Link className="font-semibold text-clay" to="/login">Sign in</Link></p></form></AuthShell>;
}
export function VerifyEmail() {
  const nav=useNavigate(); const location=useLocation(); const {saveSession}=useAuth(); const [email,setEmail]=useState(location.state?.email||''); const [otp,setOtp]=useState(''); const [busy,setBusy]=useState(false);
  const submit=async e=>{e.preventDefault();setBusy(true);try{const {data}=await api.post('/auth/verify-otp',{email,otp});saveSession(data);toast.success('Email verified');nav('/account');}catch(err){toast.error(errorMessage(err));}finally{setBusy(false)}};
  return <AuthShell title="Check your inbox" subtitle="Enter the six-digit code we sent. It expires in 10 minutes."><form onSubmit={submit} className="grid gap-4"><div><label className="label">Email</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></div><div><label className="label">Verification code</label><input inputMode="numeric" pattern="[0-9]{6}" maxLength="6" required value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,''))} className="text-center text-2xl tracking-[.5em]"/></div><button disabled={busy} className="btn-primary">{busy?'Verifying…':'Verify email'}</button></form></AuthShell>;
}
