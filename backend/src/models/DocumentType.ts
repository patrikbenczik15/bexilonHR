import mongoose, { Schema, Document, Model } from "mongoose";

// ! DocumentType is customarily defined by admin as a "template"

export interface IDocumentType extends Document {
  name: string;
  description?: string;
  allowedUploads: string[];
  requiredDocuments: mongoose.Types.ObjectId[];
  requiresHRApproval: boolean;
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentTypeSchema: Schema<IDocumentType> = new Schema<IDocumentType>(
  {
    name: {
      type: String,
      required: [true, "Document type name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    allowedUploads: {
      type: [String],
      required: true,
      default: ["pdf"],
      validate: {
        validator: (types: string[]) => types.length > 0,
        message: "At least one file type must be allowed",
      },
    },
    requiredDocuments: [
      {
        type: Schema.Types.ObjectId,
        ref: "DocumentType",
      },
    ],
    requiresHRApproval: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

DocumentTypeSchema.index({ name: 1 }, { unique: true });
DocumentTypeSchema.index({ isActive: 1 });
DocumentTypeSchema.index({ requiresHRApproval: 1 });

const DocumentTypeModel: Model<IDocumentType> = mongoose.model<IDocumentType>(
  "DocumentType",
  DocumentTypeSchema
);

export default DocumentTypeModel;
