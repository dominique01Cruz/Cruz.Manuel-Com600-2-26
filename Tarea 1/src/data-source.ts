import "reflect-metadata";
import { DataSource } from "typeorm";
import { Candidato } from "./entities/Candidato";
import { Cargo } from "./entities/Cargo";
import { Lugar } from "./entities/Lugar";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: true,
  entities: [Candidato, Cargo, Lugar],
});
