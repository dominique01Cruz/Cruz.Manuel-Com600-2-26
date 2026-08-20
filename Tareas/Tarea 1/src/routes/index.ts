import { Router } from "express";
import * as candidatoController from "../controllers/candidatoController";

const router = Router();

router.get("/candidatos", candidatoController.getCandidatos);
router.get("/candidatos/create", candidatoController.createForm);
router.post("/candidatos", candidatoController.createCandidato);
router.get("/candidatos/:ci/edit", candidatoController.editForm);
router.post("/candidatos/:ci", candidatoController.updateCandidato);
router.get("/candidatos/:ci/delete", candidatoController.deleteCandidato);

export default router;