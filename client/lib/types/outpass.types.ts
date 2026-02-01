// client/lib/types/outpass.types.ts
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
  proofUrl?: string;
  proofPublicId?: string;
  status: OutpassStatus;
  parentApproval: ApprovalStatus;
  wardenApproval: ApprovalStatus;
  wardenRejectionComment?: string;
  parentApprovedAt?: string;
  wardenApprovedAt?: string;
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