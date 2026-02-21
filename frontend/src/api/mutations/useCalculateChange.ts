import { useMutation, UseMutationOptions } from 'react-query';
import { AxiosError } from 'axios';
import axiosInstance from '../network';
import {ChangeRequest, ChangeResponse} from '../types/index';
const useCalculateChange = (
  options: UseMutationOptions<ChangeResponse, AxiosError, ChangeRequest> = {}
) => {
  return useMutation(
    async (params: ChangeRequest) => {
      const result = await axiosInstance.post<ChangeResponse>(
        '/api/change',
        params
      );
      return result.data;
    },
    options
  );
};

export default useCalculateChange;
