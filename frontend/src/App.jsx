import './index.css'
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login'
import Home from './pages/Home';
import Register from './pages/Register';
import Layout from './layouts/Layout';
import Cart from './pages/Cart';
import Supplier from './pages/Supplier';
import Order from './pages/Order';

export default function App(props) {
  return (
    <Routes>
      <Route 
      path="/" 
      element={
        <Layout>
          <Login />
        </Layout>
      }/>
      <Route path="/login" element={
        <Layout>
          <Login />
        </Layout>
      }/>
      <Route path="/register" element={
        <Layout>
          <Register />
        </Layout>
      }/>
      <Route path="/cart" element={
        <Layout>
          <Cart />
        </Layout>
      }>
      </Route>
      <Route path="/supplier" element={
        <Layout>
          <Supplier />
        </Layout>
      }>
      </Route>
      <Route path="/order" element={
        <Layout>
          <Order />
        </Layout>
      }>
      </Route>  

    </Routes>
  );
}