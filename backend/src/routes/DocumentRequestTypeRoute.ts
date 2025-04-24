import express from "express";
import { DocumentRequestTypeController } from "../controllers/index.ts";

const router = express.Router();

router.get("/", DocumentRequestTypeController.getAllDocumentRequestTypes);
router.get("/:id", DocumentRequestTypeController.getDocumentRequestTypeById);
router.post("/", DocumentRequestTypeController.createDocumentRequestType);
router.put("/:id", DocumentRequestTypeController.updateDocumentRequestType);
router.delete("/:id", DocumentRequestTypeController.deleteDocumentRequestType);
// ! get admin by docReqType id

export default router;
