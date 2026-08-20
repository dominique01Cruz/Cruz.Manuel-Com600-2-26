import "reflect-metadata";
import express from "express";
import { engine } from "express-handlebars";
import { AppDataSource } from "./data-source";
import router from "./routes";

const app = express();
const PORT = 3000;

AppDataSource.initialize().then(() => {
  app.engine("hbs", engine({ 
    extname: "hbs",
    helpers: {
      eq: (a: any, b: any) => a === b
    }
  }));
  app.set("view engine", "hbs");
  app.set("views", __dirname + "/views");

  app.use(express.urlencoded({ extended: true }));
  app.use(router);

  app.listen(PORT, () => {
    console.log("Servidor corriendo en http://localhost:" + PORT);
    console.log("CRUD disponible en http://localhost:" + PORT + "/candidatos");
  });
}).catch(error => {
  console.error("Error de base de datos:", error);
});
