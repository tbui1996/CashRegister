import { useMutation, UseMutationOptions } from 'react-query';
import { AxiosError } from 'axios';
import axiosInstance from '../network';
import { ChangeResponse } from '../../types';
const useUploadFile = (
  options: UseMutationOptions<ChangeResponse[], AxiosError, File> = {}
) => {
  return useMutation(
    async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const result = await axiosInstance.post<ChangeResponse[]>(
        '/api/change/file',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return result.data;
    },
    options
  );
};

export default useUploadFile;
