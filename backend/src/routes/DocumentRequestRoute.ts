import express from "express";
import { DocumentRequestController } from "../controllers/index.ts";

const router = express.Router();

router.get("/", DocumentRequestController.getAllDocumentRequests);
router.get("/:id", DocumentRequestController.getDocumentRequestById);
router.post("/", DocumentRequestController.createDocumentRequest);
router.put("/:id", DocumentRequestController.updateDocumentRequest);
router.delete("/:id", DocumentRequestController.deleteDocumentRequest);
// ! get user by docReq id

export default router;
