import React, { useState, useEffect } from 'react';

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/pedidos');
      const data = await res.json();
      setPedidos(data.reverse());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await fetch(`http://localhost:5000/api/pedidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      cargarPedidos();
    } catch (error) {
      alert('Error al actualizar');
    }
  };

  if (loading) return <div>Cargando pedidos...</div>;

  return (
    <div>
      <h1 style={{ color: '#A30000' }}>🛵 Gestión de Pedidos</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px' }}>
        <thead><tr style={{ background: '#A30000', color: 'white' }}><th>ID</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          {pedidos.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>#{p.id}</td><td>{p.cliente}</td>
              <td>{p.productos?.map(prod => `${prod.producto_nombre} x${prod.cantidad}`).join(', ')}</td>
              <td>Bs. {p.total}</td>
              <td><span style={{ background: p.estado === 'Pendiente' ? '#fff3cd' : '#d4edda', padding: '4px 12px', borderRadius: '20px' }}>{p.estado}</span></td>
              <td>{p.estado === 'Pendiente' && <button onClick={() => actualizarEstado(p.id, 'Completado')} style={{ background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>Completar</button>}</td>
            </tr>
          ))}
          {pedidos.length === 0 && <tr><td colSpan="6">No hay pedidos</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPedidos;