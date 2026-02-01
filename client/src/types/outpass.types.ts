// client/src/types/outpass.types.ts
export type OutpassType = "DAY_PASS" | "LEAVE_PASS";
export type OutpassStatus = "PENDING" | "PARENT_APPROVED" | "APPROVED" | "REJECTED" | "CANCELLED";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface OutpassRequest {
  id: string;
  studentId: string;
  type: OutpassType;
  reason: string;
  outgoingDate: string;
  returningDate: string;
  proofUrl: string | null;
  proofPublicId: string | null;
  status: OutpassStatus;
  parentApproval: ApprovalStatus;
  parentApprovedAt: string | null;
  wardenApproval: ApprovalStatus;
  wardenApprovedAt: string | null;
  wardenRejectionComment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OutpassStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  cancelled: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}
