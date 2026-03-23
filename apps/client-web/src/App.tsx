import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import RestaurantDetails from './pages/RestaurantDetails';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import CartSidebar from './components/CartSidebar';
import ClientHistory from './pages/ClientHistory';
import LoyaltyPage from './pages/LoyaltyPage';
import AddressManagement from './pages/AddressManagement';
import FavoritesPage from './pages/FavoritesPage';
import SupportPage from './pages/SupportPage';
import ProfileInfo from './pages/ProfileInfo';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />
      <CartSidebar />
      
      <div className="min-h-[calc(100vh-64px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/history" element={<ClientHistory />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/tracking" element={<ClientHistory />} />
          <Route path="/loyalty" element={<LoyaltyPage />} />
          <Route path="/addresses" element={<AddressManagement />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/profile" element={<ProfileInfo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex justify-between items-center text-slate-500 font-medium text-sm">
          <p>&copy; {new Date().getFullYear()} EcoEATS. Tous droits réservés.</p>
          <div className="flex gap-4 justify-center mt-4 sm:mt-0">
            <a href="#" className="hover:text-emerald-500 transition-colors">Mentions légales</a>
            <Link to="/support" className="hover:text-emerald-500 transition-colors">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
