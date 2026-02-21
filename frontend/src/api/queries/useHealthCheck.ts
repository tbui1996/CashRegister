import { UseQueryOptions, UseQueryResult, useQuery } from 'react-query';
import axiosInstance from '../network';

export const useHealthCheckKey = 'health-check';

const useHealthCheck = (
  options: UseQueryOptions<boolean, string> = {}
): UseQueryResult<boolean, string> =>
  useQuery<boolean, string>(
    useHealthCheckKey,
    async () => {
      try {
        await axiosInstance.get('/health');
        return true;
      } catch {
        return false;
      }
    },
    options
  );

export default useHealthCheck;
