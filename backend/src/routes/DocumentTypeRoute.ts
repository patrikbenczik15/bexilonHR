import express from "express";
import { DocumentTypeController } from "../controllers/index.ts";

const router = express.Router();

router.get("/", DocumentTypeController.getAllDocumentTypes);
router.get("/:id", DocumentTypeController.getDocumentTypeById);
router.post("/", DocumentTypeController.createDocumentType);
router.put("/:id", DocumentTypeController.updateDocumentType);
router.delete("/:id", DocumentTypeController.deleteDocumentType);

export default router;
