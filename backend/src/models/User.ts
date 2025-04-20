import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import { DocumentStatus, UserRole } from "../utils/enums.js";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  permissions: Record<string, boolean>;
  documents: mongoose.Types.ObjectId[];
  assignedDocuments: mongoose.Types.ObjectId[];
  documentRequests: mongoose.Types.ObjectId[];
  assignedRequests: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  setPermissions: () => void;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  getAccessibleDocuments: () => Promise<any>;
}

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v: string) => /\S+@\S+\.\S+/.test(v),
        message: props => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.Employee,
      index: true,
    },
    permissions: {
      type: Object,
      of: Boolean,
      default: {},
    },
    documents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Document",
        default: [],
      },
    ],
    assignedDocuments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Document",
        default: [],
      },
    ],
    documentRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "DocumentRequest",
        default: [],
      },
    ],
    assignedRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "DocumentRequest",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.setPermissions = function () {
  const permissions: Record<string, boolean> = {};

  switch (this.role) {
    case UserRole.Admin:
      permissions["canUploadDocument"] = true;
      permissions["canSignDocument"] = true;
      permissions["canApproveDocument"] = true;
      permissions["canSendDocument"] = true;
      permissions["canViewAllDocuments"] = true;
      permissions["canManageDocumentTypes"] = true;
      break;
    case UserRole.HR:
      permissions["canUploadDocument"] = false;
      permissions["canSignDocument"] = false;
      permissions["canApproveDocument"] = false;
      permissions["canSendDocument"] = true;
      permissions["canViewAllDocuments"] = true;
      permissions["canManageDocumentTypes"] = false;
      break;
    case UserRole.Employee:
      permissions["canUploadDocument"] = true;
      permissions["canSignDocument"] = false;
      permissions["canApproveDocument"] = false;
      permissions["canSendDocument"] = false;
      permissions["canViewAllDocuments"] = false;
      permissions["canManageDocumentTypes"] = false;
      break;
    default:
      break;
  }

  this.permissions = permissions;
};
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch {
    return false;
  }
};

UserSchema.methods.getAccessibleDocuments = async function () {
  switch (this.role) {
    case UserRole.Admin:
      return mongoose.model("Document").find().populate("documentType userId");
    case UserRole.HR:
      return mongoose
        .model("Document")
        .find({
          status: DocumentStatus.Pending,
          documentType: { $in: await getHRManagedTypes() },
        })
        .populate("documentType userId");
    case UserRole.Employee:
      return mongoose
        .model("Document")
        .find({ userId: this._id })
        .populate("documentType");
    default:
      return [];
  }
};

async function getHRManagedTypes() {
  const types = await mongoose.model("DocumentType").find({
    requiresHRApproval: true,
  });
  return types.map(t => t._id);
}

UserSchema.pre("save", async function (next) {
  if (!Object.values(UserRole).includes(this.role)) {
    return next(new Error(`Invalid user role: ${this.role}`));
  }

  if (!this.permissions || Object.keys(this.permissions).length === 0) {
    this.setPermissions();
  }

  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error as Error);
    }
  }

  if (this.isModified("role") && this.role === UserRole.HR) {
    const docsToAssign = await mongoose.model("Document").find({
      status: DocumentStatus.Pending,
      "approvalHistory.role": { $ne: UserRole.HR },
    });
    this.assignedDocuments = docsToAssign.map(doc => doc._id);
  }

  next();
});

const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
