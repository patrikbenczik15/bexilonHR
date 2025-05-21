import express from "express";
import { DocumentRequestController } from "../controllers/index.ts";
import { protect, restrictTo } from "../middleware/AuthMiddleware.ts";
import { UserRole } from "../utils/enums.ts";

const router = express.Router();

router.use(protect);

router.get("/", DocumentRequestController.getAllDocumentRequests);
router.get("/:id", DocumentRequestController.getDocumentRequestById);
router.post("/", DocumentRequestController.createDocumentRequest);

// * only admin and hr can update and delete
router.put(
  "/:id",
  restrictTo(UserRole.Admin, UserRole.HR),
  DocumentRequestController.updateDocumentRequest
);
router.delete(
  "/:id",
  restrictTo(UserRole.Admin),
  DocumentRequestController.deleteDocumentRequest
);

// TODO ! get user by docReq id (Maybe)

export default router;
