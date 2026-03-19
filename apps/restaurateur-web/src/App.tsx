import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import OrdersDashboard from './pages/OrdersDashboard';
import MenuManagement from './pages/MenuManagement';
import RestaurantProfile from './pages/RestaurantProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route index element={<Navigate to="/orders" replace />} />
          <Route path="orders" element={<OrdersDashboard />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="profile" element={<RestaurantProfile />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  const { token, user } = useAuthStore();
  const isAuthenticated = !!token && !!user && user.role === 'RESTAURATEUR';

  return (
    <Routes>
      {/* Routes Publiques */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} />

      {/* Routes Protégées */}
      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={<Layout />} />
      </Route>
    </Routes>
  );
}

export default App;
