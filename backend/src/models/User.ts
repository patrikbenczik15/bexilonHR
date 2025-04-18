import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

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
  comparePassword: (candidatePassword: string) => Promise<boolean>;
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

// Compare passwords function
// UserSchema.methods.comparePassword = async function (
//   candidatePassword: string
// ): Promise<boolean> {
//   try {
//     return await bcrypt.compare(candidatePassword, this.password);
//   } catch (error) {
//     return false;
//   }
// };

// ! hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.permissions || Object.keys(this.permissions).length === 0) {
    this.setPermissions();
  }

  // ! only hash password if its new or changed existing one
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
