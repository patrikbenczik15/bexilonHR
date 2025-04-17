import mongoose, { Schema, Document, Model } from "mongoose";
// TODO stocat documente vezi gridFS
export enum DocumentStatus {
  Pending = "pending",
  Valid = "valid",
  Invalid = "invalid",
  ApprovedByHR = "approvedByHR",
  SignedByAdmin = "signedByAdmin",
}

export interface IDocument extends Document {
  userId: mongoose.Types.ObjectId;
  file: Buffer;
  status: DocumentStatus;
  feedback: string; // * AI Feedback
  approvalHistory: {
    role: string; // * HR or Admin
    action: string; // * approve or sign
    date: Date;
  }[]; // * log action history
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema: Schema<IDocument> = new Schema<IDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    file: {
      type: Buffer,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(DocumentStatus),
      default: DocumentStatus.Pending,
    },
    feedback: {
      type: String,
      default: "",
    },
    approvalHistory: [
      {
        role: {
          type: String,
          enum: ["HR", "Admin"],
        },
        action: {
          type: String,
          enum: ["Approved", "Signed"],
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const DocumentModel: Model<IDocument> = mongoose.model<IDocument>(
  "Document",
  DocumentSchema
);
export default DocumentModel;
