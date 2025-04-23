import { Request, Response } from "express";
import { User } from "../models/index.ts";
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
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const documentRequests = await user.getDocumentRequests();
    res.json(documentRequests);
  } catch (e: unknown) {
    handleError(res, e, "Error getting document requests");
  }
};
