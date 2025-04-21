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

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id/documents", getUserDocuments);
router.get("/:id/documentRequests", getUserDocumentRequests);
// !!! TODO route for assignedDocuments

// TODO ? (maybe) router.get("/search", searchUsers);
// * ^^^    ?role=HR&name=sabrina -> exemplu
// TODO router.get("/me", getCurrentUser); cu JWT pt dashboard

export default router;
