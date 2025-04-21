import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserDocuments,
  getUserDocumentRequests,
} from "../controllers/UserController.ts";

const router = express.Router();

// ! Legătura între rute și funcțiile din controller
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id/documents", getUserDocuments);
router.get("/:id/documentRequests", getUserDocumentRequests);
export default router;
