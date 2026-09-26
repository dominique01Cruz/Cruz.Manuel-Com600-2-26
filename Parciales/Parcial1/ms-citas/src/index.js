const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PACIENTES_URL = process.env.PACIENTES_URL;
const MEDICOS_GRPC = process.env.MEDICOS_GRPC;

const packageDefinition = protoLoader.loadSync(path.join(__dirname, '../../ms-medicos/proto/medicos.proto'), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const proto = grpc.loadPackageDefinition(packageDefinition).clinica.medicos.v1;
const medicosClient = new proto.ServicioMedicos(MEDICOS_GRPC, grpc.credentials.createInsecure());

mongoose.connect(process.env.MONGO_URI);

const CitaSchema = new mongoose.Schema({
  pacienteId: Number,
  medicoId: Number,
  horario: { id: Number, fecha: String, hora: String },
  motivo: { type: String, minlength: 5 },
  estado: { type: String, enum: ['PROGRAMADA', 'CANCELADA'], default: 'PROGRAMADA' },
  creada: { type: Date, default: Date.now }
});
const Cita = mongoose.model('Cita', CitaSchema);

const schema = buildSchema(`
  enum EstadoCita { PROGRAMADA CANCELADA }
  type Paciente { id: ID!, ci: String, nombre: String, apellido: String, fecha_nacimiento: String, telefono: String, seguro: String }
  type Medico { id: ID!, nombre: String, especialidad: String, matricula: String }
  type Horario { id: ID!, medico_id: Int, fecha: String, hora: String, disponible: Boolean }
  type Cita { id: ID!, pacienteId: Int, medicoId: Int, horario: Horario, motivo: String, estado: EstadoCita, creada: String, paciente: Paciente, medico: Medico }
  input CitaInput { pacienteId: Int!, medicoId: Int!, horarioId: Int!, motivo: String! }
  type Query {
    medicos(especialidad: String): [Medico]
    horariosDisponibles(medicoId: Int!): [Horario]
    citas(estado: EstadoCita): [Cita]
    cita(id: ID!): Cita
    citasDePaciente(pacienteId: Int!): [Cita]
  }
  type Mutation {
    agendarCita(input: CitaInput!): Cita
    cancelarCita(id: ID!): Cita
  }
`);

function restGetPaciente(id) {
  return fetch(`${PACIENTES_URL}/api/v1/pacientes/${id}`, { signal: AbortSignal.timeout(3000) })
    .then(r => r.ok ? r.json() : null)
    .catch(() => null);
}

function grpcCall(method, request) {
  return new Promise((resolve, reject) => {
    const deadline = new Date(Date.now() + 3000);
    medicosClient[method](request, { deadline }, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

const root = {
  medicos: async ({ especialidad }) => {
    try {
      const res = await grpcCall('ListarMedicos', { especialidad: especialidad || '' });
      return res.medicos;
    } catch (e) { return []; }
  },
  horariosDisponibles: async ({ medicoId }) => {
    return new Promise((resolve) => {
      const horarios = [];
      const call = medicosClient.ListarHorariosDisponibles({ id: medicoId }, { deadline: new Date(Date.now() + 3000) });
      call.on('data', h => horarios.push(h));
      call.on('end', () => resolve(horarios));
      call.on('error', () => resolve([]));
    });
  },
  citas: async ({ estado }) => {
    const filter = estado ? { estado } : {};
    return Cita.find(filter);
  },
  cita: async ({ id }) => Cita.findById(id),
  citasDePaciente: async ({ pacienteId }) => Cita.find({ pacienteId }),
  agendarCita: async ({ input }) => {
    const paciente = await restGetPaciente(input.pacienteId);
    if (!paciente) throw new Error('PACIENTE_NO_EXISTE');
    let horario;
    try {
      horario = await grpcCall('ReservarHorario', { id: input.horarioId });
    } catch (e) {
      if (e.code === grpc.status.FAILED_PRECONDITION) throw new Error('HORARIO_OCUPADO');
      throw new Error('ERROR_GRPC');
    }
    try {
      const cita = new Cita({
        pacienteId: input.pacienteId,
        medicoId: input.medicoId,
        horario: { id: horario.id, fecha: horario.fecha, hora: horario.hora },
        motivo: input.motivo
      });
      await cita.save();
      return cita;
    } catch (e) {
      await grpcCall('LiberarHorario', { id: input.horarioId }).catch(() => {});
      throw new Error('ERROR_AL_GUARDAR');
    }
  },
  cancelarCita: async ({ id }) => {
    const cita = await Cita.findById(id);
    if (!cita) throw new Error('CITA_NO_EXISTE');
    if (cita.estado === 'CANCELADA') throw new Error('CITA_YA_CANCELADA');
    await grpcCall('LiberarHorario', { id: cita.horario.id }).catch(() => {});
    cita.estado = 'CANCELADA';
    await cita.save();
    return cita;
  }
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
  customFormatErrorFn: (err) => ({ message: err.message })
}));

app.listen(4000, () => console.log('ms-citas GraphQL en 4000'));
