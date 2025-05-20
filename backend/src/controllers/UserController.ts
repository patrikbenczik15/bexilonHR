import { Request, Response } from "express";
import { User, DocumentRequest } from "../models/index.ts";
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
  try {
    const users = await User.find();
    res.json(users);
  } catch (e: unknown) {
    handleError(res, e, "Error getting users");
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (e: unknown) {
    handleError(res, e, "Error getting user");
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (e: unknown) {
    handleError(res, e, "Error creating user");
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // * check invalid fields
    const schemaFields = Object.keys(User.schema.obj);
    const invalidFields = Object.keys(req.body).filter(
      field => !schemaFields.includes(field)
    );
    if (invalidFields.length > 0) {
      res
        .status(400)
        .json({ error: `Invalid fields: ${invalidFields.join(", ")}` });
      return;
    }

    // * update validated fields
    Object.entries(req.body).forEach(([key, value]) => {
      user.set(key, value); // * triggers validation
    });

    await user.save();
    res.json(user);
  } catch (e: unknown) {
    handleError(res, e, "Error updating user");
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json({ message: "User deleted" });
  } catch (e: unknown) {
    handleError(res, e, "Error deleting user");
  }
};

export const getUserDocuments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const docs = await user.getAccessibleDocuments();
    res.json(docs);
  } catch (e: unknown) {
    handleError(res, e, "Error getting documents");
  }
};

export const getUserDocumentRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;

    if (!mongoose.isValidObjectId(userId)) {
      res.status(400).json({ error: "Invalid user ID format " });
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
        populate: {
          path: "requiredDocuments",
          model: "DocumentType",
        },
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
          {
            path: "userId",
            model: "User",
            select: "name email",
          },
        ],
      })
      .populate({
        path: "assignedTo",
        model: "User",
        select: "name role",
      })
      .lean();

    res.json(requests);
  } catch (e: unknown) {
    handleError(res, e, "Error obtaining requests");
  }
};

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
