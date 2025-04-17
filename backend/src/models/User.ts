import mongoose, { Schema, Document, Model } from "mongoose";

export enum UserRole {
  Employee = "employee",
  HR = "hr",
  Admin = "admin",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  permissions: Record<string, boolean>;
  createdAt: Date;
  updatedAt: Date;
  setPermissions: () => void;
}

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.Employee,
      index: true,
    },
    permissions: {
      type: Map,
      of: Boolean,
      default: {},
    },
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
      break;
    case UserRole.HR:
      permissions["canUploadDocument"] = false;
      permissions["canSignDocument"] = false;
      permissions["canApproveDocument"] = false;
      permissions["canSendDocument"] = true;
      permissions["canViewAllDocuments"] = true;
      break;
    case UserRole.Employee:
      permissions["canUploadDocument"] = true;
      permissions["canSignDocument"] = false;
      permissions["canApproveDocument"] = false;
      permissions["canSendDocument"] = false;
      permissions["canViewAllDocuments"] = false;
      break;
    default:
      break;
  }

  this.permissions = permissions;
};

UserSchema.pre("save", function (next) {
  this.setPermissions();
  next();
});

const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
