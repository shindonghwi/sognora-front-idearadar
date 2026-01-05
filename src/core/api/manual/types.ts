/**
 * API Response Types (Manual)
 *
 * This file is manually managed (not affected by make swagger)
 * Common API response wrapper type for all API endpoints
 */

/**
 * Common API Response Wrapper
 * All API responses follow this structure:
 * {
 *   statusCode: 200,
 *   message: "OK",
 *   data: T
 * }
 *
 * Usage:
 * ```typescript
 * const response = await authApi.apiV1AuthLoginPost(dto);
 * const apiResponse = response.data as ApiResponse<AuthTokenRO>;
 * const tokenData = apiResponse.data;
 * ```
 */
export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data: T;
}
