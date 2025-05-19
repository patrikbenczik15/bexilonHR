import mongoose, { Schema, Document, Model } from "mongoose";
import { UserRole, DocumentStatus } from "../utils/enums.ts";

// ! Document refers to all the files uploaded as per DocumentType rules(what files are needed and so on)

export interface IDocument extends Document {
  name: string;
  description?: string;
  userId: mongoose.Types.ObjectId;
  documentType: mongoose.Types.ObjectId;
  file: {
    data: Buffer;
    contentType: string;
    size: number;
    originalName: string;
  };
  status: DocumentStatus;
  feedback: string;
  approvalHistory: {
    role: UserRole;
    action: "upload" | "approve" | "reject" | "sign" | "request_revision";
    comment?: string;
    date: Date;
  }[];
  expiresAt?: Date; // * for documents with expire date
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema: Schema<IDocument> = new Schema<IDocument>(
  {
    name: {
      type: String,
      required: [true, "Document name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    documentType: {
      type: Schema.Types.ObjectId,
      ref: "DocumentType",
      required: true,
      index: true,
    },
    file: {
      data: {
        type: Buffer,
        required: true,
      },
      contentType: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
        required: true,
        min: [1, "File size must be at least 1 byte"],
      },
      originalName: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: Object.values(DocumentStatus),
      default: DocumentStatus.Pending,
      index: true,
    },
    feedback: {
      type: String,
      default: "",
    },

    approvalHistory: [
      {
        role: {
          type: String,
          enum: Object.values(UserRole),
          required: true,
        },
        action: {
          type: String,
          enum: ["upload", "approve", "reject", "sign", "request_revision"],
          required: true,
        },
        comment: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    expiresAt: {
      type: Date,
      index: { expireAfterSeconds: 0 }, // * for auto expire-date
    },
    metadata: Schema.Types.Mixed,
  },
  {
    strict: "throw",
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.file.data; // * delete binary data(NOT deleting from DB the file itself, just not sending bin.data to api)
        return ret;
      },
    },
  }
);

// * check if valid before save
DocumentSchema.pre<IDocument>("save", async function (next) {
  const docType = await mongoose
    .model("DocumentType")
    .findById(this.documentType);
  if (!docType) {
    return next(new Error("Invalid document type"));
  }

  // * check file type
  const fileExtension = this.file.originalName.split(".").pop()?.toLowerCase();
  if (!docType.allowedUploads.includes(fileExtension || "")) {
    return next(
      new Error(`File type ${fileExtension} not allowed for this document type`)
    );
  }

  // ! TODO MOVE THIS INSIDE DOCUMENT REQUEST -> ERROR HANDLING
  // const missingDocs = await mongoose.model("Document").find({
  //   _id: { $nin: this.requiredDocuments },
  //   documentType: { $in: docType.requiredDocuments },
  //   userId: this.userId,
  //   status: { $in: [DocumentStatus.Valid, DocumentStatus.SignedByAdmin] },
  // });

  // if (missingDocs.length > 0) {
  //   return next(new Error("Missing required documents"));
  // }

  next();
});

DocumentSchema.virtual("requiredDocumentDetails", {
  ref: "Document",
  localField: "requiredDocuments",
  foreignField: "_id",
});

DocumentSchema.index({ userId: 1, status: 1 });
DocumentSchema.index({ documentType: 1, status: 1 });

const DocumentModel: Model<IDocument> = mongoose.model<IDocument>(
  "Document",
  DocumentSchema
);

export default DocumentModel;
