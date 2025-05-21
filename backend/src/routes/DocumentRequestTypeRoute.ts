import express from "express";
import { DocumentRequestTypeController } from "../controllers/index.ts";
import { protect, restrictTo } from "../middleware/AuthMiddleware.ts";
import { UserRole } from "../utils/enums.ts";

const router = express.Router();

router.use(protect);

router.get("/", DocumentRequestTypeController.getAllDocumentRequestTypes);
router.get("/:id", DocumentRequestTypeController.getDocumentRequestTypeById);

// * only admin can create, modify or delete documentRequestTypes
router.post(
  "/",
  restrictTo(UserRole.Admin),
  DocumentRequestTypeController.createDocumentRequestType
);
router.put(
  "/:id",
  restrictTo(UserRole.Admin),
  DocumentRequestTypeController.updateDocumentRequestType
);
router.delete(
  "/:id",
  restrictTo(UserRole.Admin),
  DocumentRequestTypeController.deleteDocumentRequestType
);

// TODO get admin by docReqType id (maybe)

export default router;
