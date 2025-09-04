import { useQuery } from '@tanstack/react-query';
import { doctorService } from '../../services/DoctorService';
import type { MyPatient } from '../../types/patients/patient';

export const useMyPatients = () => {
  return useQuery<MyPatient[]>({
    queryKey: ['myPatients'],
    queryFn: () => doctorService.getMyPatients(),
    staleTime: 1000 * 60 * 5, // optional: 5 minutes
  });
};