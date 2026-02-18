import { apiClient } from '../../../shared/utils/apiClient';
import { type Course, type CourseDetail, type ApiResponse } from '../../../shared/types/api.types';

export const coursesService = {
  async getCourses(params?: {
    page?: number;
    limit?: number;
    difficulty?: string;
    tag?: string;
  }): Promise<{ courses: Course[]; pagination: any }> {
    const response = await apiClient.get<ApiResponse<Course[]>>('/courses', {
      params,
    });

    return {
      courses: response.data || [],
      pagination: response.meta?.pagination,
    };
  },

  async getCourseBySlug(slug: string): Promise<CourseDetail> {
    const response = await apiClient.get<ApiResponse<{ course: CourseDetail }>>(
      `/courses/${slug}`
    );
    return response.data!.course;
  },
};