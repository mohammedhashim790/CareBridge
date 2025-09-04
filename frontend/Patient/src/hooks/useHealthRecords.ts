import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthRecordsService } from 'shared-modules/src/api/HealthRecordsService';
import type {
  BloodCountChartData, 
  HealthRecords, 
  HealthRecordsPostData,
} from 'shared-modules/src/types/health-records';

export const useAllMyHealthRecords = () => {
  return useQuery<HealthRecords[]>({
    queryKey: ['myAllHealthRecords'],
    queryFn: () => healthRecordsService.getAllMyHealthRecords(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMyHealthRecordsForToday = () => {
  return useQuery<HealthRecords>({
    queryKey: ['myHealthRecordsForToday'],
    queryFn: () => healthRecordsService.getMyHealthRecordsForToday(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateHealthRecords = () => {
  const queryClient = useQueryClient();

  return useMutation<HealthRecords, unknown, HealthRecordsPostData>({
    mutationFn: (payload: HealthRecordsPostData) => healthRecordsService.createMyHealthRecords(payload),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['myHealthRecordsForToday'] });
      queryClient.refetchQueries({ queryKey: ['myBloodCountChartData'] });
    },
  });
};

export const useMyBloodCount = () => {
  return useQuery<BloodCountChartData>({
    queryKey: ['myBloodCountChartData'],
    queryFn: () => healthRecordsService.getMyBloodCount(),
    staleTime: 1000 * 60 * 5,
  });
}