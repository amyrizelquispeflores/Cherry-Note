import React, { useState, useEffect } from 'react';

const PedidosPage = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', telefono: '', direccion: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/productos');
      const data = await res.json();
      setProductos(data.filter(p => p.activo && p.stock > 0));
    } catch (error) {
      console.error('Error al cargar productos', error);
    } finally {
      setLoading(false);
    }
  };

  const agregarAlCarrito = (producto) => {
    const existente = carrito.find(item => item.id === producto.id);
    if (existente) {
      if (existente.cantidad + 1 > producto.stock) {
        alert(`Solo quedan ${producto.stock} unidades de ${producto.nombre}`);
        return;
      }
      setCarrito(carrito.map(item =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const quitarDelCarrito = (productoId) => {
    setCarrito(carrito.filter(item => item.id !== productoId));
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    const producto = productos.find(p => p.id === productoId);
    if (nuevaCantidad > producto.stock) {
      alert(`Solo quedan ${producto.stock} unidades`);
      return;
    }
    if (nuevaCantidad <= 0) {
      quitarDelCarrito(productoId);
    } else {
      setCarrito(carrito.map(item =>
        item.id === productoId ? { ...item, cantidad: nuevaCantidad } : item
      ));
    }
  };

  const totalCarrito = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.telefono) {
      alert('Por favor completa tus datos');
      return;
    }

    const pedido = {
      cliente: formData.nombre,
      telefono: formData.telefono,
      direccion: formData.direccion || 'Para llevar',
      productos: carrito.map(item => ({
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio
      })),
      total: totalCarrito
    };

    try {
      const res = await fetch('http://localhost:5000/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });
      const data = await res.json();
      if (data.success) {
        alert(`¡Pedido #${data.pedido.id} confirmado!\nTotal: Bs. ${totalCarrito}\nGracias por tu compra`);
        setCarrito([]);
        setShowCheckout(false);
        setFormData({ nombre: '', telefono: '', direccion: '' });
      } else {
        alert('Error al procesar el pedido');
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando productos...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ color: '#A30000', textAlign: 'center', marginBottom: '10px' }}>🛵 Realiza tu Pedido</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>Elige tus productos favoritos y te los llevamos a casa</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
        <div>
          <h2 style={{ color: '#A30000', marginBottom: '20px' }}>Nuestros Productos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {productos.map(producto => (
              <div key={producto.id} style={{ background: 'white', borderRadius: '12px', padding: '15px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '48px' }}>{producto.icono}</div>
                <h3 style={{ color: '#A30000', margin: '10px 0' }}>{producto.nombre}</h3>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#D4AF37' }}>Bs. {producto.precio}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Stock: {producto.stock}</div>
                <button onClick={() => agregarAlCarrito(producto)} style={{ background: '#A30000', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', marginTop: '10px', cursor: 'pointer' }}>
                  Agregar al Carrito
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: '20px', height: 'fit-content' }}>
          <h2 style={{ color: '#A30000', marginBottom: '20px' }}>🛒 Tu Pedido</h2>
          {carrito.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Aún no has agregado productos</p>
          ) : (
            <>
              {carrito.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <span>{item.nombre} x{item.cantidad}</span>
                  <span>Bs. {item.precio * item.cantidad}</span>
                  <button onClick={() => quitarDelCarrito(item.id)} style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer' }}>✕</button>
                </div>
              ))}
              <div style={{ marginTop: '15px', fontWeight: 'bold', textAlign: 'right' }}>Total: Bs. {totalCarrito}</div>
              <button onClick={() => setShowCheckout(true)} style={{ width: '100%', background: '#A30000', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', marginTop: '15px', cursor: 'pointer' }}>
                Continuar Pedido
              </button>
            </>
          )}
        </div>
      </div>

      {showCheckout && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setShowCheckout(false)}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '30px', width: '90%', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: '#A30000', marginBottom: '20px' }}>Completar Pedido</h2>
            <form onSubmit={handleCheckout}>
              <div style={{ marginBottom: '15px' }}>
                <label>Nombre completo *</label>
                <input type="text" required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Teléfono *</label>
                <input type="tel" required value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label>Dirección (opcional)</label>
                <input type="text" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} placeholder="Dejar en blanco para llevar" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }} />
              </div>
              <button type="submit" style={{ width: '100%', background: '#A30000', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Confirmar Pedido</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidosPage;