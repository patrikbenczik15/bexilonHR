import { Request, Response } from "express";
import { DocumentType, User, Document } from "../models/index.ts";
import mongoose from "mongoose";

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

export const getAllDocumentTypes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const documentTypes = await DocumentType.find();
    res.json(documentTypes);
  } catch (e: unknown) {
    handleError(res, e, "Error getting documentTypes");
  }
};

export const getDocumentTypeById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const documentType = await DocumentType.findById(req.params.id);
    if (!documentType) {
      res.status(404).json({ error: "DocumentType not found" });
      return;
    }
    res.json(documentType);
  } catch (e: unknown) {
    handleError(res, e, "Error getting documentType");
  }
};

export const createDocumentType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, createdBy, allowedUploads } = req.body;
    // TODO MAJOR SECURITY ISSUES, CREATED BY SHOULDNT BE PASSED IN REQ.BODY
    // TODO FIX THIS WITH JWT AUTH(WHEN ITS IMPLEMENTED)

    if (!name) {
      res.status(400).json({ error: "Document type name is required" });
      return;
    }

    if (!createdBy) {
      res.status(400).json({ error: "Admin ID is required" });
      return;
    }
    if (!mongoose.isValidObjectId(createdBy)) {
      res.status(400).json({ error: "Invalid adminID format" });
      return;
    }

    if (!allowedUploads || allowedUploads.length === 0) {
      res.status(400).json({
        error: "Invalid allowedUploads format, need at least 1 file extension",
      });
      return;
    }

    const creator = await User.findById(createdBy);
    if (!creator) {
      res.status(400).json({ error: "Admin not found" });
      return;
    }

    if (creator.role != "admin") {
      res.status(400).json({ error: "User does not have admin privileges" });
      return;
    }

    const documentType = new DocumentType({ name, createdBy, allowedUploads });
    await documentType.save();

    res.status(201).json(documentType);
  } catch (e: unknown) {
    console.log("Body request:", req.body);
    handleError(res, e, "Error creating documentType");
  }
};

// ! If document type allowedUploads changes(file extensions permitted), delete the
// ! ones that don't match
export const updateDocumentType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const documentType = await DocumentType.findById(req.params.id);
    if (!documentType) {
      res.status(404).json({ error: "DocumentType not found" });
      return;
    }
    // TODO MAJOR SECURITY ISSUES, CREATED BY SHOULDNT BE PASSED IN REQ.BODY
    // TODO FIX THIS WITH JWT AUTH(WHEN ITS IMPLEMENTED)
    // TODO CURRENTLY IT DOESNT WORK BECAUSE WE CANT VALIDATE ADMINS.
    const oldAllowedUploads = documentType.allowedUploads;

    // * validate fields
    const schemaFields = Object.keys(DocumentType.schema.obj);
    const invalidFields = Object.keys(req.body).filter(
      field => !schemaFields.includes(field)
    );

    if (invalidFields.length > 0) {
      res
        .status(400)
        .json({ error: `Invalid fields: ${invalidFields.join(", ")}` });
      return;
    }

    Object.entries(req.body).forEach(([key, value]) => {
      documentType.set(key, value);
    });

    await documentType.save();

    if (
      req.body.allowedUploads &&
      !arraysAreEqual(oldAllowedUploads, documentType.allowedUploads)
    ) {
      await Document.deleteMany({
        documentType: documentType._id,
        fileExtension: { $nin: documentType.allowedUploads },
      });
    }

    res.json(documentType);
  } catch (e: unknown) {
    handleError(res, e, "Error updating documentType");
  }
};

const arraysAreEqual = (a: string[], b: string[]): boolean => {
  return a.length === b.length && a.every((val, index) => val === b[index]);
};

export const deleteDocumentType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const documentType = await DocumentType.findByIdAndDelete(req.params.id);
    if (!documentType) {
      res.status(404).json({ error: "DocumentType not found" });
      return;
    }
    res.status(200).json({ message: "DocumentType deleted" });
  } catch (e: unknown) {
    handleError(res, e, "Error deleting documentType");
  }
};
