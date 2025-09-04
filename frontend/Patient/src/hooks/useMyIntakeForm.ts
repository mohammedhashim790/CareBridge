import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { intakeFormService } from 'shared-modules/src/services/IntakeFormService';
import type { IntakeForm, Medication } from 'shared-modules/src/types/intake-form';

export const useMyIntakeForm = () => {
  return useQuery<IntakeForm>({
    queryKey: ['myIntakeForm'],
    queryFn: () => intakeFormService.getMyIntakeForm(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateIntakeForm  = (
  options?: UseMutationOptions<IntakeForm, unknown, Medication[]>
) => {
  const queryClient = useQueryClient();
  return useMutation<IntakeForm, unknown, Medication[]>({
    mutationFn: (payload: Medication[]) => intakeFormService.createIntakeForm(payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['myIntakeForm'] });
      options?.onSuccess?.(...args); // Call user-supplied onSuccess if it exists
    },
    ...options,
  });
};

export const useUpdateIntakeForm = (
  options?: UseMutationOptions<IntakeForm, unknown, Partial<IntakeForm>>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<IntakeForm>) => intakeFormService.updateIntakeForm(payload),
    onSuccess: (...args) => {
      queryClient.refetchQueries({ queryKey: ['myIntakeForm'] });
      options?.onSuccess?.(...args); // Call user-supplied onSuccess if it exists
    },
    ...options,
  });
};

export const useDeleteIntakeForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => intakeFormService.deleteIntakeForm(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myIntakeForm'] });
    },
  });
};