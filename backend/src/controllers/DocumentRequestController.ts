import { Request, Response } from "express";
import mongoose from "mongoose";
import { RequestStatus } from "../utils/enums.ts";
import {
  DocumentRequest,
  DocumentRequestType,
  Document,
} from "../models/index.ts";

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

export const getAllDocumentRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const requests = await DocumentRequest.find()
      .populate("requesterId")
      .populate("documentRequestType")
      .populate("requiredDocuments");
    res.json(requests);
  } catch (e: unknown) {
    handleError(res, e, "Error getting document requests");
  }
};

export const getDocumentRequestById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const request = await DocumentRequest.findById(req.params.id)
      .populate("requesterId")
      .populate("documentRequestType")
      .populate("requiredDocuments")
      .populate("submittedDocuments");

    if (!request) {
      res.status(404).json({ error: "DocumentRequest not found" });
      return;
    }
    res.json(request);
  } catch (e: unknown) {
    handleError(res, e, "Error getting document request");
  }
};

// TODO validare sa nu fie mai multe cereri fix la fel
export const createDocumentRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      documentRequestType,
      submittedDocuments,
      assignedTo,
    } = req.body;

    if (!title?.trim()) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    if (
      !documentRequestType ||
      !mongoose.isValidObjectId(documentRequestType)
    ) {
      res.status(400).json({ error: "Valid documentRequestType is required" });
      return;
    }

    const requestType = await DocumentRequestType.findById(documentRequestType);
    if (!requestType) {
      res.status(400).json({ error: "Invalid document request type" });
      return;
    }

    if (!Array.isArray(submittedDocuments)) {
      res.status(400).json({ error: "Submitted documents must be an array" });
      return;
    }

    const invalidDocIds = submittedDocuments.filter(
      (id: any) => !mongoose.isValidObjectId(id)
    );
    if (invalidDocIds.length > 0) {
      res.status(400).json({
        error: `Invalid document IDs: ${invalidDocIds.join(", ")}`,
      });
      return;
    }

    // * validate all required documents are submitted
    const requiredDocs = requestType.requiredDocuments.map(id => id.toString());
    const submittedDocs = await Document.find({
      _id: { $in: submittedDocuments },
      documentType: { $in: requiredDocs },
    });

    const coveredTypes = submittedDocs.map(doc => doc.documentType.toString());
    const missingTypes = requiredDocs.filter(id => !coveredTypes.includes(id));

    if (missingTypes.length > 0) {
      res.status(400).json({
        error: `Missing required document types: ${missingTypes.join(", ")}`,
      });
      return;
    }

    const newRequest = new DocumentRequest({
      title,
      description,
      documentRequestType,
      requiredDocuments: requestType.requiredDocuments,
      submittedDocuments,
      requesterId: req.body.requesterId, // TODO: Replace with actual user ID after auth
      status: RequestStatus.Pending,
      assignedTo,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (e: unknown) {
    console.log("Request body:", req.body);
    handleError(res, e, "Error creating document request");
  }
};

export const updateDocumentRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const request = await DocumentRequest.findById(req.params.id);
    if (!request) {
      res.status(404).json({ error: "DocumentRequest not found" });
      return;
    }

    const allowedFields = [
      "title",
      "description",
      "status",
      "feedback",
      "assignedTo",
      "documentRequestType",
      "submittedDocuments",
    ];

    const invalidFields = Object.keys(req.body).filter(
      field => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      res.status(400).json({
        error: `Invalid fields: ${invalidFields.join(", ")}`,
      });
      return;
    }

    if (req.body.requesterId) {
      res.status(400).json({ error: "requesterId cannot be modified" });
      return;
    }

    if (req.body.documentRequestType) {
      const newType = await DocumentRequestType.findById(
        req.body.documentRequestType
      );
      if (!newType) {
        res.status(400).json({ error: "Invalid document request type" });
        return;
      }
      request.requiredDocuments = newType.requiredDocuments;
    }

    if (req.body.submittedDocuments) {
      if (!Array.isArray(req.body.submittedDocuments)) {
        res.status(400).json({ error: "submittedDocuments must be an array" });
        return;
      }

      const invalidDocIds = req.body.submittedDocuments.filter(
        (id: any) => !mongoose.isValidObjectId(id)
      );
      if (invalidDocIds.length > 0) {
        res.status(400).json({
          error: `Invalid document IDs: ${invalidDocIds.join(", ")}`,
        });
        return;
      }

      const submittedDocs = await Document.find({
        _id: { $in: req.body.submittedDocuments },
        documentType: { $in: request.requiredDocuments },
      });

      const coveredTypes = submittedDocs.map(doc =>
        doc.documentType.toString()
      );
      const missingTypes = request.requiredDocuments
        .map(id => id.toString())
        .filter(id => !coveredTypes.includes(id));

      if (missingTypes.length > 0) {
        res.status(400).json({
          error: `Missing required document types: ${missingTypes.join(", ")}`,
        });
        return;
      }

      request.submittedDocuments = req.body.submittedDocuments;
    }

    const updatableFields = [
      "title",
      "description",
      "status",
      "feedback",
      "assignedTo",
    ];
    Object.entries(req.body).forEach(([key, value]) => {
      if (updatableFields.includes(key)) {
        request.set(key, value);
      }
    });

    await request.save();
    res.json(
      await request.populate([
        "documentRequestType",
        "submittedDocuments",
        "requesterId",
      ])
    );
  } catch (e: unknown) {
    handleError(res, e, "Error updating document request");
  }
};

// TODO verifica si la restul la update daca poti adauga campuri inexistente in model
export const deleteDocumentRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const request = await DocumentRequest.findByIdAndDelete(req.params.id);
    if (!request) {
      res.status(404).json({ error: "DocumentRequest not found" });
      return;
    }
    res.status(200).json({ message: "DocumentRequest deleted successfully" });
  } catch (e: unknown) {
    handleError(res, e, "Error deleting document request");
  }
};
