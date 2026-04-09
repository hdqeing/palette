import './index.css'
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import Home from './pages/Home';
import Layout from './layouts/Layout';
import { createContext, useState } from 'react';
import Profile from './pages/Profile';
import Seller from './pages/Seller';

export const AuthContext = createContext(null);

export default function App(props) {
  const [authenticated, setAuthenticated] = useState(false);
  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      <CartProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='profile' element={<Profile />} />
            <Route path='seller' element={<Seller />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthContext.Provider>
  );
}