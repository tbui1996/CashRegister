import { useQuery, useMutation } from 'react-query';
import { cashRegisterAPI, ChangeRequest } from '../api/cashRegisterAPI';

export function useCalculateChange(enabled: boolean = false) {
  return useMutation(
    (request: ChangeRequest) => cashRegisterAPI.calculateChange(request),
    {
      retry: 1,
    }
  );
}

export function useCalculateBatch() {
  return useMutation(
    (requests: ChangeRequest[]) => cashRegisterAPI.calculateBatch(requests),
    {
      retry: 1,
    }
  );
}

export function useUploadFile() {
  return useMutation(
    (file: File) => cashRegisterAPI.uploadFile(file),
    {
      retry: 1,
    }
  );
}

export function useHealthCheck() {
  return useQuery('health', () => cashRegisterAPI.checkHealth(), {
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  });
}
