import { Request, Response } from "express";
import { User, DocumentRequest } from "../models/index.ts";
import { UserRole } from "../utils/enums.ts";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const handleError = (res: Response, error: any, defaultMessage: string) => {
  if (error instanceof mongoose.Error.ValidationError) {
    return res
      .status(400)
      .json({ error: `Validation failed: ${error.message}` });
  } else if (error instanceof mongoose.Error.CastError) {
    return res
      .status(400)
      .json({ error: `Invalid ID format: ${error.message}` });
  } else {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: defaultMessage });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!["admin", "hr"].includes(req.user?.role || "")) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  try {
    const users = await User.find();
    res.json(users);
  } catch (e) {
    handleError(res, e, "Error getting users");
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const isOwner = req.user?.userId === req.params.id;
  const isPrivileged = ["admin", "hr"].includes(req.user?.role || "");

  if (!isOwner && !isPrivileged) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (e) {
    handleError(res, e, "Error getting user");
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const creatorRole = req.user?.role;
  if (![UserRole.Admin, UserRole.HR].includes(creatorRole!)) {
    res
      .status(403)
      .json({ error: "Access denied: Only admin or HR can create users" });
    return;
  }

  const allowedFields = ["name", "email", "password", "role"];
  const extraFields = Object.keys(req.body).filter(
    (f) => !allowedFields.includes(f)
  );
  if (extraFields.length > 0) {
    res.status(400).json({
      error: `Invalid fields: ${extraFields.join(", ")}`,
      message: `Only the following fields are allowed: ${allowedFields.join(
        ", "
      )}`,
    });
    return;
  }

  const { name, email, password, role = UserRole.Employee } = req.body;
  if (!Object.values(UserRole).includes(role)) {
    res.status(400).json({
      error: `Invalid role: ${role}`,
      validRoles: Object.values(UserRole),
    });
    return;
  }
  if (creatorRole === UserRole.HR && role === UserRole.Admin) {
    res.status(403).json({
      error: "Access denied: HR cannot assign the Admin role",
      message: "Only administrators can create new Admin users",
    });
    return;
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    const userObj: any = newUser.toObject();
    delete userObj.password;
    res.status(201).json({
      message: "User created successfully",
      user: userObj,
    });
  } catch (e) {
    handleError(res, e, "Error creating user");
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const isOwner = req.user?.userId === req.params.id;
  const isPrivileged = ["admin", "hr"].includes(req.user?.role || "");

  if (!isOwner && !isPrivileged) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const adminOnlyFields = ["role"];

    const systemManagedFields = [
      "permissions",
      "_id",
      "createdAt",
      "updatedAt",
    ];

    const specialHandlingFields = [
      "password",
      "documents",
      "assignedDocuments",
      "documentRequests",
      "assignedRequests",
    ];

    const schemaFields = Object.keys(User.schema.obj);
    const invalidFields = Object.keys(req.body).filter(
      (field) => !schemaFields.includes(field)
    );

    if (invalidFields.length > 0) {
      res.status(400).json({
        error: `Invalid fields: ${invalidFields.join(
          ", "
        )}. Valid fields are: ${schemaFields.join(", ")}`,
      });
      return;
    }

    const attemptedSystemFields = Object.keys(req.body).filter((field) =>
      systemManagedFields.includes(field)
    );

    if (attemptedSystemFields.length > 0) {
      res.status(400).json({
        error: `Cannot modify system-managed fields: ${attemptedSystemFields.join(
          ", "
        )}. These fields are automatically managed by the system.`,
      });
      return;
    }

    const attemptedSpecialFields = Object.keys(req.body).filter((field) =>
      specialHandlingFields.includes(field)
    );

    if (attemptedSpecialFields.length > 0) {
      res.status(400).json({
        error: `Cannot modify these fields through this endpoint: ${attemptedSpecialFields.join(
          ", "
        )}. Use dedicated endpoints for these operations.`,
        hint: "Use /auth/change-password for password changes (NOT SUPPORTED YET), and document-specific endpoints for document management.",
      });
      // TODO ^^^^^^^^^^
      return;
    }

    const attemptedAdminFields = Object.keys(req.body).filter((field) =>
      adminOnlyFields.includes(field)
    );

    if (attemptedAdminFields.length > 0) {
      if (isOwner && req.user?.role !== "admin") {
        res.status(403).json({
          error: `Access denied: You cannot modify these administrative fields: ${attemptedAdminFields.join(
            ", "
          )}. Contact an administrator to request role changes.`,
          securityNote:
            "Role changes require administrator approval for security reasons.",
        });
        return;
      }

      if (req.user?.role === "hr" && attemptedAdminFields.includes("role")) {
        res.status(403).json({
          error:
            "Only administrators can modify user roles. HR personnel can modify other user information but not security roles.",
          contact: "Please contact a system administrator for role changes.",
        });
        return;
      }

      // TODO move code below to audit log file
      // if (attemptedAdminFields.includes("role")) {
      //   console.log(
      //     `SECURITY AUDIT: User ${req.user?.userId} (role: ${
      //       req.user?.role
      //     }) attempted to change role of user ${req.params.id} from "${
      //       user.role
      //     }" to "${req.body.role}" at ${new Date().toISOString()}`
      //   );

      //   // Verificare suplimentară: împiedicăm administratorii să își modifice propriul rol
      //   // Aceasta previne scenariile accidentale sau rău intenționate
      //   if (isOwner && req.user?.role === "admin") {
      //     console.log(
      //       `SECURITY WARNING: Administrator ${req.user?.userId} attempted to modify their own role - this is blocked for security`
      //     );
      //     res.status(403).json({
      //       error:
      //         "Administrators cannot modify their own role for security reasons. Another administrator must make this change.",
      //       securityReason:
      //         "This prevents accidental privilege loss and potential security vulnerabilities.",
      //     });
      //     return;
      //   }
      // }
    }

    if (req.body.role && !Object.values(UserRole).includes(req.body.role)) {
      res.status(400).json({
        error: `Invalid role: ${
          req.body.role
        }. Valid roles are: ${Object.values(UserRole).join(", ")}`,
      });
      return;
    }

    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({
        email: req.body.email,
        _id: { $ne: user._id },
      });
      if (existingUser) {
        res.status(400).json({
          error: "Email address is already in use by another user",
        });
        return;
      }
    }

    Object.entries(req.body).forEach(([key, value]) => {
      user.set(key, value);
    });

    await user.save();

    // TODO audit log code below, move to audit log file later
    const modifiedFields = Object.keys(req.body);
    console.log(
      `USER UPDATE: User ${req.user?.userId} (${
        req.user?.role
      }) successfully updated fields [${modifiedFields.join(", ")}] for user ${
        user._id
      } at ${new Date().toISOString()}`
    );

    const { password, ...userResponse } = user.toObject();

    res.json({
      ...userResponse,
      message: `User updated successfully. Modified fields: ${modifiedFields.join(
        ", "
      )}`,
    });
  } catch (e) {
    handleError(res, e, "Error updating user");
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ error: "Only admin can delete users" });
    return;
  }

  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json({ message: "User deleted" });
  } catch (e) {
    handleError(res, e, "Error deleting user");
  }
};

export const getUserDocuments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const isOwner = req.user?.userId === req.params.id;
  const isPrivileged = ["admin", "hr"].includes(req.user?.role || "");

  if (!isOwner && !isPrivileged) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const docs = await user.getAccessibleDocuments();
    res.json(docs);
  } catch (e) {
    handleError(res, e, "Error getting documents");
  }
};

export const getUserDocumentRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  const isOwner = req.user?.userId === req.params.id;
  const isPrivileged = ["admin", "hr"].includes(req.user?.role || "");

  if (!isOwner && !isPrivileged) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  try {
    const userId = req.params.id;

    if (!mongoose.isValidObjectId(userId)) {
      res.status(400).json({ error: "Invalid user ID format" });
      return;
    }

    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      res.status(404).json({ error: "User does not exist" });
      return;
    }

    const requests = await DocumentRequest.find({ requesterId: userId })
      .populate({
        path: "documentRequestType",
        select: "name description requiredDocuments",
        populate: { path: "requiredDocuments", model: "DocumentType" },
      })
      .populate({
        path: "submittedDocuments",
        select: "-file.data",
        populate: [
          {
            path: "documentType",
            model: "DocumentType",
            select: "name allowedUploads",
          },
          { path: "userId", model: "User", select: "name email" },
        ],
      })
      .populate({
        path: "assignedTo",
        model: "User",
        select: "name role",
      })
      .lean();

    res.json(requests);
  } catch (e) {
    handleError(res, e, "Error obtaining requests");
  }
};

// ! TODO MIGHT WANT TO MAKE IT SO EVERY REGISTERED USER IS EMPLOYEE
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    const extraFields = Object.keys(req.body).filter(
      (field) => !["name", "email", "password", "role"].includes(field)
    );

    if (extraFields.length > 0) {
      res.status(400).json({
        error: `Invalid fields: ${extraFields.join(", ")}`,
        message: "Only name, email, password & role are allowed",
      });
      return;
    }

    const newUser = new User({
      name,
      email,
      password,
      role: role || "employee",
    });

    await newUser.save();

    const token = jwt.sign(
      {
        userId: newUser._id,
        role: newUser.role,
        timestamp: Date.now(),
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token,
    });
  } catch (e: unknown) {
    handleError(res, e, "Registration failed");
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const extraFields = Object.keys(req.body).filter(
      (field) => !["email", "password"].includes(field)
    );

    if (extraFields.length > 0) {
      res.status(400).json({
        error: `Invalid fields: ${extraFields.join(", ")}`,
        message: "Only email & password are allowed",
      });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (e: unknown) {
    handleError(res, e, "Login failed");
  }
};

export const checkEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (e: unknown) {
    res.status(500).json({ error: "Server error checking email" });
  }
};
