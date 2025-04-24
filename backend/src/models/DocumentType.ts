import mongoose, { Schema, Document, Model } from "mongoose";

// ! DocumentType is customarily defined by admin as a "template"

export interface IDocumentType extends Document {
  name: string;
  description?: string;
  allowedUploads: string[]; // * file types (pdf,docx,txt) etc.
  requiresHRApproval: boolean;
  createdBy: mongoose.Types.ObjectId;
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
      validate: {
        validator: (types: string[]) => types.length > 0,
        message: "At least one file type must be allowed",
      },
    },
    requiresHRApproval: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

DocumentTypeSchema.index({ name: 1 }, { unique: true });
DocumentTypeSchema.index({ requiresHRApproval: 1 });

const DocumentType: Model<IDocumentType> = mongoose.model<IDocumentType>(
  "DocumentType",
  DocumentTypeSchema
);

export default DocumentType;
