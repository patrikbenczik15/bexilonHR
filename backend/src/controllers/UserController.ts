import { Request, Response } from "express";
import UserModel from "../models/User.ts";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await UserModel.find();
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
    const user = await UserModel.findById(req.params.id);
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
    const user = new UserModel(req.body);
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
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch {
    res.status(400).json({ error: "Error updating" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
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
    const user = await UserModel.findById(req.params.id);
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
    const user = await UserModel.findById(req.params.id);
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
