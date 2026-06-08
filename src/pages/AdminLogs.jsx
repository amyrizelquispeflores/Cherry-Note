import React, { useState, useEffect } from 'react';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem('accessLogs') || '[]');
    setLogs(storedLogs.reverse());
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#A30000', marginBottom: '20px' }}>📋 Registro de Accesos</h1>
      {logs.length === 0 ? (
        <p>No hay registros todavía. Inicia sesión y cierra sesión para generar logs.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ background: '#A30000', color: 'white' }}>
                <th style={{ padding: '12px' }}>Usuario</th>
                <th style={{ padding: '12px' }}>Evento</th>
                <th style={{ padding: '12px' }}>Fecha y Hora</th>
                <th style={{ padding: '12px' }}>IP</th>
                <th style={{ padding: '12px' }}>Navegador</th>
               </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{log.usuario}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      background: log.evento === 'ingreso' ? '#d4edda' : '#fff3cd',
                      color: log.evento === 'ingreso' ? '#155724' : '#856404',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px'
                    }}>
                      {log.evento}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{log.fecha}</td>
                  <td style={{ padding: '12px' }}>{log.ip || '127.0.0.1'}</td>
                  <td style={{ padding: '12px', fontSize: '12px' }}>{log.browser?.substring(0, 60)}...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminLogs;