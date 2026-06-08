import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.email) {
    const logData = {
      usuario: user.email,
      evento: 'salida',
      browser: navigator.userAgent,
      ip: '127.0.0.1',
      fecha: new Date().toLocaleString()
    };
    const logs = JSON.parse(localStorage.getItem('accessLogs') || '[]');
    logs.push(logData);
    localStorage.setItem('accessLogs', JSON.stringify(logs));
  }

  localStorage.removeItem('token');
  localStorage.removeItem('user');
  navigate('/');
};

  return (
    <div>
      
      <div style={{
        background: '#A30000',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>🍒</span>
          <h2 style={{ color: 'white', margin: 0, fontSize: 'clamp(18px, 5vw, 24px)' }}>Cherry Note Admin</h2>
        </div>
    
        <div 
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            cursor: 'pointer',
            fontSize: '28px',
            color: 'white'
          }}
          className="menu-hamburguesa"
        >
          {menuOpen ? '✕' : '☰'}
        </div>

        <ul style={{
          display: 'flex',
          gap: '20px',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          alignItems: 'center',
          flexWrap: 'wrap'
        }} className="admin-nav-links">
          <li><Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link></li>
          <li><Link to="/admin/pedidos" style={{ color: 'white', textDecoration: 'none' }}>Pedidos</Link></li>
          <li><Link to="/admin/reservas" style={{ color: 'white', textDecoration: 'none' }}>Reservas</Link></li>
          <li><Link to="/admin/productos" style={{ color: 'white', textDecoration: 'none' }}>Productos</Link></li>
          <li><Link to="/admin/reportes" style={{ color: 'white', textDecoration: 'none' }}>Reportes</Link></li>
          <li><Link to="/admin/logs" style={{ color: 'white', textDecoration: 'none' }}>📋 Logs</Link></li>
          <li><span style={{ color: 'white', background: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px' }}> {user?.nombre || user?.email || 'Admin'}</span></li>
          <li><button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '6px 15px', borderRadius: '20px', cursor: 'pointer' }}>Cerrar Sesión</button></li>
        </ul>
      </div>

      <div style={{ padding: '20px', background: '#FFF9F0', minHeight: 'calc(100vh - 70px)' }}>
        <Outlet />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .menu-hamburguesa {
            display: block !important;
          }
          .admin-nav-links {
            display: ${menuOpen ? 'flex' : 'none'};
            flex-direction: column;
            width: 100%;
            background: #A30000;
            padding: 15px;
            margin-top: 10px;
            border-top: 1px solid rgba(255,255,255,0.2);
          }
          .admin-nav-links li {
            width: 100%;
          }
          .admin-nav-links a, .admin-nav-links button, .admin-nav-links span {
            display: block;
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;