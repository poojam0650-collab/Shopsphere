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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/cart' element={<CartPage/>}/>
        <Route path='/wishlist' element={<WishlistPage/>}/>
        <Route path='/shop' element={<Shop/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path='/order-success' element={<OrderSuccess/>}/>
        <Route path='/orders' element={<OrderHistory/>}/>
        <Route path="/contact" element={<Contact />} />
        
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
