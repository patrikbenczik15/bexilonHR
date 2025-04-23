import { Request, Response } from "express";
import { User } from "../models/index.ts";
import mongoose from "mongoose";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find();
    res.json(users);
  } catch {
    res.status(500).json({ error: "Error getting users" });
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
  } catch {
    res.status(500).json({ error: "Error getting user" });
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
  } catch {
    res.status(400).json({ error: "Error creating user" });
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

    // * check fields
    const schemaFields = Object.keys(User.schema.obj);
    const invalidFields = Object.keys(req.body).filter(
      field => !schemaFields.includes(field)
    );

    if (invalidFields.length > 0) {
      res.status(400).json({
        error: `Invalid fields: ${invalidFields.join(", ")}`,
      });
      return;
    }

    // * update validated fields
    Object.entries(req.body).forEach(([key, value]) => {
      user.set(key, value); // * set for triggering validations
    });

    await user.save();

    res.json(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error: `Failed validation: ${e.message}` });
    } else if (e instanceof mongoose.Error.CastError) {
      res.status(400).json({ error: `Invalid id or typer: ${e.message}` });
    } else {
      console.error("Unexpected error:", e);
      res.status(500).json({ error: "Internal error in updating" });
    }
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
    res.json({ message: "User deleted" });
  } catch {
    res.status(500).json({ error: "Error deleting user" });
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
  } catch {
    res.status(500).json({ error: "Error getting documents" });
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

    const docRequests = await user.getDocumentRequests();
    res.json(docRequests);
  } catch {
    res.status(500).json({ error: "Error getting document requests" });
  }
};
