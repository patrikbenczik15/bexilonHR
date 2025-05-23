import express from "express";
import { DocumentController } from "../controllers/index.ts";
import { UserRole } from "../utils/enums.ts";
import { protect, restrictTo } from "../middleware/AuthMiddleware.ts";

const router = express.Router();

// * Document routes

router.get(
  "/",
  protect,
  restrictTo(UserRole.Admin, UserRole.HR),
  DocumentController.getAllDocuments
);

router.get("/:id", protect, DocumentController.getDocumentById);

router.get(
  "/:id/user",
  protect,
  restrictTo(UserRole.Admin, UserRole.HR),
  DocumentController.getUserByDocumentId
);

router.post("/", protect, DocumentController.createDocument);

router.put(
  "/:id",
  protect,
  restrictTo(UserRole.HR, UserRole.Admin),
  DocumentController.updateDocument
);

router.delete(
  "/:id",
  protect,
  restrictTo(UserRole.Admin),
  DocumentController.deleteDocument
);

export default router;
