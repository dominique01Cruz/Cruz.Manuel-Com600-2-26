const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { Pool } = require('pg');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432
});

const packageDefinition = protoLoader.loadSync(path.join(__dirname, '../proto/medicos.proto'), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const proto = grpc.loadPackageDefinition(packageDefinition).clinica.medicos.v1;

const server = new grpc.Server();

server.addService(proto.ServicioMedicos.service, {
  ObtenerMedico: async (call, callback) => {
    try {
      const { rows } = await pool.query('SELECT * FROM medicos WHERE id = $1', [call.request.id]);
      if (rows.length === 0) return callback({ code: grpc.status.NOT_FOUND, message: 'Medico no existe' });
      callback(null, rows[0]);
    } catch (e) {
      callback({ code: grpc.status.INTERNAL, message: e.message });
    }
  },
  ListarMedicos: async (call, callback) => {
    try {
      let query = 'SELECT * FROM medicos';
      const params = [];
      if (call.request.especialidad) {
        query += ' WHERE especialidad = $1';
        params.push(call.request.especialidad);
      }
      const { rows } = await pool.query(query, params);
      callback(null, { medicos: rows });
    } catch (e) {
      callback({ code: grpc.status.INTERNAL, message: e.message });
    }
  },
  ListarHorariosDisponibles: async (call) => {
    try {
      const { rows } = await pool.query('SELECT * FROM horarios WHERE medico_id = $1 AND disponible = TRUE', [call.request.id]);
      rows.forEach(h => call.write(h));
      call.end();
    } catch (e) {
      call.destroy(e);
    }
  },
  ReservarHorario: async (call, callback) => {
    try {
      const { rows } = await pool.query('UPDATE horarios SET disponible = FALSE WHERE id = $1 AND disponible = TRUE RETURNING *', [call.request.id]);
      if (rows.length === 0) return callback({ code: grpc.status.FAILED_PRECONDITION, message: 'Horario ya ocupado' });
      callback(null, rows[0]);
    } catch (e) {
      callback({ code: grpc.status.INTERNAL, message: e.message });
    }
  },
  LiberarHorario: async (call, callback) => {
    try {
      const { rows } = await pool.query('UPDATE horarios SET disponible = TRUE WHERE id = $1 RETURNING *', [call.request.id]);
      if (rows.length === 0) return callback({ code: grpc.status.NOT_FOUND, message: 'Horario no existe' });
      callback(null, rows[0]);
    } catch (e) {
      callback({ code: grpc.status.INTERNAL, message: e.message });
    }
  }
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('ms-medicos gRPC en 50051');
});
