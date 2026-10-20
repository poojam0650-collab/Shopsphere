import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import './App.css';
import CartPage from './Pages/CartPage';
import WishlistPage from './Pages/WishlistPage';
import Shop from './Pages/Shop';
import About from './Pages/About';
import Checkout from './Pages/Checkout';
import OrderSuccess from './Pages/OrderSuccess';
import OrderHistory from './Pages/OrderHistory';
import Contact from './Pages/Contact';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import ProtectRoute from './Components/ProtectRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
  {/* Public pages */}
  <Route path="/" element={<Home />} />
  <Route path="/shop" element={<Shop />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/login" element={<Login />} />

  {/* Protected pages */}
  <Route
    path="/cart"
    element={
      <ProtectRoute>
        <CartPage />
      </ProtectRoute>
    }
  />

  <Route
    path="/wishlist"
    element={
      <ProtectRoute>
        <WishlistPage />
      </ProtectRoute>
    }
  />

  <Route
    path="/checkout"
    element={
      <ProtectRoute>
        <Checkout />
      </ProtectRoute>
    }
  />

  <Route
    path="/orders"
    element={
      <ProtectRoute>
        <OrderHistory />
      </ProtectRoute>
    }
  />

  <Route
    path="/order-success"
    element={
      <ProtectRoute>
        <OrderSuccess />
      </ProtectRoute>
    }
  />
</Routes>
    </BrowserRouter>
    
  );
}

export default App;
