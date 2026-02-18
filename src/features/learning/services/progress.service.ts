import { apiClient } from '../../../shared/utils/apiClient';
import {
  type CompleteStepInput,
  type CompleteStepResponse,
  type UserProgress,
  type ApiResponse,
} from '../../../shared/types/api.types';

export const progressService = {
  async completeStep(data: CompleteStepInput): Promise<CompleteStepResponse> {
    const response = await apiClient.post<ApiResponse<CompleteStepResponse>>(
      '/progress/step',
      data
    );
    return response.data!;
  },

  async getUserProgress(): Promise<UserProgress> {
    const response = await apiClient.get<ApiResponse<UserProgress>>(
      '/progress/me'
    );
    return response.data!;
  },
};