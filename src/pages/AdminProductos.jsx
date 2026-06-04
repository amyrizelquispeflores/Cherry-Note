import React, { useState, useEffect } from 'react';

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const res = await fetch('http://localhost:5000/api/productos');
    const data = await res.json();
    setProductos(data);
  };

  const actualizarProducto = async (id, campo, valor) => {
    const cambios = { [campo]: valor };
    await fetch(`http://localhost:5000/api/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cambios)
    });
    cargarProductos();
  };

  return (
    <div>
      <h1 style={{ color: '#A30000' }}>📦 Productos y Stock</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead><tr style={{ background: '#A30000', color: 'white' }}><th>Producto</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id}>
              <td>{p.icono} {p.nombre}</td>
              <td><input type="number" value={p.precio} onChange={e => actualizarProducto(p.id, 'precio', parseFloat(e.target.value))} style={{ width: '70px' }} /></td>
              <td><input type="number" value={p.stock} onChange={e => actualizarProducto(p.id, 'stock', parseInt(e.target.value))} style={{ width: '70px' }} /></td>
              <td>{p.activo ? 'Activo' : 'Inactivo'}</td>
              <td><button onClick={() => actualizarProducto(p.id, 'activo', !p.activo)}>{p.activo ? 'Desactivar' : 'Activar'}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductos;