import "reflect-metadata";
import { AppDataSource } from "./src/data-source";
import { Cargo } from "./src/entities/Cargo";
import { Lugar } from "./src/entities/Lugar";

async function seed() {
  await AppDataSource.initialize();
  
  const cargoRepo = AppDataSource.getRepository(Cargo);
  const lugarRepo = AppDataSource.getRepository(Lugar);

  // Insertar cargos
  await cargoRepo.save([
    { nombre: "Ingeniero" },
    { nombre: "Analista" },
    { nombre: "Coordinador" }
  ]);

  // Insertar lugares
  await lugarRepo.save([
    { nombre: "Oficina 1" },
    { nombre: "Oficina 2" },
    { nombre: "Remoto" }
  ]);

  console.log("✅ Datos insertados correctamente");
  await AppDataSource.destroy();
}

seed().catch(console.error);
