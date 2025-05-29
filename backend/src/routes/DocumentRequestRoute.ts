import express from "express";
import { DocumentRequestController } from "../controllers/index.ts";
import { protect, restrictTo } from "../middleware/AuthMiddleware.ts";
import { UserRole } from "../utils/enums.ts";

const router = express.Router();

router.use(protect);

router.get("/users/:id", DocumentRequestController.getDocumentRequestsByUser);

router.get("/:id", DocumentRequestController.getDocumentRequestById);
router.post("/", DocumentRequestController.createDocumentRequest);

router.put("/:id", DocumentRequestController.updateDocumentRequest);

router.get(
  "/",
  restrictTo(UserRole.HR, UserRole.Admin),
  DocumentRequestController.getAllDocumentRequests
);

router.delete(
  "/:id",
  restrictTo(UserRole.Admin),
  DocumentRequestController.deleteDocumentRequest
);

export default router;
