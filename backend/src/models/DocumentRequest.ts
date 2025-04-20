import mongoose, { Schema, Document } from "mongoose";
import { RequestStatus } from "../utils/enums.js";

export interface IDocumentRequest extends Document {
  title: string;
  description?: string;
  requesterId: mongoose.Types.ObjectId;
  documentType: mongoose.Types.ObjectId; // * document type for which the request is being made(ex. salary negotiation)
  requiredDocuments: mongoose.Types.ObjectId[];
  submittedDocuments: mongoose.Types.ObjectId[];
  status: RequestStatus;
  feedback?: string;
  assignedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentRequestSchema: Schema<IDocumentRequest> =
  new Schema<IDocumentRequest>(
    {
      title: {
        type: String,
        required: [true, "Request title is required"],
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      requesterId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
      documentType: {
        type: Schema.Types.ObjectId,
        ref: "DocumentType",
        required: true,
      },
      requiredDocuments: [
        {
          type: Schema.Types.ObjectId,
          ref: "DocumentType",
        },
      ],
      submittedDocuments: [
        {
          type: Schema.Types.ObjectId,
          ref: "Document",
        },
      ],
      status: {
        type: String,
        enum: Object.values(RequestStatus),
        default: RequestStatus.Pending,
        index: true,
      },
      feedback: String,
      assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
    {
      timestamps: true,
    }
  );

DocumentRequestSchema.index({ requesterId: 1, status: 1 });
DocumentRequestSchema.index({ assignedTo: 1, status: 1 });

const DocumentRequest = mongoose.model<IDocumentRequest>(
  "DocumentRequest",
  DocumentRequestSchema
);

export default DocumentRequest;
