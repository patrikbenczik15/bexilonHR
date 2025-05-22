import express from "express";
import { UserController } from "../controllers/index.ts";
import { UserRole } from "../utils/enums.ts";
import { protect, restrictTo } from "../middleware/AuthMiddleware.ts";

const router = express.Router();

router.get("/me", protect, (req: express.Request, res: express.Response) => {
  res.json({
    message: "Succesful authentication",
    user: req.user,
  });
});

// * private routes

router.get(
  "/",
  protect,
  restrictTo(UserRole.Admin, UserRole.HR),
  UserController.getAllUsers
);

router.get("/:id", protect, UserController.getUserById);
router.post(
  "/",
  protect,
  restrictTo(UserRole.Admin),
  UserController.createUser
);
router.put("/:id", protect, UserController.updateUser);

// TODO Might change later so user can delete himself
router.delete(
  "/:id",
  protect,
  restrictTo(UserRole.Admin),
  UserController.deleteUser
);

router.get("/:id/documents", protect, UserController.getUserDocuments);

router.get(
  "/:id/document-requests",
  protect,
  UserController.getUserDocumentRequests
);

// !!! TODO route for assignedDocuments

// TODO ? (maybe) router.get("/search", searchUsers);
// * ^^^    ?role=HR&name=sabrina -> exemplu
// TODO router.get("/me", getCurrentUser); cu JWT pt dashboard

export default router;
