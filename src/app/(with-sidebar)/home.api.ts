import api from '@/store/api';
import { BaseResponse } from '@/types';

type GetInvoiceAnalyticsResponse = BaseResponse<{
  overview: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    averageProcessingTime: number;
    totalCost: number;
  };
  trends: {
    processingTimes: number[];
    costs: number[];
    volumes: number[];
  };
}>;

enum HOME_API_ENDPOINTS {
  GET_INVOICE_ANALYTICS = '/invoices/analytics/trends',
}
const homeApi = api.injectEndpoints({
  endpoints: (build) => ({
    getInvoiceAnalytics: build.query<GetInvoiceAnalyticsResponse, void>({
      query: () => HOME_API_ENDPOINTS.GET_INVOICE_ANALYTICS,
    }),
  }),
});

export const { useGetInvoiceAnalyticsQuery } = homeApi;
