const sql = require('mssql');

const configuracion = {
  user: process.env.DB_USUARIO,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVIDOR,
  database: process.env.DB_NOMBRE,
  port: parseInt(process.env.DB_PUERTO || '1433', 10),
  options: {
    encrypt: String(process.env.DB_ENCRIPTAR).toLowerCase() === 'true',
    trustServerCertificate: String(process.env.DB_CONFIAR_CERTIFICADO).toLowerCase() === 'true'
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool;

async function obtenerConexion() {
  if (pool) return pool;
  pool = await sql.connect(configuracion);
  return pool;
}

async function ejecutarConsulta(callback) {
  const conexion = await obtenerConexion();
  const request = conexion.request();
  return callback(request, sql);
}

module.exports = { sql, obtenerConexion, ejecutarConsulta };
