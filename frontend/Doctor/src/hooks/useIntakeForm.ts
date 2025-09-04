import { useQuery } from '@tanstack/react-query';
import { intakeFormService } from 'shared-modules/src/services/IntakeFormService';
import type { IntakeForm } from 'shared-modules/src/types/intake-form';

export const useIntakeFormById = (id: string) => {
  return useQuery<IntakeForm>({
    queryKey: ['myIntakeForm'],
    queryFn: () => intakeFormService.getIntakeFormById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};