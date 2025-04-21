import express from "express";
import { DocumentController } from "../controllers/index.ts";

const router = express.Router();

router.get("/", DocumentController.getAllDocuments);
router.get("/:id", DocumentController.getDocumentById);
router.get("/:id/user", DocumentController.getUserByDocumentId);
router.post("/", DocumentController.createDocument); // TODO bug
router.put("/:id", DocumentController.updateDocument); // TODO bug
router.delete("/:id", DocumentController.deleteDocument); // TODO bug

export default router;
