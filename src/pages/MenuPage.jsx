import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MenuPage = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  
  const productos = [
    { id: 1, nombre: "Café Especial", categoria: "Bebidas", precio: 25, descripcion: "Café de origen único, tostado artesanal", icono: "☕", stock: 50 },
    { id: 2, nombre: "Cherry Latte", categoria: "Bebidas", precio: 32, descripcion: "Latte con notas de cereza y caramelo", icono: "🍒", stock: 45 },
    { id: 3, nombre: "Capuccino", categoria: "Bebidas", precio: 28, descripcion: "Café espresso con leche cremosa", icono: "☕", stock: 40 },
    { id: 4, nombre: "Tarta de Frambuesa", categoria: "Postres", precio: 38, descripcion: "Tarta artesanal con frambuesas frescas", icono: "🍰", stock: 20 },
    { id: 5, nombre: "Brownie Especial", categoria: "Postres", precio: 28, descripcion: "Brownie de chocolate con nueces", icono: "🍫", stock: 25 },
    { id: 6, nombre: "Cheesecake", categoria: "Postres", precio: 35, descripcion: "Cheesecake con salsa de cereza", icono: "🍰", stock: 18 },
    { id: 7, nombre: "Sándwich Gourmet", categoria: "Comidas", precio: 45, descripcion: "Pan artesanal, jamón serrano, queso brie", icono: "🥪", stock: 15 },
    { id: 8, nombre: "Ensalada Cherry", categoria: "Comidas", precio: 42, descripcion: "Mix de lechugas, cerezas, nueces y queso", icono: "🥗", stock: 12 },
    { id: 9, nombre: "Wrap de Pollo", categoria: "Comidas", precio: 38, descripcion: "Tortilla de trigo, pollo, verduras frescas", icono: "🌯", stock: 20 },
  ];

  const categorias = ["Todos", "Bebidas", "Postres", "Comidas"];
  const productosFiltrados = categoriaSeleccionada === "Todos" 
    ? productos 
    : productos.filter(p => p.categoria === categoriaSeleccionada);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ color: '#A30000', textAlign: 'center', marginBottom: '10px' }}>Nuestro Menú</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>Descubre nuestros sabores exclusivos</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoriaSeleccionada(cat)}
            style={{
              padding: '10px 25px',
              background: categoriaSeleccionada === cat ? '#A30000' : 'white',
              color: categoriaSeleccionada === cat ? 'white' : '#A30000',
              border: `2px solid #A30000`,
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '25px'
      }}>
        {productosFiltrados.map(producto => (
          <div key={producto.id} style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '56px' }}>{producto.icono}</div>
            <h3 style={{ color: '#A30000', margin: '10px 0' }}>{producto.nombre}</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>{producto.descripcion}</p>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#D4AF37', marginBottom: '15px' }}>Bs. {producto.precio}</div>
            <Link to="/login">
              <button style={{
                background: '#A30000',
                color: 'white',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Ordenar
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;