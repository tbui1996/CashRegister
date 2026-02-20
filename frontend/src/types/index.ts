export interface ChangeResponse {
  amountOwed: number;
  amountPaid: number;
  change: number;
  denominations: Record<string, number>;
  formattedChange: string;
}

export interface CalculationState {
  amountOwed: string;
  amountPaid: string;
  result: ChangeResponse | null;
  error: string | null;
  loading: boolean;
}
