import express from "express";
import { DocumentController } from "../controllers/index.ts";

const router = express.Router();

// TODO change protected routes similar to User
router.get("/", DocumentController.getAllDocuments);
router.get("/:id", DocumentController.getDocumentById);
router.get("/:id/user", DocumentController.getUserByDocumentId);
router.post("/", DocumentController.createDocument);
router.put("/:id", DocumentController.updateDocument);
router.delete("/:id", DocumentController.deleteDocument);

export default router;
