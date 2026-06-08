import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  
  if (captchaInput.toUpperCase() !== captcha) {
    setError('CAPTCHA incorrecto');
    generateCaptcha();
    setCaptchaInput('');
    return;
  }
  
  setLoading(true);
  
  try {
    const respuesta = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, password: formData.password })
    });
    const datos = await respuesta.json();
    
    if (datos.success) {
  localStorage.setItem('token', 'token-simulado');
  localStorage.setItem('user', JSON.stringify(datos.user));

  // === REGISTRAR LOG DE INGRESO ===
  const logData = {
    usuario: formData.email,
    evento: 'ingreso',
    browser: navigator.userAgent,
    ip: '127.0.0.1',  // En un entorno real se obtendría del backend
    fecha: new Date().toLocaleString()
  };
  const logs = JSON.parse(localStorage.getItem('accessLogs') || '[]');
  logs.push(logData);
  localStorage.setItem('accessLogs', JSON.stringify(logs));
  
  if (datos.user.rol === 'admin') {
    navigate('/admin');
  } else {
    navigate('/');
  }
} else {
      setError(datos.message || 'Credenciales incorrectas');
    }
  } catch (error) {
    setError('Error de conexión con el servidor');
  }
  
  setLoading(false);
};

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #A30000 0%, #7F1734 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px' }}>🍒</div>
          <h2 style={{ color: '#A30000' }}>Cherry Note</h2>
          <p style={{ color: '#666' }}>Accede a tu cuenta</p>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contraseña</label>
            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>CAPTCHA</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <div style={{ flex: 1, background: '#f0f0f0', padding: '10px', textAlign: 'center', fontSize: '20px', fontWeight: 'bold', letterSpacing: '5px' }}>{captcha}</div>
              <button type="button" onClick={generateCaptcha} style={{ padding: '10px 20px', background: '#2F4F4F', color: 'white', border: 'none', borderRadius: '8px' }}>↻</button>
            </div>
            <input type="text" value={captchaInput} onChange={e => setCaptchaInput(e.target.value.toUpperCase())} placeholder="Ingrese el código" required
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
          </div>
          {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#A30000', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#999' }}>Demo: admin@cherrynote.com / admin123</p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;