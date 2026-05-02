export interface ComparisonPreference {
  id: string;
  label: string;
  category: string;
  unitPrice: number;
  unitLabel: string;
}

export interface ComparisonResult {
  id: string;
  label: string;
  quantity: number;
  unitLabel: string;
}
