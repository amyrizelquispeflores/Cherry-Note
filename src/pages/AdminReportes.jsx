import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

const AdminReportes = () => {
  const [ventas, setVentas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const resVentas = await fetch('http://localhost:5000/api/ventas');
        if (!resVentas.ok) throw new Error(`Error HTTP: ${resVentas.status}`);
        const dataVentas = await resVentas.json();
        setVentas(dataVentas);
        
        const resPedidos = await fetch('http://localhost:5000/api/pedidos');
        const dataPedidos = await resPedidos.json();
        setPedidos(dataPedidos);
        
        const hoy = new Date();
        const hace30 = new Date();
        hace30.setDate(hoy.getDate() - 30);
        setFechaFin(hoy.toISOString().split('T')[0]);
        setFechaInicio(hace30.toISOString().split('T')[0]);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('No se pudieron cargar los datos. Verifica que el backend esté corriendo.');
      }
    };
    cargar();
  }, []);

  const generarPDF = () => {
    // Filtrar ventas por fecha
    const filtradas = ventas.filter(v => {
      const fechaV = new Date(v.fecha).toISOString().split('T')[0];
      return fechaV >= fechaInicio && fechaV <= fechaFin;
    });

    const total = filtradas.reduce((sum, v) => sum + parseFloat(v.total), 0);

    // Crear documento PDF
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text('CHERRY NOTE - REPORTE DE VENTAS', 14, 22);
    
    // Fecha del reporte
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 32);
    
    // Período y total
    doc.setFontSize(12);
    doc.text(`Período: ${fechaInicio} al ${fechaFin}`, 14, 45);
    doc.text(`Total Ventas: Bs. ${total.toFixed(2)}`, 14, 55);
    
    // Tabla de detalle
    doc.setFontSize(11);
    doc.text('Detalle de ventas:', 14, 70);
    
    let y = 80;
    filtradas.forEach((v, i) => {
      const fechaLocal = new Date(v.fecha).toLocaleString();
      const texto = `${i+1}. ${fechaLocal} - Bs. ${parseFloat(v.total).toFixed(2)} (${v.metodo_pago || 'Efectivo'})`;
      doc.text(texto, 14, y);
      y += 8;
      if (y > 280) { // Salto de página si es necesario
        doc.addPage();
        y = 20;
      }
    });
    
    // Guardar PDF
    doc.save(`reporte_cherry_note_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (error) return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;

  const ventasFiltradas = ventas.filter(v => {
    const fechaV = new Date(v.fecha).toISOString().split('T')[0];
    return fechaV >= fechaInicio && fechaV <= fechaFin;
  });
  const totalVentas = ventasFiltradas.reduce((sum, v) => sum + parseFloat(v.total), 0);

  return (
    <div>
      <h1 style={{ color: '#A30000', marginBottom: '20px' }}>📊 Reportes de Ventas</h1>

      {/* Filtros */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '30px' }}>
        <h3>Filtrar por fecha</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label>Fecha inicio</label>
            <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
          </div>
          <div>
            <label>Fecha fin</label>
            <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
          </div>
          <button onClick={generarPDF} style={{ background: '#A30000', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '25px', cursor: 'pointer' }}>
            📄 Generar PDF
          </button>
        </div>
      </div>

      {/* Resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px' }}>💰</div>
          <h3>Total Ventas</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#D4AF37' }}>Bs. {totalVentas.toFixed(2)}</p>
          <small>{ventasFiltradas.length} transacciones</small>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px' }}>🛵</div>
          <h3>Total Pedidos</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#D4AF37' }}>{pedidos.length}</p>
          <small>{pedidos.filter(p => p.estado === 'Pendiente').length} pendientes</small>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px' }}>⭐</div>
          <h3>Ticket Promedio</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#D4AF37' }}>Bs. {(totalVentas / (ventasFiltradas.length || 1)).toFixed(2)}</p>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
        <h3 style={{ padding: '20px', margin: 0, background: '#f5f5f5', color: '#A30000' }}>Ventas realizadas</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#A30000', color: 'white' }}>
              <th style={{ padding: '12px' }}>Fecha y hora</th>
              <th style={{ padding: '12px' }}>Total</th>
              <th style={{ padding: '12px' }}>Método de pago</th>
              <th style={{ padding: '12px' }}>Sucursal</th>
            </tr>
          </thead>
          <tbody>
            {ventasFiltradas.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center' }}>No hay ventas en el período seleccionado</td></tr>
            ) : (
              ventasFiltradas.map(venta => (
                <tr key={venta.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{new Date(venta.fecha).toLocaleString()}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#D4AF37' }}>Bs. {parseFloat(venta.total).toFixed(2)}</td>
                  <td style={{ padding: '12px' }}>{venta.metodo_pago || venta.metodoPago || 'Efectivo'}</td>
                  <td style={{ padding: '12px' }}>{venta.sucursal || 'Central'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReportes;