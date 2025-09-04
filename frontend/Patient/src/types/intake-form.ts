interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  stillTaking: boolean;
  endDate?: string;
}

export type {
  Medication,
}