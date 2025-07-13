import { createContext, useState, useContext } from 'react';

const CartContext = createContext([]);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        cartItem => cartItem.pallet.id === item.pallet.id
      );
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.pallet.id === item.pallet.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      
      return [...prevCart, item];
    });
  };

  const removeFromCart = (palletId) => {
    setCart(prevCart => prevCart.filter(item => item.pallet.id !== palletId));
  };

  const clearCart = () => setCart([]);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export { CartContext };