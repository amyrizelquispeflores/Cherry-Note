import React, { useState, useEffect } from 'react';

const AdminReservas = () => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/reservas');
      const data = await res.json();
      setReservas(data.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 style={{ color: '#A30000' }}>📅 Reservas</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px' }}>
        <thead><tr style={{ background: '#A30000', color: 'white' }}><th>ID</th><th>Cliente</th><th>Mesa</th><th>Fecha</th><th>Hora</th><th>Personas</th><th>Teléfono</th></tr></thead>
        <tbody>
          {reservas.map(r => (
            <tr key={r.id}>
              <td>#{r.id}</td><td>{r.nombre}</td><td>Mesa {r.mesaNumero}</td><td>{r.fecha}</td><td>{r.hora}</td><td>{r.personas}</td><td>{r.telefono}</td>
            </tr>
          ))}
          {reservas.length === 0 && <tr><td colSpan="7">No hay reservas</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReservas;