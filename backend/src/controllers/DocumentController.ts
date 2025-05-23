import { Request, Response } from "express";
import { Document, User } from "../models/index.ts";
import mongoose from "mongoose";
import { UserRole } from "../utils/enums.ts";

const handleError = (
  res: Response,
  error: unknown,
  defaultMessage: string
): void => {
  if (error instanceof mongoose.Error.ValidationError) {
    console.error("Validation error:", error);
    res.status(400).json({ error: `Validation failed: ${error.message}` });
  } else if (error instanceof mongoose.Error.CastError) {
    console.error("Cast error:", error);
    res.status(400).json({ error: `Invalid ID format: ${error.message}` });
  } else if (error instanceof Error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: defaultMessage });
  } else {
    console.error("Unknown error:", error);
    res.status(500).json({ error: "An unknown error occurred." });
  }
};

export const getAllDocuments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = req.user?.role;
    if (role !== UserRole.HR && role !== UserRole.Admin) {
      res
        .status(403)
        .json({ error: "Access forbidden: Insufficient permissions" });
      return;
    }

    const documents = await Document.find();
    res.json(documents);
  } catch (e: unknown) {
    if (e instanceof mongoose.Error) {
      res.status(400).json({ error: e.message });
    } else {
      console.error(e);
      res.status(500).json({ error: "Error getting documents" });
    }
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

    if (
      req.user?.role === UserRole.Employee &&
      document.userId.toString() !== req.user.userId
    ) {
      res.status(403).json({ error: "Access forbidden" });
      return;
    }

    res.json(document);
  } catch (e: unknown) {
    handleError(res, e, "Error getting document");
  }
};

export const getUserByDocumentId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const document = await Document.findById(req.params.id).select("userId");
    if (!document) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    const user = await User.findById(document.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (e: unknown) {
    handleError(res, e, "Error getting user for document");
  }
};

export const createDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = req.user?.role;
    let userId = req.body.userId;

    if (role === UserRole.Employee) {
      userId = req.user?.userId;
    }

    if (!userId) {
      res.status(400).json({ error: "userId is required" });
      return;
    }
    if (!mongoose.isValidObjectId(userId)) {
      res.status(400).json({ error: "Invalid userId format" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const { documentType, ...rest } = req.body;

    // * validate documentType ref
    if (documentType !== undefined) {
      if (!mongoose.isValidObjectId(documentType)) {
        res.status(400).json({ error: "Invalid documentType format" });
        return;
      }
      const DocumentType = mongoose.model("DocumentType");
      const docType = await DocumentType.findById(documentType);
      if (!docType) {
        res.status(400).json({ error: "documentType not found" });
        return;
      }
    }

    const document = new Document({ userId, documentType, ...rest });
    await document.save();
    res.status(201).json(document);
  } catch (e: unknown) {
    handleError(res, e, "Error creating document");
  }
};

export const updateDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    const role = req.user?.role;
    const currentUserId = req.user?.userId;
    if (
      role !== UserRole.Admin &&
      document.userId.toString() !== currentUserId
    ) {
      res
        .status(403)
        .json({ error: "Access forbidden: Cannot update this document" });
      return;
    }

    if (req.body.userId !== undefined) {
      res.status(400).json({ error: "Updating userId is not allowed" });
      return;
    }

    if (req.body.documentType !== undefined) {
      const dtId = req.body.documentType;

      if (!mongoose.isValidObjectId(dtId)) {
        res.status(400).json({ error: "Invalid documentType format" });
        return;
      }

      const DocumentType = mongoose.model("DocumentType");
      const docType = await DocumentType.findById(dtId);
      if (!docType) {
        res.status(400).json({ error: "documentType not found" });
        return;
      }
    }

    const schemaFields = Object.keys(Document.schema.obj);
    const invalidFields = Object.keys(req.body).filter(
      field => !schemaFields.includes(field)
    );

    if (invalidFields.length > 0) {
      res
        .status(400)
        .json({ error: `Invalid fields: ${invalidFields.join(", ")}` });
      return;
    }

    // * apply updates *
    Object.entries(req.body).forEach(([key, value]) => {
      document.set(key, value);
    });

    await document.save();
    res.json(document);
  } catch (e: unknown) {
    handleError(res, e, "Error updating document");
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
    res.status(200).json({ message: "Document deleted" });
  } catch (e: unknown) {
    handleError(res, e, "Error deleting document");
  }
};
