import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api, { errorMessage } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
export function CartProvider({ children }) {
  const { user } = useAuth(); const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0 }); const [loading, setLoading] = useState(false);
  const refresh = async () => { if (!user) return setCart({ items: [], subtotal: 0, total: 0 }); setLoading(true); try { setCart((await api.get('/cart')).data.cart); } finally { setLoading(false); } };
  useEffect(() => { refresh(); }, [user?.id]);
  const add = async (productId, quantity = 1, customizationId) => { try { const { data } = await api.post('/cart/items', { productId, quantity, customizationId }); setCart(data.cart); toast.success('Added to cart'); return true; } catch (e) { toast.error(errorMessage(e)); return false; } };
  const update = async (itemId, quantity) => { try { setCart((await api.patch(`/cart/items/${itemId}`, { quantity })).data.cart); } catch (e) { toast.error(errorMessage(e)); } };
  const remove = async (itemId) => { try { setCart((await api.delete(`/cart/items/${itemId}`)).data.cart); toast.success('Removed from cart'); } catch (e) { toast.error(errorMessage(e)); } };
  const value = useMemo(() => ({ cart, loading, refresh, add, update, remove, count: cart.items.reduce((s, i) => s + i.quantity, 0) }), [cart, loading]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
