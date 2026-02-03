
export enum ReceiptStatus {
  PAID = 'Paid',
  PENDING = 'Pending',
  CANCELLED = 'Cancelled',
}

export interface ReceiptEntry {
  id: string;
  date: string;
  receiptNo: string;
  name: string;
  itemDescription: string;
  customerRequest: string;
  quantity: number;
  price: number;
  discount: number;
  amount: number; // calculated: qty * price
  totalAmount: number; // calculated: amount - discount
  status: ReceiptStatus;
}

export interface FinancialSummary {
  totalRevenue: number;
  pendingAmount: number;
  cancelledAmount: number;
  paidCount: number;
  pendingCount: number;
  cancelledCount: number;
}
