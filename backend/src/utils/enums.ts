export enum UserRole {
  Employee = "employee",
  HR = "hr",
  Admin = "admin",
}

export enum DocumentStatus {
  Pending = "pending",
  Valid = "valid",
  Invalid = "invalid",
  ApprovedByHR = "approvedByHR",
  SignedByAdmin = "signedByAdmin",
  RevisionRequired = "revisionRequired",
}

export const UserRoleValues = Object.values(UserRole);
export const DocumentStatusValues = Object.values(DocumentStatus);
