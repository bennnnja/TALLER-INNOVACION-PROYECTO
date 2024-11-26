const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 50587;

// Middleware
app.use(bodyParser.json());

// Configuración de PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'junction.proxy.rlwy.net',
    database: 'railway',
    password: 'ynbsXYDxitIulsUlBKVmvBRRDefYQVuD',
    port: 50587,
});

// Verificar conexión
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error conectando a PostgreSQL:', err);
    } else {
        console.log('Conexión exitosa a PostgreSQL:', res.rows);
    }
});

// Endpoint para verificar inicio de sesión
app.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const user = await pool.query(`
            SELECT nombre, apellido, correo, telefono, tipo_usuario, estado, saldo
            FROM usuario
            WHERE correo = $1 AND contrasena = $2
        `, [correo, contrasena]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        // Elimina campos innecesarios y devuelve solo los relevantes
        const userData = user.rows[0];

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            user: {
                nombre: userData.nombre,
                apellido: userData.apellido,
                correo: userData.correo,
                telefono: userData.telefono,
                tipo_usuario: userData.tipo_usuario,
                estado: userData.estado,
                saldo: userData.saldo,
            }
        });
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Endpoint para registrar un nuevo usuario
app.post('/register', async (req, res) => {
    const { rut, correo, contrasena, nombre, apellido, telefono, tipo_usuario, estado } = req.body;

    try {
        // Verificar si el correo ya está registrado
        const existingUser = await pool.query('SELECT * FROM usuario WHERE correo = $1', [correo]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // Insertar nuevo usuario
        await pool.query(
            'INSERT INTO usuario (rut, correo, contrasena, nombre, apellido, telefono, tipo_usuario, estado, saldo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [rut, correo, contrasena, nombre, apellido, telefono, tipo_usuario, estado, "0"] // Saldo inicial 0
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error.message);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://junction.proxy.rlwy.net:${port}`);
});
