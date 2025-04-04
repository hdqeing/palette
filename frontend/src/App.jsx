import './index.css'
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login'
import Home from './pages/Home';
import Register from './pages/Register';
import Layout from './layouts/Layout';
import Cart from './pages/Cart';
import Supplier from './pages/Supplier';
import Order from './pages/Order';
import Query from './pages/Query';
import SellerLayout from './layouts/SellerLayout';
import SellerHome from './pages/SellerHome';
import SellerQuery from './pages/SellerQuery';
import SellerStats from './pages/SellerStats';
import SellerProfile from './pages/SellerProfile';
import SellerMail from './pages/SellerMail';
import SellerOrder from './pages/SellerOrder';

export default function App(props) {
  return (
    <Routes>
      <Route 
      path="/" 
      element={
        <Layout>
          <Home />
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
      <Route path="/query" element={
        <Layout>
          <Query />
        </Layout>
      }>
      </Route> 
      <Route path="seller" element={<SellerLayout />}>
        <Route index element={<SellerHome />} />
        <Route path='query' element={<SellerQuery />} />
        <Route path='stats' element={<SellerStats />} />
        <Route path='profile' element={<SellerProfile />} />
        <Route path='mail' element={<SellerMail />} />
        <Route path='order' element={<SellerOrder />} />
      </Route>

    </Routes>
  );
}