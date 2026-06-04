import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { FaHome, FaCoffee, FaShoppingCart, FaCalendarAlt, FaSignInAlt, FaChartBar, FaFileAlt, FaUsers, FaBoxes, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './App.css';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import PedidosPage from './pages/PedidosPage';
import ReservasPage from './pages/ReservasPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminDashboardHome from './pages/AdminDashboardHome';
import AdminPedidos from './pages/AdminPedidos';
import AdminReservas from './pages/AdminReservas';
import AdminProductos from './pages/AdminProductos';
import AdminReportes from './pages/AdminReportes';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function HomePage() {
  return (
    <div>
      {}
      <div style={{
        background: 'linear-gradient(135deg, #A30000 0%, #7F1734 50%, #4B0082 100%)',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          fontSize: '300px',
          opacity: 0.05,
          bottom: '-50px',
          right: '-50px',
          pointerEvents: 'none'
        }}>🍒</div> {}
        <div style={{ position: 'relative', zIndex: 1, padding: '40px 20px' }}>
          <h1 style={{ fontSize: '64px', marginBottom: '20px', letterSpacing: '2px', fontWeight: 700 }}>Cherry Note</h1>
          <p style={{ fontSize: '22px', marginBottom: '40px', opacity: 0.95, maxWidth: '600px', margin: '0 auto 40px auto' }}>
            Donde cada sabor cuenta una historia
          </p>
          <p style={{ fontSize: '18px', marginBottom: '40px', opacity: 0.9 }}>
            Café de especialidad | Postres artesanales | Comida gourmet
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/menu">
              <button style={{ background: '#D4AF37', color: '#A30000', padding: '14px 40px', border: 'none', borderRadius: '40px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaCoffee size={18} /> Ver Menú
              </button>
            </Link>
            <Link to="/pedidos">
              <button style={{ background: 'transparent', color: 'white', padding: '14px 40px', border: '2px solid white', borderRadius: '40px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaShoppingCart size={18} /> Pedidos a Domicilio
              </button>
            </Link>
            <Link to="/reservas">
              <button style={{ background: 'transparent', color: 'white', padding: '14px 40px', border: '2px solid white', borderRadius: '40px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaCalendarAlt size={18} /> Reservar Mesa
              </button>
            </Link>
          </div>
        </div>
      </div>

      {}
      <div style={{ padding: '80px 20px', background: '#FFF9F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '36px', color: '#A30000', marginBottom: '50px' }}>¿Por qué elegirnos?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '30px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.3s' }}>
              <FaCoffee size={48} color="#A30000" style={{ marginBottom: '20px' }} />
              <h3 style={{ color: '#A30000', marginBottom: '15px' }}>Calidad Premium</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Ingredientes seleccionados de la más alta calidad para ofrecerte el mejor sabor</p>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '30px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.3s' }}>
              <div style={{ fontSize: 0 }}><FaCoffee size={48} color="#D4AF37" style={{ marginBottom: '20px' }} /></div>
              <h3 style={{ color: '#A30000', marginBottom: '15px' }}>Sabor Único</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Recetas exclusivas que combinan tradición e innovación</p>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '30px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.3s' }}>
              <FaCalendarAlt size={48} color="#2F4F4F" style={{ marginBottom: '20px' }} />
              <h3 style={{ color: '#A30000', marginBottom: '15px' }}>Ambiente Acogedor</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Espacio diseñado para momentos especiales con una atmósfera única</p>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '30px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.3s' }}>
              <FaShoppingCart size={48} color="#A30000" style={{ marginBottom: '20px' }} />
              <h3 style={{ color: '#A30000', marginBottom: '15px' }}>Delivery Express</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Llevamos tus sabores favoritos a casa con rapidez</p>
            </div>
          </div>
        </div>
      </div>

      {}
      <div style={{ padding: '80px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '36px', color: '#A30000', marginBottom: '50px' }}>Nuestros Especiales</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div style={{ background: '#FFF9F0', borderRadius: '16px', padding: '30px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.3s' }}>
              <FaCoffee size={64} color="#A30000" style={{ marginBottom: '15px' }} />
              <h3 style={{ color: '#A30000' }}>Café Especial</h3>
              <p style={{ color: '#666', margin: '15px 0' }}>Granos seleccionados de origen único, tostado artesanal</p>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#D4AF37', marginBottom: '20px' }}>Bs. 25</div>
              <Link to="/pedidos"><button style={{ background: '#A30000', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>Ordenar</button></Link>
            </div>
            <div style={{ background: '#FFF9F0', borderRadius: '16px', padding: '30px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.3s' }}>
              <FaCoffee size={64} color="#D4AF37" style={{ marginBottom: '15px' }} />
              <h3 style={{ color: '#A30000' }}>Cherry Latte</h3>
              <p style={{ color: '#666', margin: '15px 0' }}>Latte con notas de cereza y caramelo, nuestra especialidad</p>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#D4AF37', marginBottom: '20px' }}>Bs. 32</div>
              <Link to="/pedidos"><button style={{ background: '#A30000', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>Ordenar</button></Link>
            </div>
            <div style={{ background: '#FFF9F0', borderRadius: '16px', padding: '30px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.3s' }}>
              <div style={{ fontSize: 64, marginBottom: 15 }}>🍰</div> {}
              <h3 style={{ color: '#A30000' }}>Tarta de Frambuesa</h3>
              <p style={{ color: '#666', margin: '15px 0' }}>Tarta artesanal con frambuesas frescas y crema especial</p>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#D4AF37', marginBottom: '20px' }}>Bs. 38</div>
              <Link to="/pedidos"><button style={{ background: '#A30000', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>Ordenar</button></Link>
            </div>
          </div>
        </div>
      </div>

      {}
      <div style={{ padding: '80px 20px', background: '#2F4F4F', color: 'white', marginBottom: '0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '30px' }}>📍 Visítanos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginTop: '40px' }}>
            <div><div style={{ fontSize: '32px', marginBottom: '10px' }}>📍</div><p>Av. Principal #123</p><p>Zona Central, Ciudad</p></div>
            <div><div style={{ fontSize: '32px', marginBottom: '10px' }}>🕐</div><p>Lunes a Domingo</p><p>8:00 AM - 10:00 PM</p></div>
            <div><div style={{ fontSize: '32px', marginBottom: '10px' }}>📞</div><p>+591 77712345</p><p>+591 77754321</p></div>
            <div><div style={{ fontSize: '32px', marginBottom: '10px' }}>📧</div><p>info@cherrynote.com</p><p>reservas@cherrynote.com</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        {}
        <div style={{
          background: '#A30000',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ color: 'white', margin: 0, fontWeight: 600, letterSpacing: '1px' }}>Cherry Note</h2>
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaHome size={16} /> Inicio
            </Link>
            <Link to="/menu" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaCoffee size={16} /> Menú
            </Link>
            <Link to="/pedidos" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaShoppingCart size={16} /> Pedidos
            </Link>
            <Link to="/reservas" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaCalendarAlt size={16} /> Reservas
            </Link>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaSignInAlt size={16} /> Acceder
            </Link>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/pedidos" element={<PedidosPage />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>}>
            <Route index element={<AdminDashboardHome />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="reservas" element={<AdminReservas />} />
            <Route path="productos" element={<AdminProductos />} />
            <Route path="reportes" element={<AdminReportes />} />
          </Route>
        </Routes>

        <div style={{ background: '#2F4F4F', color: 'white', textAlign: 'center', padding: '20px', marginTop: '0' }}>
          <p>Cherry Note - Todos los derechos reservados © 2026</p>
        </div>
      </div>
    </Router>
  );
}

export default App;