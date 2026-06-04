import React, { useState, useEffect } from 'react';

const ReservasPage = () => {
  const [mesas, setMesas] = useState([]);
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', telefono: '', fecha: '', hora: '', personas: 2 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarMesas();
  }, []);

  const cargarMesas = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/mesas');
      const data = await res.json();
      setMesas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const actualizarMesa = async (id, estado) => {
    try {
      await fetch(`http://localhost:5000/api/mesas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado })
      });
      cargarMesas();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReserva = (mesa) => {
    if (mesa.estado !== 'libre') {
      alert(`La mesa ${mesa.numero} no está disponible`);
      return;
    }
    setSelectedMesa(mesa);
    setShowForm(true);
    const today = new Date().toISOString().split('T')[0];
    setFormData({ ...formData, fecha: today });
  };

  const handleSubmitReserva = async (e) => {
    e.preventDefault();
    const nuevaReserva = {
      mesaId: selectedMesa.id,
      mesaNumero: selectedMesa.numero,
      nombre: formData.nombre,
      telefono: formData.telefono,
      fecha: formData.fecha,
      hora: formData.hora,
      personas: formData.personas,
      estado: 'confirmada'
    };
    try {
      const res = await fetch('http://localhost:5000/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaReserva)
      });
      if (res.ok) {
        await actualizarMesa(selectedMesa.id, 'reservada');
        alert(`Reserva confirmada para Mesa ${selectedMesa.numero} el ${formData.fecha} a las ${formData.hora}`);
        setShowForm(false);
        setSelectedMesa(null);
      } else {
        alert('Error al crear la reserva');
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  const cancelarReserva = async (mesa) => {
    if (window.confirm(`¿Cancelar reserva de la mesa ${mesa.numero}?`)) {
      await actualizarMesa(mesa.id, 'libre');
      
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'libre': return { bg: '#d4edda', color: '#155724', text: ' Libre' };
      case 'ocupada': return { bg: '#f8d7da', color: '#721c24', text: ' Ocupada' };
      case 'reservada': return { bg: '#fff3cd', color: '#856404', text: ' Reservada' };
      default: return { bg: '#f8f9fa', color: '#666', text: '---' };
    }
  };

  const mesasLibres = mesas.filter(m => m.estado === 'libre').length;
  const mesasOcupadas = mesas.filter(m => m.estado === 'ocupada').length;
  const mesasReservadas = mesas.filter(m => m.estado === 'reservada').length;

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando mesas...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ color: '#A30000', textAlign: 'center' }}>📅 Reserva tu Mesa</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Elige la mesa que prefieras</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <div style={{ background: '#d4edda', padding: '15px 25px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#155724' }}>{mesasLibres}</div>
          <div>Libres</div>
        </div>
        <div style={{ background: '#fff3cd', padding: '15px 25px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#856404' }}>{mesasReservadas}</div>
          <div>Reservadas</div>
        </div>
        <div style={{ background: '#f8d7da', padding: '15px 25px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#721c24' }}>{mesasOcupadas}</div>
          <div>Ocupadas</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {mesas.map(mesa => {
          const estilo = getEstadoColor(mesa.estado);
          return (
            <div key={mesa.id} style={{ background: estilo.bg, borderRadius: '12px', padding: '15px', textAlign: 'center', cursor: mesa.estado === 'libre' ? 'pointer' : 'default', transition: 'transform 0.3s', border: '2px solid transparent' }}
              onMouseEnter={e => { if (mesa.estado === 'libre') e.currentTarget.style.transform = 'translateY(-5px)'; }}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => mesa.estado === 'libre' && handleReserva(mesa)}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#A30000' }}>Mesa {mesa.numero}</div>
              <div style={{ fontSize: '12px', margin: '8px 0' }}>👥 {mesa.capacidad} personas</div>
              <div style={{ fontWeight: 'bold', marginBottom: '10px', color: estilo.color }}>{estilo.text}</div>
              {mesa.estado === 'reservada' && (
                <button onClick={e => { e.stopPropagation(); cancelarReserva(mesa); }} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '15px', cursor: 'pointer', fontSize: '12px' }}>Cancelar</button>
              )}
              {mesa.estado === 'libre' && (
                <button style={{ background: '#A30000', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', marginTop: '8px', width: '100%' }}>Reservar</button>
              )}
            </div>
          );
        })}
      </div>

      {showForm && selectedMesa && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setShowForm(false)}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '25px', width: '90%', maxWidth: '450px' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: '#A30000' }}>Reservar Mesa {selectedMesa.numero}</h2>
            <form onSubmit={handleSubmitReserva}>
              <div><label>Nombre *</label><input type="text" required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} /></div>
              <div><label>Teléfono *</label><input type="tel" required value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} /></div>
              <div><label>Fecha *</label><input type="date" required value={formData.fecha} min={new Date().toISOString().split('T')[0]} onChange={e => setFormData({...formData, fecha: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} /></div>
              <div><label>Hora *</label><select required value={formData.hora} onChange={e => setFormData({...formData, hora: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '10px' }}><option value="">Seleccionar</option><option value="12:00">12:00</option><option value="13:00">13:00</option><option value="14:00">14:00</option><option value="18:00">18:00</option><option value="19:00">19:00</option><option value="20:00">20:00</option></select></div>
              <div><label>Personas *</label><input type="number" min="1" max={selectedMesa.capacidad} required value={formData.personas} onChange={e => setFormData({...formData, personas: parseInt(e.target.value)})} style={{ width: '100%', padding: '8px', marginBottom: '20px' }} /></div>
              <button type="submit" style={{ background: '#A30000', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', width: '100%' }}>Confirmar Reserva</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservasPage;