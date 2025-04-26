import { Request, Response } from "express";
import mongoose from "mongoose";
import { User, DocumentRequestType, DocumentType } from "../models/index.ts";

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

export const getAllDocumentRequestTypes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const types = await DocumentRequestType.find().populate(
      "requiredDocuments"
    );
    res.json(types);
  } catch (e: unknown) {
    handleError(res, e, "Error getting document request types");
  }
};

export const getDocumentRequestTypeById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const type = await DocumentRequestType.findById(req.params.id).populate(
      "requiredDocuments"
    );
    if (!type) {
      res.status(404).json({ error: "DocumentRequestType not found" });
      return;
    }
    res.json(type);
  } catch (e: unknown) {
    handleError(res, e, "Error getting document request type");
  }
};

export const createDocumentRequestType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, requiredDocuments, createdBy } = req.body;

    if (!name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }
    if (!Array.isArray(requiredDocuments) || requiredDocuments.length === 0) {
      res
        .status(400)
        .json({ error: "At least one requiredDocument is needed" });
      return;
    }
    if (!createdBy || !mongoose.isValidObjectId(createdBy)) {
      res.status(400).json({ error: "Valid createdBy (admin ID) is required" });
      return;
    }
    // TODO add JWT validation for security after auth is done
    const user = await User.findById(createdBy);
    if (!user) {
      res.status(400).json({ error: "Creator user not found" });
      return;
    }
    if (user.role !== "admin") {
      res.status(403).json({ error: "User does not have admin privileges" });
      return;
    }

    const newType = new DocumentRequestType({
      name,
      description,
      requiredDocuments,
      createdBy,
    });
    await newType.save();

    res.status(201).json(newType);
  } catch (e: unknown) {
    console.log("Request body:", req.body);
    handleError(res, e, "Error creating document request type");
  }
};
export const updateDocumentRequestType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const type = await DocumentRequestType.findById(req.params.id);
    if (!type) {
      res.status(404).json({ error: "DocumentRequestType not found" });
      return;
    }

    // * validate requiredDocuments field
    if (req.body.requiredDocuments) {
      if (!Array.isArray(req.body.requiredDocuments)) {
        res.status(400).json({ error: "requiredDocuments must be an array" });
        return;
      }
      if (req.body.requiredDocuments.length === 0) {
        res
          .status(400)
          .json({ error: "At least one requiredDocument is needed" });
        return;
      }

      const invalidIds = req.body.requiredDocuments.filter(
        (id: any) => !mongoose.isValidObjectId(id)
      );
      if (invalidIds.length > 0) {
        res.status(400).json({
          error: `Invalid document IDs: ${invalidIds.join(", ")}`,
        });
        return;
      }

      const existingDocsCount = await DocumentType.countDocuments({
        _id: { $in: req.body.requiredDocuments },
      });

      if (existingDocsCount !== req.body.requiredDocuments.length) {
        res.status(400).json({
          error: "One or more document types don't exist",
        });
        return;
      }
    }

    const schemaFields = Object.keys(DocumentRequestType.schema.obj);
    const invalidFields = Object.keys(req.body).filter(
      f => !schemaFields.includes(f)
    );
    if (invalidFields.length > 0) {
      res
        .status(400)
        .json({ error: `Invalid fields: ${invalidFields.join(", ")}` });
      return;
    }
    // TODO might change (might not) when auth is done
    if (req.body.createdBy) {
      res.status(400).json({ error: "createdBy field cannot be modified" });
      return;
    }

    Object.entries(req.body).forEach(([key, value]) => {
      type.set(key, value);
    });

    await type.save();
    res.json(type);
  } catch (e: unknown) {
    handleError(res, e, "Error updating document request type");
  }
};

export const deleteDocumentRequestType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const type = await DocumentRequestType.findByIdAndDelete(req.params.id);
    if (!type) {
      res.status(404).json({ error: "DocumentRequestType not found" });
      return;
    }
    res.status(200).json({ message: "DocumentRequestType deleted" });
  } catch (e: unknown) {
    handleError(res, e, "Error deleting document request type");
  }
};
