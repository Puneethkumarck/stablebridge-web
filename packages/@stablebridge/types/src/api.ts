export interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly details?: readonly string[];
  readonly timestamp: string;
  readonly traceId?: string;
}

export interface DataResponse<T> {
  readonly data: T;
}

export interface PageMeta {
  readonly number: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
}

export interface PageResponse<T> {
  readonly data: readonly T[];
  readonly page: PageMeta;
}
