import React, { useState, useEffect } from 'react';

const AdminDashboardHome = () => {
  const [ventas, setVentas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [stats, setStats] = useState({ totalVentas: 0, totalPedidos: 0, pedidosPendientes: 0, productoEstrella: { nombre: '', ventas: 0 } });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resStats = await fetch('http://localhost:5000/api/estadisticas');
        const dataStats = await resStats.json();
        setStats(dataStats);
        const resVentas = await fetch('http://localhost:5000/api/ventas');
        const dataVentas = await resVentas.json();
        setVentas(dataVentas);
        const resPedidos = await fetch('http://localhost:5000/api/pedidos');
        const dataPedidos = await resPedidos.json();
        setPedidos(dataPedidos.slice(0, 5));
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    cargarDatos();
  }, []);

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
  const ventasPorMes = meses.map(m => 0);
  ventas.forEach(v => {
    const fecha = new Date(v.fecha);
    const mesIndex = fecha.getMonth(); 
    if (mesIndex >= 0 && mesIndex < 6) {
      ventasPorMes[mesIndex] += parseFloat(v.total);
    }
  });
  const maxVenta = Math.max(...ventasPorMes, 1);

  return (
    <div>
      <h1 style={{ color: '#A30000', marginBottom: '30px' }}>📊 Panel de Control - Cherry Note</h1>

      {/* Tarjetas de estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '40px' }}>💰</div>
          <h3>Total Ventas</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#D4AF37' }}>Bs. {stats.totalVentas}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '40px' }}>🛵</div>
          <h3>Total Pedidos</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#D4AF37' }}>{stats.totalPedidos}</p>
          <small>{stats.pedidosPendientes} pendientes</small>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '40px' }}>⭐</div>
          <h3>Producto Estrella</h3>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#D4AF37' }}>{stats.productoEstrella.nombre}</p>
          <small>{stats.productoEstrella.ventas} ventas</small>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '40px' }}>📅</div>
          <h3>Ticket Promedio</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#D4AF37' }}>Bs. {(stats.totalVentas / (stats.totalPedidos || 1)).toFixed(0)}</p>
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#A30000', marginBottom: '20px' }}> Ventas por Mes (Bs.)</h3>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', height: '250px' }}>
          {meses.map((mes, idx) => (
            <div key={mes} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                height: `${(ventasPorMes[idx] / maxVenta) * 200}px`,
                background: '#A30000',
                borderRadius: '8px',
                transition: 'height 0.5s',
                marginBottom: '8px'
              }}></div>
              <div style={{ fontSize: '12px', color: '#666' }}>{mes}</div>
              <div style={{ fontSize: '11px', fontWeight: 'bold' }}>Bs. {ventasPorMes[idx].toFixed(0)}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ padding: '20px', margin: 0, background: '#f5f5f5', color: '#A30000' }}>Pedidos Recientes</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#A30000', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Cliente</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Total</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center' }}>No hay pedidos registrados</td></tr>
            ) : (
              pedidos.map(pedido => (
                <tr key={pedido.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>#{pedido.id}</td>
                  <td style={{ padding: '12px' }}>{pedido.cliente}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#D4AF37' }}>Bs. {pedido.total}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      background: pedido.estado === 'Pendiente' ? '#fff3cd' : '#d4edda',
                      color: pedido.estado === 'Pendiente' ? '#856404' : '#155724',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px'
                    }}>{pedido.estado}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardHome;