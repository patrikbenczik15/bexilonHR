import { Request, Response } from "express";
import { Document, User } from "../models/index.ts";

export const getAllDocuments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const documents = await Document.find();
    res.json(documents);
  } catch {
    res.status(500).json({ error: "Error getting all documents" });
  }
};
export const getDocumentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      res.status(404).json({ error: "Document not found" });
      return;
    }
    res.json(document);
  } catch {
    res.status(500).json({ error: "Error getting document" });
  }
};
export const getUserByDocumentId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const document = await Document.findById(req.params.id).select("userId");
    if (!document) {
      console.log(res);
      res.status(404).json({ error: "Document not found" });
      return;
    }

    const user = await User.findById(document.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch {
    res.status(500).json({ error: "Error getting user" });
  }
};

export const createDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const document = new Document(req.body);
    await document.save();
    res.status(201).json(document);
  } catch {
    res.status(400).json({ error: "Error creating document" });
  }
};

export const updateDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const document = await Document.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      res.status(404).json({ error: "Document not found" });
      return;
    }
    res.json(document);
  } catch {
    res.status(400).json({ error: "Error updating document" });
  }
};

export const deleteDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) {
      res.status(404).json({ error: "Document not found" });
      return;
    }
    res.json({ message: "Document deleted" });
  } catch {
    res.status(500).json({ error: "Error deleting document" });
  }
};
