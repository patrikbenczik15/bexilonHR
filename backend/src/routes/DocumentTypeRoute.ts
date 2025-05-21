import express from "express";
import { DocumentTypeController } from "../controllers/index.ts";
import { protect, restrictTo } from "../middleware/AuthMiddleware.ts";
import { UserRole } from "../utils/enums.ts";

const router = express.Router();

router.use(protect);

router.get("/", DocumentTypeController.getAllDocumentTypes);
router.get("/:id", DocumentTypeController.getDocumentTypeById);

// * only admin can create, modify or delete documentTypes
router.post(
  "/",
  restrictTo(UserRole.Admin),
  DocumentTypeController.createDocumentType
);
router.put(
  "/:id",
  restrictTo(UserRole.Admin),
  DocumentTypeController.updateDocumentType
);
router.delete(
  "/:id",
  restrictTo(UserRole.Admin),
  DocumentTypeController.deleteDocumentType
);

export default router;
