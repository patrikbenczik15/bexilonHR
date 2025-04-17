import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditLog extends Document {
  action: string; // * action description (ex: "Document uploaded", "Document approved")
  performedBy: mongoose.Types.ObjectId;
  target: mongoose.Types.ObjectId; // * the document
  createdAt: Date;
}

const AuditLogSchema: Schema<IAuditLog> = new Schema<IAuditLog>(
  {
    action: {
      type: String,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const AuditLogModel: Model<IAuditLog> = mongoose.model<IAuditLog>(
  "AuditLog",
  AuditLogSchema
);
export default AuditLogModel;
