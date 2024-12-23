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
            SELECT nombre, apellido, rut, correo, telefono, tipo_usuario, estado, saldo
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
                rut: userData.rut,
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

//Backend para el historial

// Endpoint para obtener el historial de transacciones
// Endpoint para obtener el historial completo según el tipo de usuario
app.post('/historial', async (req, res) => {
    const { rut, tipoUsuario } = req.body;

    console.log(`Solicitud para /historial con rut: ${rut}, tipoUsuario: ${tipoUsuario}`);

    try {
        let result = [];

        if (tipoUsuario.toLowerCase() === 'chofer') {
            // Obtener transacciones como chofer
            const choferResult = await pool.query(`
                SELECT id_transaccion AS id, fecha, hora, monto, tipo_transaccion, usuario_rut AS rut_pasajero, rut_chofer
                FROM transaccion
                WHERE rut_chofer = $1
                ORDER BY fecha DESC, hora DESC
            `, [rut]);

            const pasajeroResult = await pool.query(`
                SELECT id_transaccion AS id, fecha, hora, monto, tipo_transaccion, rut_chofer, usuario_rut AS rut_pasajero
                FROM transaccion
                WHERE usuario_rut = $1
                ORDER BY fecha DESC, hora DESC
            `, [rut]);

            // Filtrar transacciones donde rut_chofer y rut_pasajero sean iguales
            const filteredChoferResult = choferResult.rows.filter(
                transaccion => transaccion.rut_chofer !== transaccion.rut_pasajero
            );

            result = [...filteredChoferResult, ...pasajeroResult.rows];
        } else {
            // Obtener transacciones solo como pasajero
            const pasajeroResult = await pool.query(`
                SELECT id_transaccion AS id, fecha, hora, monto, tipo_transaccion, rut_chofer, usuario_rut AS rut_pasajero
                FROM transaccion
                WHERE usuario_rut = $1
                ORDER BY fecha DESC, hora DESC
            `, [rut]);

            result = pasajeroResult.rows;
        }

        if (result.length === 0) {
            console.log(`No se encontraron transacciones para el rut: ${rut}`);
            return res.status(404).json({ message: "No se encontraron transacciones para este usuario" });
        }

        // Procesar transacciones para definir monto y color
        const historialProcesado = result.map((transaccion) => {
            let { monto, tipo_transaccion } = transaccion;
            let color = tipo_transaccion === "Positiva" ? "green" : "red";

            // Ajustar monto según tipo_transaccion
            monto = tipo_transaccion === "Positiva" ? `+${monto}` : `-${monto}`;

            // Para chofer, transacciones "Negativas" son positivas para él
            if (tipoUsuario.toLowerCase() === 'chofer' && tipo_transaccion === "Negativa") {
                monto = `+${transaccion.monto}`;
                color = "green";
            }

            return { ...transaccion, monto, color };
        });

        console.log("Transacciones procesadas:", historialProcesado);
        res.status(200).json({ historial: historialProcesado });
    } catch (error) {
        console.error("Error al obtener el historial:", error.message);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});





// Endpoint para procesar la transacción
app.post('/transaction', async (req, res) => {
    const { rutPasajero, rutChofer, tipoUsuario } = req.body;

    // Tarifas por tipo de usuario
    const tarifas = {
        estudiante: 220,
        adulto: 600,
        adulto_mayor: 350,
        chofer: 600,
    };

    try {
        // Obtener el estado del usuario
        const usuarioResult = await pool.query(
            'SELECT estado, tipo_usuario FROM usuario WHERE rut = $1',
            [rutPasajero]
        );

        if (usuarioResult.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const { estado, tipo_usuario } = usuarioResult.rows[0];

        // Determinar la tarifa según el estado del usuario
        const tarifa =
            estado.toLowerCase() === 'pendiente'
                ? tarifas.adulto // Si el estado es "Pendiente", tarifa de adulto
                : tarifas[tipo_usuario.toLowerCase()]; // Si el estado es "Aceptado", tarifa según tipo de usuario

        if (!tarifa) {
            return res.status(400).json({ message: 'Tipo de usuario no válido' });
        }

        // Iniciar la transacción
        await pool.query('BEGIN');

        // Verificar si el usuario tiene saldo suficiente
        const saldoResult = await pool.query(
            'SELECT saldo FROM usuario WHERE rut = $1',
            [rutPasajero]
        );

        if (saldoResult.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const saldoPasajero = saldoResult.rows[0].saldo;
        if (saldoPasajero < tarifa) {
            return res.status(400).json({ message: 'Saldo insuficiente' });
        }

        // Registrar la transacción
        await pool.query(
            `INSERT INTO transaccion (fecha, hora, monto, rut_chofer, usuario_rut, tipo_transaccion)
             VALUES (CURRENT_DATE, CURRENT_TIME, $1, $2, $3, 'Negativa')`,
            [tarifa, rutChofer, rutPasajero]
        );

        // Actualizar el saldo del pasajero
        await pool.query(
            'UPDATE usuario SET saldo = saldo - $1 WHERE rut = $2',
            [tarifa, rutPasajero]
        );

        // Actualizar el saldo del chofer
        await pool.query(
            'UPDATE usuario SET saldo = saldo + $1 WHERE rut = $2',
            [tarifa, rutChofer]
        );

        // Confirmar la transacción
        await pool.query('COMMIT');

        res.status(200).json({ message: 'Transacción exitosa', tarifa });
    } catch (error) {
        // Revertir la transacción en caso de error
        await pool.query('ROLLBACK');
        console.error('Error al procesar la transacción:', error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Endpoint para agregar saldo al usuario
app.post('/add-saldo', async (req, res) => {
    const { rutUsuario, monto } = req.body;
  
    console.log(`Solicitud para agregar saldo: rutUsuario=${rutUsuario}, monto=${monto}`);
  
    try {
      // Iniciar la transacción
      await pool.query('BEGIN');
  
      // Actualizar el saldo del usuario
      const usuarioResult = await pool.query(
        'UPDATE usuario SET saldo = saldo + $1 WHERE rut = $2 RETURNING saldo',
        [monto, rutUsuario]
      );
  
      if (usuarioResult.rows.length === 0) {
        throw new Error('Usuario no encontrado.');
      }
  
      const nuevoSaldo = usuarioResult.rows[0].saldo;
  
      // Registrar la transacción
      await pool.query(
        `INSERT INTO transaccion (fecha, hora, monto, rut_chofer, usuario_rut, tipo_transaccion)
         VALUES (CURRENT_DATE, CURRENT_TIME, $1, NULL, $2, 'Positiva')`,
        [monto, rutUsuario]
      );
  
      // Confirmar la transacción
      await pool.query('COMMIT');
  
      res.status(200).json({ message: 'Saldo agregado exitosamente', nuevoSaldo });
    } catch (error) {
      // Revertir la transacción en caso de error
      await pool.query('ROLLBACK');
      console.error('Error al agregar saldo:', error.message);
      res.status(500).json({ message: 'Error al agregar saldo.', error: error.message });
    }
  });


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://junction.proxy.rlwy.net:${port}`);
});
