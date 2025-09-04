export type GenderType = 'All' | 'male' | 'female' | 'other';

export type PatientGender = Exclude<GenderType, 'All'>;