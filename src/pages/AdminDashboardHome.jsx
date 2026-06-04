import React, { useState, useEffect } from 'react';

const AdminDashboardHome = () => {
  const [stats, setStats] = useState({ totalVentas: 0, totalPedidos: 0, pedidosPendientes: 0, productoEstrella: { nombre: '', ventas: 0 } });
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const resStats = await fetch('http://localhost:5000/api/estadisticas');
      const dataStats = await resStats.json();
      setStats(dataStats);
      const resPedidos = await fetch('http://localhost:5000/api/pedidos');
      const dataPedidos = await resPedidos.json();
      setPedidos(dataPedidos.slice(0, 5));
    };
    cargarDatos();
  }, []);

  return (
    <div>
      <h1 style={{ color: '#A30000' }}>📊 Panel de Control</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}><div>💰</div><h3>Total Ventas</h3><p style={{ fontSize: '28px', fontWeight: 'bold' }}>Bs. {stats.totalVentas}</p></div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}><div>🛵</div><h3>Total Pedidos</h3><p style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.totalPedidos}</p></div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}><div>⭐</div><h3>Producto Estrella</h3><p><strong>{stats.productoEstrella.nombre}</strong> ({stats.productoEstrella.ventas} ventas)</p></div>
      </div>
      <h3>Últimos pedidos</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead><tr style={{ background: '#A30000', color: 'white' }}><th>Cliente</th><th>Total</th><th>Estado</th></tr></thead>
        <tbody>
          {pedidos.map(p => <tr key={p.id}><td>{p.cliente}</td><td>Bs. {p.total}</td><td>{p.estado}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboardHome;