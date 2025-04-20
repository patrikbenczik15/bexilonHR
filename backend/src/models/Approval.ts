import mongoose, { Schema, Document, Model } from "mongoose";
// TODO modificat sa dea approve la DocumentRequest
export interface IApproval extends Document {
  document: mongoose.Types.ObjectId;
  approvedBy: mongoose.Types.ObjectId;
  approvedAt: Date;
  comments?: string;
}

const ApprovalSchema: Schema<IApproval> = new Schema<IApproval>(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approvedAt: {
      type: Date,
      required: true,
    },
    comments: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ApprovalModel: Model<IApproval> = mongoose.model<IApproval>(
  "Approval",
  ApprovalSchema
);
export default ApprovalModel;
