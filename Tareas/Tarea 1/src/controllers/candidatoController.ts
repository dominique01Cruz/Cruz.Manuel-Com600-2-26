import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Candidato } from "../entities/Candidato";
import { Cargo } from "../entities/Cargo";
import { Lugar } from "../entities/Lugar";

const candidatoRepo = AppDataSource.getRepository(Candidato);
const cargoRepo = AppDataSource.getRepository(Cargo);
const lugarRepo = AppDataSource.getRepository(Lugar);

// LISTAR
export const getCandidatos = async (req: Request, res: Response) => {
  const candidatos = await candidatoRepo.find({ relations: ["cargo", "lugar"] });
  res.render("candidatos", { candidatos });
};

// FORMULARIO CREAR
export const createForm = async (req: Request, res: Response) => {
  const cargos = await cargoRepo.find();
  const lugares = await lugarRepo.find();
  res.render("candidato-form", { cargos, lugares, candidato: null });
};

// GUARDAR
export const createCandidato = async (req: Request, res: Response) => {
  const { ci, nombres, apellido1, apellido2, cargo_id, lugar_id } = req.body;
  const candidato = candidatoRepo.create({ ci, nombres, apellido1, apellido2, cargo_id, lugar_id });
  await candidatoRepo.save(candidato);
  res.redirect("/candidatos");
};

// FORMULARIO EDITAR
export const editForm = async (req: Request, res: Response) => {
  const { ci } = req.params;
  const candidato = await candidatoRepo.findOne({ where: { ci } });
  const cargos = await cargoRepo.find();
  const lugares = await lugarRepo.find();
  res.render("candidato-form", { candidato, cargos, lugares });
};

// ACTUALIZAR
export const updateCandidato = async (req: Request, res: Response) => {
  const { ci } = req.params;
  const { nombres, apellido1, apellido2, cargo_id, lugar_id } = req.body;
  await candidatoRepo.update(ci, { nombres, apellido1, apellido2, cargo_id, lugar_id });
  res.redirect("/candidatos");
};

// ELIMINAR
export const deleteCandidato = async (req: Request, res: Response) => {
  const { ci } = req.params;
  await candidatoRepo.delete(ci);
  res.redirect("/candidatos");
};