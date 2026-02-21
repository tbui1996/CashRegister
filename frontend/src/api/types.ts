export interface ChangeRequest {
  amountOwed: number;
  amountPaid: number;
}

export interface ChangeResponse {
  amountOwed: number;
  amountPaid: number;
  change: number;
  denominations: Record<string, number>;
  formattedChange: string;
}