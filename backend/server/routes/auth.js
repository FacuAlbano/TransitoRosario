const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const auth = require('../middleware/auth');

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const {
      nombre, apellido, email, usuario, password,
      fechaNacimiento, direccion, ciudad, provincia,
      pais, codigoPostal
    } = req.body;

    // Verificar que todos los campos necesarios estén presentes
    if (!nombre || !apellido || !email || !usuario || !password || 
        !fechaNacimiento || !direccion || !ciudad || !provincia || 
        !pais || !codigoPostal) {
      return res.status(400).json({
        message: 'Todos los campos son requeridos'
      });
    }

    // Verificar si el usuario o email ya existe
    const [existingUsers] = await db.execute(
      'SELECT * FROM usuarios WHERE email = ? OR usuario = ?',
      [email, usuario]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: 'El email o nombre de usuario ya está registrado'
      });
    }

    // Calcular edad y asignar rol correspondiente
    const edad = calcularEdad(fechaNacimiento);
    let rolId;

    // Asignar rol basado en la edad
    if (email === '39500455@terciariourquiza.edu.ar') {
      // Usuario programador (tú)
      rolId = 1; // ID del rol programador
    } else {
      // Asignar rol basado en la edad
      rolId = edad >= 16 ? 4 : 5; // 4: usuario_mayor, 5: usuario_menor
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.execute(
      'INSERT INTO usuarios (nombre, apellido, email, usuario, password, fecha_nacimiento, direccion, ciudad, provincia, pais, codigo_postal, rol_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellido, email, usuario, hashedPassword, fechaNacimiento, direccion, ciudad, provincia, pais, codigoPostal, rolId]
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      message: 'Error al registrar usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
    });
  }
});

// Función auxiliar para calcular la edad
function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const fechaNac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  
  return edad;
}

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { userOrEmail, password } = req.body;
    console.log('Intento de login para:', userOrEmail);

    const [users] = await db.execute(
      `SELECT u.*, r.nombre as rol 
       FROM usuarios u 
       JOIN roles r ON u.rol_id = r.id 
       WHERE u.email = ? OR u.usuario = ?`,
      [userOrEmail, userOrEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const userData = {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      usuario: user.usuario,
      rol_id: user.rol_id,
      rol: user.rol
    };

    const token = jwt.sign(
      { id: user.id },
      'tu_secret_key',
      { expiresIn: '24h' }
    );

    console.log('Login exitoso para usuario:', userData.usuario);
    res.json({ 
      user: userData,
      token 
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

// Verificar token y obtener datos del usuario
router.get('/verify', auth, async (req, res) => {
  try {
    console.log('Verificando usuario con ID:', req.user.id);

    const [rows] = await db.execute(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.usuario, u.rol_id, r.nombre as rol 
       FROM usuarios u 
       LEFT JOIN roles r ON u.rol_id = r.id 
       WHERE u.id = ?`,
      [req.user.id]
    );

    console.log('Resultado de la consulta:', rows);

    if (!rows || rows.length === 0) {
      console.log('Usuario no encontrado en la base de datos');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const userData = {
      id: rows[0].id,
      nombre: rows[0].nombre,
      apellido: rows[0].apellido,
      email: rows[0].email,
      usuario: rows[0].usuario,
      rol_id: rows[0].rol_id,
      rol: rows[0].rol || 'usuario'
    };

    console.log('Enviando datos del usuario:', userData);
    res.json({ user: userData });
  } catch (error) {
    console.error('Error en verify:', error);
    res.status(500).json({ 
      message: 'Error del servidor',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Cerrar sesión
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      await db.execute('DELETE FROM sesiones WHERE token = ?', [token]);
    }

    res.json({ message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al cerrar sesión' });
  }
});

module.exports = router; 