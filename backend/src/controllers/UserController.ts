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
    res.status(500).json({ error: "Eroare la obținerea utilizatorilor" });
  }
};
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "Utilizatorul nu există" });
      return;
    }
    res.json(user);
  } catch {
    res.status(500).json({ error: "Eroare la obținerea utilizatorului" });
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
    res.status(400).json({ error: "Eroare la crearea utilizatorului" });
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
      res.status(404).json({ error: "Utilizatorul nu există" });
      return;
    }
    res.json(user);
  } catch {
    res.status(400).json({ error: "Eroare la actualizare" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ error: "Utilizatorul nu există" });
      return;
    }
    res.json({ message: "Utilizator șters" });
  } catch {
    res.status(500).json({ error: "Eroare la ștergere" });
  }
};

export const getUserDocuments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "Utilizatorul nu există" });
      return;
    }

    const docs = await user.getAccessibleDocuments();
    res.json(docs);
  } catch {
    res.status(500).json({ error: "Eroare la obținerea documentelor" });
  }
};
