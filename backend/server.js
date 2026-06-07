const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');   // para encriptar contraseñas

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',       
  database: 'cherry_note'
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

const crearAdmin = async () => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync('admin123', salt);
  db.query('SELECT id FROM usuarios WHERE email = ?', ['admin@cherrynote.com'], (err, results) => {
    if (err) return console.error('Error al verificar admin:', err);
    if (results.length === 0) {
      db.query(
        'INSERT INTO usuarios (nombre, email, password, rol, fecha_registro) VALUES (?, ?, ?, ?, ?)',
        ['Administrador', 'admin@cherrynote.com', hashedPassword, 'admin', new Date().toISOString().slice(0, 10)],
        (err2) => {
          if (err2) console.error('Error al crear admin:', err2);
          else console.log('Usuario administrador creado con contraseña encriptada');
        }
      );
    } else {
      console.log('El usuario administrador ya existe. No se modificó su contraseña.');
    }
  });
};
crearAdmin();

app.get('/api/productos', (req, res) => {
  db.query('SELECT * FROM productos WHERE activo = 1', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.put('/api/productos/:id', (req, res) => {
  const id = req.params.id;
  const { precio, stock, activo } = req.body;
  let query = 'UPDATE productos SET';
  const values = [];
  if (precio !== undefined) {
    query += ' precio = ?,';
    values.push(precio);
  }
  if (stock !== undefined) {
    query += ' stock = ?,';
    values.push(stock);
  }
  if (activo !== undefined) {
    query += ' activo = ?,';
    values.push(activo);
  }
  query = query.slice(0, -1);
  query += ' WHERE id = ?';
  values.push(id);
  db.query(query, values, err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT id, nombre, email, rol, password FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });

    const usuario = results[0];
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });

    const { password: _, ...userData } = usuario;
    res.json({ success: true, user: userData });
  });
});
//Validamos la contraseña
app.post('/api/register', async (req, res) => {
  const { nombre, email, password } = req.body;

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[$@#&!]/.test(password)) strength++;
  const nivel = strength <= 2 ? 'débil' : (strength === 3 ? 'intermedio' : 'fuerte');

  if (nivel === 'débil') {
    return res.status(400).json({ success: false, message: 'Contraseña demasiado débil. Usa al menos 8 caracteres, mayúsculas, números y símbolos.' });
  }

  // Aca verifiico si un email ya existe
  db.query('SELECT id FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: 'El email ya está registrado' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const fechaRegistro = new Date().toISOString().slice(0, 10);
    db.query(
      'INSERT INTO usuarios (nombre, email, password, rol, fecha_registro) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, hashedPassword, 'cliente', fechaRegistro],
      (err2, result) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ success: true, message: 'Usuario registrado correctamente', userId: result.insertId });
      }
    );
  });
});

app.get('/api/pedidos', (req, res) => {
  db.query('SELECT * FROM pedidos ORDER BY id DESC', (err, pedidos) => {
    if (err) return res.status(500).json({ error: err.message });
    const promesas = pedidos.map(pedido => {
      return new Promise((resolve) => {
        db.query('SELECT producto_nombre, cantidad, precio_unitario FROM detalles_pedido WHERE pedido_id = ?', [pedido.id], (err2, detalles) => {
          pedido.productos = detalles;
          resolve(pedido);
        });
      });
    });
    Promise.all(promesas).then(resultados => res.json(resultados));
  });
});

app.post('/api/pedidos', (req, res) => {
  const { cliente, telefono, direccion, productos, total } = req.body;
  const fecha = new Date().toLocaleString('sv-SE').replace(' ', ' ');
  db.query('INSERT INTO pedidos (cliente, telefono, direccion, total, estado, fecha) VALUES (?, ?, ?, ?, ?, ?)',
    [cliente, telefono, direccion, total, 'Pendiente', fecha],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      const pedidoId = result.insertId;
      const detalles = productos.map(p => [pedidoId, p.nombre, p.cantidad, p.precio]);
      db.query('INSERT INTO detalles_pedido (pedido_id, producto_nombre, cantidad, precio_unitario) VALUES ?', [detalles], err2 => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ success: true, pedido: { id: pedidoId, ...req.body, fecha } });
      });
    });
});

app.put('/api/pedidos/:id', (req, res) => {
  const { estado } = req.body;
  db.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.get('/api/reservas', (req, res) => {
  db.query('SELECT * FROM reservas ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/reservas', (req, res) => {
  const { mesaId, mesaNumero, nombre, telefono, fecha, hora, personas } = req.body;
  const fechaCreacion = new Date().toLocaleString('sv-SE').replace(' ', ' ');
  db.query('INSERT INTO reservas (mesa_id, mesa_numero, nombre, telefono, fecha, hora, personas, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [mesaId, mesaNumero, nombre, telefono, fecha, hora, personas, fechaCreacion],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
});

app.get('/api/mesas', (req, res) => {
  db.query('SELECT * FROM mesas', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.put('/api/mesas/:id', (req, res) => {
  const { estado } = req.body;
  db.query('UPDATE mesas SET estado = ? WHERE id = ?', [estado, req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});


app.get('/api/ventas', (req, res) => {
  db.query('SELECT * FROM ventas', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/ventas', (req, res) => {
  const { pedidoId, total, metodoPago, sucursal } = req.body;
  const fecha = new Date().toLocaleString('sv-SE').replace(' ', ' ');
  db.query('INSERT INTO ventas (pedido_id, fecha, total, metodo_pago, sucursal) VALUES (?, ?, ?, ?, ?)',
    [pedidoId, fecha, total, metodoPago, sucursal],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
});


app.get('/api/estadisticas', (req, res) => {
  const queryVentas = 'SELECT SUM(total) as total FROM ventas';
  const queryPedidos = 'SELECT COUNT(*) as total FROM pedidos';
  const queryPendientes = 'SELECT COUNT(*) as pendientes FROM pedidos WHERE estado = "Pendiente"';
  const queryEstrella = 'SELECT producto_nombre, SUM(cantidad) as total FROM detalles_pedido GROUP BY producto_nombre ORDER BY total DESC LIMIT 1';

  Promise.all([
    new Promise((resolve, reject) => db.query(queryVentas, (err, r) => err ? reject(err) : resolve(r[0]?.total || 0))),
    new Promise((resolve, reject) => db.query(queryPedidos, (err, r) => err ? reject(err) : resolve(r[0]?.total || 0))),
    new Promise((resolve, reject) => db.query(queryPendientes, (err, r) => err ? reject(err) : resolve(r[0]?.pendientes || 0))),
    new Promise((resolve, reject) => db.query(queryEstrella, (err, r) => err ? reject(err) : resolve(r[0] || { producto_nombre: 'Ninguno', total: 0 })))
  ]).then(([totalVentas, totalPedidos, pendientes, estrella]) => {
    res.json({
      totalVentas,
      totalPedidos,
      pedidosPendientes: pendientes,
      productoEstrella: { nombre: estrella.producto_nombre, ventas: estrella.total }
    });
  }).catch(err => res.status(500).json({ error: err.message }));
});



app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT} con MySQL`);
});