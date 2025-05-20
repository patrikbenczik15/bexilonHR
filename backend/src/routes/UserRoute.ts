import express from "express";
import { UserController } from "../controllers/index.ts";
import { protect } from "../middleware/AuthMiddleware.ts";
const router = express.Router();

// * test

router.get("/me", protect, (req: express.Request, res: express.Response) => {
  res.json({
    message: "Succesful authentication",
    user: req.user,
  });
});

router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.post("/", UserController.createUser);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);
router.get("/:id/documents", UserController.getUserDocuments);
router.get("/:id/document-requests", UserController.getUserDocumentRequests);

// !!! TODO route for assignedDocuments

// TODO ? (maybe) router.get("/search", searchUsers);
// * ^^^    ?role=HR&name=sabrina -> exemplu
// TODO router.get("/me", getCurrentUser); cu JWT pt dashboard

export default router;
