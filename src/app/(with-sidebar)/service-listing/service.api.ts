import api from '@/store/api';
import { BaseResponse } from '@/types';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types for the API response
interface InvoiceData {
  fileUrl: string;
  s3Key: string;
  fileName: string;
  originalName: string;
  processingStatus: string;
  rawText: string;
  aiConfidence: number;
  processingError?: string;
  uploadedAt: string;
  processingMetrics: {
    parsingTime: number;
    totalTime: number;
    _id: string;
  };
  processedAt: string;
}

interface VehicleInfo {
  vin: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number | null;
  mileage: number;
  _id: string;
}

interface ServiceDetail {
  type: string;
  description: string;
  cost: number;
  laborHours: number | null;
}

interface PartItem {
  name: string;
  partNumber: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

interface Costs {
  subtotal: number;
  laborCost: number;
  partsCost: number;
  taxAmount: number;
  totalCost: number;
  _id: string;
}

interface ExtractedData {
  serviceDate: string;
  invoiceNumber: string;
  shopName: string | null;
  shopAddress: string | null;
  shopPhone: string | null;
  vehicleInfo: VehicleInfo;
  services: ServiceDetail[];
  parts: PartItem[];
  costs: Costs;
  warranty: {
    _id: string;
  };
}

export interface ServiceItem {
  _id: string;
  createdBy: string;
  userId: string;
  serviceNo: string;
  refNo: string;
  regNo: string;
  serviceType: string;
  status: string;
  priority: string;
  description: string;
  invoice: InvoiceData;
  extractedData: ExtractedData;
  userEditedData: any;
  isDataVerified: boolean;
  requiresManualReview: boolean;
  additionalAttachments: any[];
  createdParts: any[];
  totalCost: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  __v: number;
  serviceDate: string;
}

type ServicesResponse = BaseResponse<{
  data: ServiceItem[];
  meta_data: {
    search_query: string;
    page: number;
    page_size: number;
    count: number;
  };
}>;

// Search parameters interface
export interface ServiceSearchParams {
  search?: string;
  vehicleId?: string;
  status?: string;
  serviceType?: string;
}

// Export response interface
export interface ExportResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    success: boolean;
    message: string;
    url: string;
    filename: string;
    contentType: string;
    generatedAt: string;
    fromCache: boolean;
    regenerated: boolean;
  };
}

enum SERVICE_API_ENDPOINTS {
  GET_SERVICES = '/services?pageSize=100',
  EXPORT_SERVICE = '/services',
}

// Create a custom base query for the export service with the specific URL
const exportServiceBaseQuery = fetchBaseQuery({
  baseUrl: 'https://trader-adam-affects-attempt.trycloudflare.com',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const serviceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<ServicesResponse, ServiceSearchParams | void>({
      query: (params) => {
        if (!params) {
          return SERVICE_API_ENDPOINTS.GET_SERVICES;
        }

        const searchParams = new URLSearchParams();

        if (params.search) {
          searchParams.append('search', params.search);
        }
        if (params.vehicleId) {
          searchParams.append('vehicleId', params.vehicleId);
        }
        if (params.status) {
          searchParams.append('status', params.status);
        }
        if (params.serviceType) {
          searchParams.append('serviceType', params.serviceType);
        }

        const queryString = searchParams.toString();
        return queryString
          ? `${SERVICE_API_ENDPOINTS.GET_SERVICES}?${queryString}`
          : SERVICE_API_ENDPOINTS.GET_SERVICES;
      },
    }),
    exportService: builder.mutation<ExportResponse, { id: string; format: 'pdf' | 'excel' }>({
      queryFn: async ({ id, format }, api) => {
        try {
          const result = await exportServiceBaseQuery(
            `${SERVICE_API_ENDPOINTS.EXPORT_SERVICE}/${id}/export?format=${format}`,
            api,
            {},
          );

          if (result.error) {
            return { error: result.error };
          }

          return { data: result.data as ExportResponse };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
    }),
  }),
});

export const { useGetServicesQuery, useExportServiceMutation } = serviceApi;
