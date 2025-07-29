export interface BaseResponse<T> {
  data: T;
  message: string;
  status: string;
  statusCode: number;
}
