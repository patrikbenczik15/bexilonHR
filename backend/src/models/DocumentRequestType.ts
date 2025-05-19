import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDocumentRequestType extends Document {
  name: string;
  description?: string;
  requiredDocuments: mongoose.Types.ObjectId[]; // * documentTypes
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentRequestTypeSchema: Schema<IDocumentRequestType> = new Schema(
  {
    name: {
      type: String,
      required: [true, "DocumentRequest type name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    requiredDocuments: [
      {
        type: Schema.Types.ObjectId,
        ref: "DocumentType",
        required: true,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    strict: "throw",
    timestamps: true,
  }
);

DocumentRequestTypeSchema.index({ name: 1 }, { unique: true });

const DocumentRequestType: Model<IDocumentRequestType> =
  mongoose.model<IDocumentRequestType>(
    "DocumentRequestType",
    DocumentRequestTypeSchema
  );

export default DocumentRequestType;
