const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const app = express();
const port = 50587;

// Middleware
app.use(bodyParser.json());

// PostgreSQL configuration
const pool = new Pool({
    user: 'postgres',     // Reemplaza con tu usuario de PostgreSQL
    host: 'junction.proxy.rlwy.net',         // O el host donde está PostgreSQL
    database: 'railway', // Reemplaza con tu nombre de base de datos
    password: 'ynbsXYDxitIulsUlBKVmvBRRDefYQVuD', // Reemplaza con tu contraseña de PostgreSQL
    port: 50587,                // Puerto por defecto de PostgreSQL
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error conectando a PostgreSQL:', err);
    } else {
        console.log('Conexión exitosa a PostgreSQL:', res.rows);
    }
    // pool.end(); // Comentado para evitar cerrar el pool
});


// Endpoint para verificar inicio de sesión
// Cambiar la comparación de contraseñas y eliminar errores en el endpoint
app.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;
    console.log('Datos recibidos:', { correo, contrasena });

    try {
        // Consulta para encontrar el usuario por correo
        const result = await pool.query('SELECT * FROM usuario WHERE correo = $1', [correo]);
        console.log('Resultado de la consulta:', result.rows);

        if (result.rows.length === 0) {
            console.log('Usuario no encontrado');
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const user = result.rows[0];
        console.log('Usuario encontrado:', user);

        // Comparar contraseñas directamente
        if (contrasena !== user.contrasena) {
            console.log('Contraseña incorrecta');
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        console.log('Inicio de sesión exitoso');
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});


// Endpoint para registrar un nuevo usuario
app.post('/register', async (req, res) => {
    const { rut, correo, contrasena, nombre, apellido, telefono, tipo_usuario } = req.body;

    try {
        // Verifica si el correo ya está registrado
        const existingUser = await pool.query('SELECT * FROM usuario WHERE correo = $1', [correo]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // Inserta el nuevo usuario en la base de datos
        const result = await pool.query(
            'INSERT INTO usuario (rut, correo, contrasena, nombre, apellido, telefono, tipo_usuario) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [rut, correo, contrasena, nombre, apellido, telefono, tipo_usuario]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});



// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en junction.proxy.rlwy.net:${port}`);
});
